import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  console.log("Ensuring buckets exist...");
  await supabaseAdmin.storage.createBucket('documents', { public: true });
  await supabaseAdmin.storage.createBucket('offer-letters', { public: true });
  console.log("Buckets created or already exist.");
}

run();
