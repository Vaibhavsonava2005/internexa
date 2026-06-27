import { createClient } from '@supabase/supabase-js';
import { sendOfferLetterEmail } from './src/lib/email';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runTest() {
  console.log("Fetching applications from database...");
  const { data: apps, error } = await supabaseAdmin
    .from('applications')
    .select('id, full_name, email, application_id, internships(title, duration)')
    .limit(5);

  if (error) {
    console.error("Failed to fetch apps:", error);
    return;
  }

  if (!apps || apps.length === 0) {
    console.log("No applications found in the database. I will send a hardcoded test email.");
    apps.push({
      id: "test-id",
      full_name: "Test User",
      email: "info.internexa@gmail.com", // Send to self as fallback
      application_id: "APP-2026-TEST",
      internships: { title: "Software Engineering Virtual Internship", duration: "4 Weeks" }
    });
  }

  console.log(`Found ${apps.length} users to test. Sending emails...`);

  for (const app of apps) {
    console.log(`Sending offer letter test to: ${app.email} (${app.full_name})`);
    
    // Simulate a successful PDF generation (we don't need to generate a real PDF just to test the email, 
    // but the email expects a pdfUrl. We can pass a fake one or null to test if the email body works)
    
    const res = await sendOfferLetterEmail({
      studentName: app.full_name,
      email: app.email,
      internshipName: app.internships?.title || "Test Internship",
      offerLetterId: `OFF-TEST-${Math.floor(Math.random() * 10000)}`,
      applicationId: app.application_id || app.id,
      duration: app.internships?.duration || "4 Weeks",
      // We omit pdfUrl here to just test the email body delivery, or we could use a known PDF ID if we had one.
      // Let's pass a dummy string, though it will result in a broken link for the attachment in the test email.
      // Better yet, let's omit it so the email sends successfully without failing to fetch a bad attachment.
    });

    if (res.success) {
      console.log(`✅ Success for ${app.email}`);
    } else {
      console.error(`❌ Failed for ${app.email}`, res.error);
    }
  }
  
  console.log("Test complete.");
}

runTest();
