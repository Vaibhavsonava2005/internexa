import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTables() {
  const { data, error } = await supabase.from('modules').select('id').limit(1);
  if (error) {
    console.error("Table check failed:", error.message);
  } else {
    console.log("Modules table exists!");
  }
}

checkTables();
