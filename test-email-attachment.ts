import { createClient } from '@supabase/supabase-js';
import { sendOfferLetterEmail } from './src/lib/email';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runTest() {
  console.log("Uploading dummy PDF to Supabase...");
  const dummyPdf = Buffer.from("%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000056 00000 n \n0000000111 00000 n \n0000000212 00000 n \n0000000296 00000 n \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n390\n%%EOF\n", "utf-8");

  const fileId = `test-offer-${Date.now()}.pdf`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from('documents')
    .upload(fileId, dummyPdf, { contentType: 'application/pdf', upsert: true });

  if (uploadError) {
    console.error("Upload failed", uploadError);
    return;
  }
  
  console.log(`Uploaded to documents bucket as ${fileId}`);
  
  console.log("Waiting 2 seconds for public CDN to propagate...");
  await new Promise(r => setTimeout(r, 2000));

  console.log("Testing email with attachment...");
  
  const res = await sendOfferLetterEmail({
    studentName: "Test User",
    email: "info.internexa@gmail.com", 
    internshipName: "Test Internship",
    offerLetterId: "OFF-TEST-1234",
    applicationId: "APP-1234",
    duration: "4 Weeks",
    pdfUrl: fileId
  });

  if (res.success) {
    console.log("✅ Email sent successfully with attachment!");
  } else {
    console.error("❌ Email failed with attachment:", res.error);
  }
}

runTest();
