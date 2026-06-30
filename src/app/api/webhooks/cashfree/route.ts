import { NextResponse } from 'next/server';
import { supabaseAdmin } from "@/lib/supabase";
import { generateAndUploadJoiningLetter } from "@/lib/pdf-generator";
import { generateCertificate } from "@/lib/document-engine";
import { sendJoiningLetterEmail, sendCertificateEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error("Cashfree Webhook JSON parse error", e);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    console.log("Cashfree Webhook Payload:", JSON.stringify(body, null, 2));

    // Cashfree Payment Success webhook event: PAYMENT_SUCCESS_WEBHOOK
    // The payload usually contains data in `body.data` for modern API, or just flat for older.
    const payment = body?.data?.payment || body?.data?.order || body?.payment || body;
    const customer = body?.data?.order?.customer_details || body?.data?.customer_details || body?.customer_details;
    
    // Safety check, adapt to Cashfree exact format
    if (!customer?.customer_email) {
      console.error("No customer_email found in webhook payload.");
      return NextResponse.json({ error: 'Missing customer_email' }, { status: 200 }); // Return 200 so they stop retrying
    }

    const email = customer.customer_email;
    const amount = Number(payment?.payment_amount || body?.data?.order?.order_amount || body?.order_amount || 0);

    // Find the latest active application for this user
    // First find the user
    const { data: user, error: userError } = await supabaseAdmin.from('users').select('*').eq('email', email).single();
    
    if (userError || !user) {
      console.error("User not found for email:", email);
      return NextResponse.json({ error: 'User not found' }, { status: 200 });
    }

    // Amount ~ 99 is Onboarding
    if (amount >= 98 && amount <= 100) {
      // Find the application that is Payment Verification Pending or Accepted
      const { data: applications, error: appError } = await supabaseAdmin
        .from('applications')
        .select('*, internships(title, duration)')
        .eq('clerk_id', user.clerk_id)
        .in('status', ['Accepted', 'Payment Verification Pending', 'Offer Accepted', 'Submitted'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (appError || !applications || applications.length === 0) {
        console.error("No matching application for onboarding found for user:", email);
        return NextResponse.json({ success: true, note: 'No valid app found' });
      }

      const application = applications[0];

      // Process Onboarding
      const offerLetterId = application.application_id ? application.application_id.replace("APP-", "JOIN-") : `JOIN-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      let pdfFileId = null;

      try {
        const pdfResult = await generateAndUploadJoiningLetter({
          offerId: offerLetterId,
          applicationId: application.application_id || application.reference_number || application.id,
          studentName: application.full_name,
          internshipName: application.internships.title,
          date: new Date().toLocaleDateString(),
          duration: application.internships.duration,
        });
        if (pdfResult.success) pdfFileId = pdfResult.fileId;
      } catch (pdfError) {
        console.error("PDF Gen failed:", pdfError);
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      await supabaseAdmin.from('applications').update({
        status: "Enrolled",
        start_date: startDate.toISOString().split('T')[0],
        joining_letter_file_id: pdfFileId
      }).eq('id', application.id);

      await supabaseAdmin.from('referrals').update({ status: "Successful" }).eq('referred_id', application.clerk_id).eq('status', 'Pending');

      try {
        await sendJoiningLetterEmail({
          studentName: application.full_name,
          email: application.email,
          internshipName: application.internships.title,
          startDate: startDate.toLocaleDateString(),
          pdfUrl: pdfFileId || undefined
        });
      } catch (e) {
        console.error("Email failed:", e);
      }

      await supabaseAdmin.from('notifications').insert([{
        clerk_id: application.clerk_id,
        title: "Onboarding Complete! 🎉",
        message: "Your payment was verified automatically. Your Official Joining Letter has been emailed to you.",
        type: "success",
        link: "/dashboard/internships"
      }]);

      console.log(`Onboarding automated for ${email}`);
    } 
    // Amount ~ 199 is Certification
    else if (amount >= 198 && amount <= 200) {
      // Find Enrolled/Active application
      const { data: applications, error: appError } = await supabaseAdmin
        .from('applications')
        .select('*, internships(title, duration)')
        .eq('clerk_id', user.clerk_id)
        .in('status', ['Enrolled', 'Active'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (appError || !applications || applications.length === 0) {
        console.error("No matching active application for certification found for user:", email);
        return NextResponse.json({ success: true, note: 'No valid active app found' });
      }

      const application = applications[0];
      const certificateId = application.application_id ? application.application_id.replace("APP-", "CERT-") : `CERT-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`;
      let pdfFileId = null;

      try {
        const pdfResult = await generateCertificate({
          documentId: certificateId,
          applicationId: application.application_id || application.reference_number || application.id,
          studentName: application.full_name,
          internshipName: application.internships.title,
          date: new Date().toLocaleDateString(),
          grade: "A+",
        });
        if (pdfResult.success) pdfFileId = pdfResult.fileId;
      } catch (e) {
        console.error("Cert Gen failed:", e);
      }

      await supabaseAdmin.from('applications').update({ 
        status: "Completed",
        certificate_id: certificateId,
        certificate_file_id: pdfFileId
      }).eq('id', application.id);

      try {
        await sendCertificateEmail({
          studentName: application.full_name,
          email: application.email,
          internshipName: application.internships.title,
          certificateId: certificateId,
          pdfUrl: pdfFileId || undefined
        });
      } catch (e) {
        console.error("Email failed:", e);
      }

      await supabaseAdmin.from('notifications').insert([{
        clerk_id: application.clerk_id,
        title: "Certification Complete! 🎉",
        message: `Your fast-track certification for ${application.internships.title} is completed. Documents sent to email!`,
        type: "success",
        link: "/dashboard/certificates"
      }]);

      console.log(`Certification automated for ${email}`);
    } else {
      console.log("Unhandled payment amount:", amount);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cashfree Webhook global error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
