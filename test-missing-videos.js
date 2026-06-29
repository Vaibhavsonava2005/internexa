const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase.from('internships').select('title, modules');
  let missingCount = 0;
  let totalCount = 0;
  
  data.forEach(internship => {
    internship.modules.forEach(mod => {
      mod.days.forEach(day => {
        if (day.type === 'Video') {
          totalCount++;
          if (!day.content_url || day.content_url.includes('tgbNymZ7vqY')) {
            missingCount++;
            console.log(`Missing in ${internship.title}: ${day.title}`);
          }
        }
      });
    });
  });
  console.log(`Total: ${totalCount}, Missing: ${missingCount}`);
}
run();
