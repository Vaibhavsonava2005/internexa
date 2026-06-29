import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase URL or Service Role Key in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function cleanupDatabase() {
  console.log("Starting database cleanup...");
  
  // Define tables to clean (order matters due to foreign keys, but we can just use delete)
  // Or better, we can delete in order of dependencies, or just delete from users and let CASCADE handle the rest.
  // Wait, if we delete from users, and applications/transactions/etc have ON DELETE CASCADE, they will be wiped.
  // Let's explicitly delete from all to be safe, starting from the leaf tables up to users.

  const tables = [
    "audit_logs",
    "activity_logs",
    "notifications",
    "transactions",
    "reward_claims",
    "referrals",
    "applications",
    "users"
  ];

  for (const table of tables) {
    console.log(`Cleaning table: ${table}...`);
    // Delete all rows where id is not null (which is all rows)
    const { error } = await supabaseAdmin.from(table).delete().not('id', 'is', null);
    
    if (error) {
       console.error(`Error cleaning ${table}:`, error.message);
    } else {
      console.log(`Successfully cleaned ${table}`);
    }
  }

  console.log("Database cleanup complete. Internships table remains intact.");
}

cleanupDatabase().catch(console.error);
