import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { generateAndUploadOfferLetter } from './src/lib/pdf-generator';
import { sendOfferLetterEmail } from './src/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testApprove() {
  const { data, error } = await supabaseAdmin.from('applications').select('*, internships(*)').limit(1);
  if (!data || data.length === 0) return console.log("No apps");
  const application = data[0];

  console.log("Found app:", application.id, "User:", application.full_name);

  const offerLetterId = `OFF-TEST-${Date.now()}`;
  
  console.log("1. Generating PDF...");
  const pdfResult = await generateAndUploadOfferLetter({
    offerId: offerLetterId,
    applicationId: application.application_id || application.id,
    studentName: application.full_name,
    internshipName: application.internships.title,
    date: new Date().toLocaleDateString(),
    duration: application.internships.duration,
  });

  console.log("PDF Result:", pdfResult);

  if (!pdfResult.success) {
    return console.error("Failed to generate PDF");
  }

  console.log("2. Sending Email...");
  const emailRes = await sendOfferLetterEmail({
    studentName: application.full_name,
    email: "info.internexa@gmail.com", // Force send to our test email
    internshipName: application.internships.title,
    offerLetterId,
    applicationId: application.application_id || application.id,
    duration: application.internships.duration || "4 Weeks",
    pdfUrl: pdfResult.fileId
  });

  console.log("Email Result:", emailRes);
}

testApprove();
