import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkApps() {
  const { data, error } = await supabaseAdmin.from('applications').select('*').eq('status', 'Submitted');
  if (error) console.error(error);
  else console.log(data?.length ? data : "No submitted apps");
}

checkApps();
