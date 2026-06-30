"use server";

export async function searchYouTubeVideo(query: string) {
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=site:youtube.com+${encodeURIComponent(query)}`);
    const text = await res.text();
    const match = text.match(/v=([a-zA-Z0-9_-]{11})/);
    
    if (match && match[1]) {
      return { success: true, url: `https://www.youtube.com/watch?v=${match[1]}` };
    }
    return { success: false, error: "No videos found" };
  } catch (error: any) {
    console.error("YouTube search error:", error);
    return { success: false, error: error.message };
  }
}

export async function generateAndSaveVideoForLesson(internshipId: string, lessonId: string, query: string) {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const res = await fetch(`https://html.duckduckgo.com/html/?q=site:youtube.com+${encodeURIComponent(query)}`);
    const text = await res.text();
    const match = text.match(/v=([a-zA-Z0-9_-]{11})/);
    
    if (match && match[1]) {
      const url = `https://www.youtube.com/watch?v=${match[1]}`;
      
      // Update database
      const { data: internship, error: fetchError } = await supabase
        .from('internships')
        .select('modules')
        .eq('id', internshipId)
        .single();
        
      if (!fetchError && internship?.modules) {
        let updated = false;
        const modules = [...internship.modules];
        for (const mod of modules) {
          if (mod.days) {
            for (const day of mod.days) {
              if (day.id === lessonId) {
                day.content_url = url;
                updated = true;
              }
            }
          }
        }
        
        if (updated) {
          await supabase.from('internships').update({ modules }).eq('id', internshipId);
        }
      }
      
      return { success: true, url };
    }
    
    // Fallback to yt-search
    const ytSearch = (await import("yt-search")).default;
    const ytRes = await ytSearch(query);
    if (ytRes && ytRes.videos && ytRes.videos.length > 0) {
      const url = ytRes.videos[0].url;
      
      const { data: internship, error: fetchError } = await supabase
        .from('internships')
        .select('modules')
        .eq('id', internshipId)
        .single();
        
      if (!fetchError && internship?.modules) {
        let updated = false;
        const modules = [...internship.modules];
        for (const mod of modules) {
          if (mod.days) {
            for (const day of mod.days) {
              if (day.id === lessonId) {
                day.content_url = url;
                updated = true;
              }
            }
          }
        }
        if (updated) {
          await supabase.from('internships').update({ modules }).eq('id', internshipId);
        }
      }
      return { success: true, url };
    }

    return { success: false, error: "No videos found" };
  } catch (error: any) {
    console.error("YouTube generate error:", error);
    return { success: false, error: error.message };
  }
}
