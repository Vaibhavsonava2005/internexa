import { createClient } from "@supabase/supabase-js";
import { FEATURED_INTERNSHIPS } from "../src/lib/constants";

require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log("🌱 Seeding Supabase database...");

  try {
    for (const internship of FEATURED_INTERNSHIPS) {
      console.log(`Inserting ${internship.title}...`);
      
      const { error } = await supabase
        .from('internships')
        .upsert({
          title: internship.title,
          slug: internship.slug,
          category: internship.category,
          category_slug: internship.category?.toLowerCase().replace(/\s+/g, '-'),
          description: internship.shortDescription || "Full description goes here...",
          short_description: internship.shortDescription,
          duration: internship.duration,
          duration_days: internship.durationDays,
          difficulty: internship.difficulty,
          rating: internship.rating,
          total_enrolled: internship.totalEnrolled,
          seats_available: internship.seatsAvailable,
          is_active: true,
          is_featured: internship.isFeatured,
          is_trending: internship.isTrending,
          skills: internship.skills || [],
          tools: [],
          modules: [],
          projects: [],
          requirements: [],
          outcomes: [],
          faqs: []
        }, { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Failed to insert ${internship.title}:`, error.message);
      } else {
        console.log(`✅ Successfully inserted ${internship.title}`);
      }
    }
    
    console.log("🎉 Database seeding complete!");
  } catch (error) {
    console.error("Fatal error during seeding:", error);
  }
}

seedDatabase();
