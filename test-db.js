const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase.from('internships').select('title, modules').limit(1);
  console.log(JSON.stringify(data[0].modules[0].days[0], null, 2));
}
run();
