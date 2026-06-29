import { createClient } from "@supabase/supabase-js";
import { generateDynamicCurriculum } from "../src/lib/curriculum-data";
import * as dotenv from "dotenv";
import path from "path";
import { v4 as uuidv4 } from "uuid";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const getPlaceholderUrl = (type: string) => {
  if (type === "Video") return "https://www.youtube.com/embed/tgbNymZ7vqY";
  if (type === "Reading") return "https://raw.githubusercontent.com/microsoft/Web-Dev-For-Beginners/main/1-getting-started-lessons/1-intro-to-programming/README.md";
  if (type === "Project") return "https://github.com";
  return "";
};

async function seedJsonCurriculum() {
  console.log("Fetching all internships...");
  const { data: internships, error } = await supabase.from('internships').select('*');
  
  if (error || !internships) {
    console.error("Failed to fetch internships:", error);
    return;
  }

  console.log(`Found ${internships.length} internships. Generating full JSON curricula...`);

  for (const internship of internships) {
    const generated = generateDynamicCurriculum(internship.category || "Default", internship.duration_days || 30);
    
    const enrichedModules = generated.map((mod: any, mIndex: number) => ({
      id: `mod_${uuidv4().split('-')[0]}`,
      week: mod.week,
      title: mod.title,
      duration: mod.duration,
      order: mIndex,
      days: mod.days.map((day: any, dIndex: number) => ({
        id: `les_${uuidv4().split('-')[0]}`,
        day: day.day,
        title: day.title,
        duration: day.duration,
        type: day.type,
        content_url: getPlaceholderUrl(day.type),
        description: `This is a comprehensive ${day.type.toLowerCase()} lesson covering ${day.title}.`,
        order: dIndex
      }))
    }));

    const { error: updateError } = await supabase
      .from('internships')
      .update({ modules: enrichedModules })
      .eq('id', internship.id);

    if (updateError) {
      console.error(`Failed to update ${internship.title}:`, updateError.message);
    } else {
      console.log(`✅ Seeded JSON curriculum for: ${internship.title}`);
    }
  }

  console.log("🎉 Complete JSON Curriculum seeding finished successfully!");
}

seedJsonCurriculum().catch(console.error);
