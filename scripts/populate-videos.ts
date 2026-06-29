import { createClient } from "@supabase/supabase-js";
import ytSearch from "yt-search";
import * as dotenv from "dotenv";

// Load env variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("Fetching internships...");
  const { data: internships, error } = await supabase.from("internships").select("*");
  
  if (error) {
    console.error("Error fetching internships:", error);
    process.exit(1);
  }

  if (!internships || internships.length === 0) {
    console.log("No internships found.");
    return;
  }

  console.log(`Found ${internships.length} internships. Processing...`);

  for (const internship of internships) {
    console.log(`\nProcessing Internship: ${internship.title}`);
    let updated = false;
    const modules = internship.modules || [];

    for (const mod of modules) {
      if (!mod.days) continue;
      
      for (const day of mod.days) {
        if (day.type === "Video") {
          const isDummy = !day.content_url || day.content_url.includes("tgbNymZ7vqY") || day.content_url.trim() === "";
          if (isDummy) {
            console.log(`  - Fetching video for: ${day.title}`);
            try {
              const r = await ytSearch(`${internship.title} ${day.title} programming tutorial in hindi or english`);
              const videos = r.videos;
              if (videos && videos.length > 0) {
                day.content_url = videos[0].url;
                updated = true;
                console.log(`    -> Found: ${day.content_url}`);
              } else {
                console.log(`    -> No video found`);
              }
            } catch (err) {
              console.error(`    -> Error fetching:`, err);
            }
            // slight delay to prevent rate limit
            await delay(1000);
          }
        }
      }
    }

    if (updated) {
      console.log(`Updating database for ${internship.title}...`);
      const { error: updateError } = await supabase
        .from("internships")
        .update({ modules: modules })
        .eq("id", internship.id);
        
      if (updateError) {
        console.error(`Failed to update ${internship.title}:`, updateError);
      } else {
        console.log(`Successfully updated ${internship.title}`);
      }
    } else {
      console.log(`No updates needed for ${internship.title}`);
    }
  }
  
  console.log("\nFinished populating videos!");
}

run();
