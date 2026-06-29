"use server";

import ytSearch from "yt-search";

export async function searchYouTubeVideo(query: string) {
  try {
    const r = await ytSearch(query);
    const videos = r.videos;
    if (videos && videos.length > 0) {
      return { success: true, url: videos[0].url };
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

    const r = await ytSearch(query);
    const videos = r.videos;
    
    if (videos && videos.length > 0) {
      const url = videos[0].url;
      
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
    return { success: false, error: "No videos found" };
  } catch (error: any) {
    console.error("YouTube generate error:", error);
    return { success: false, error: error.message };
  }
}
