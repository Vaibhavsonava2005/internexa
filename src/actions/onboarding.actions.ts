"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { generateJoiningLetter, generateNDA } from "@/lib/document-engine";
import { sendBrevoEmail } from "@/lib/email"; // Re-using basic email function, we can add a specific template later

export async function completeOnboarding(offerLetterId: string, signatureText: string) {
  try {
    // 1. Fetch application details
    const { data: app, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*, internships(title, duration)')
      .eq('offer_letter_id', offerLetterId)
      .single();

    if (fetchError || !app) {
      return { success: false, error: "Application not found" };
    }

    if (app.status !== "Enrolled") {
      return { success: false, error: "Payment not completed or already onboarded" };
    }

    // 2. Generate unique IDs for the documents
    const currentYear = new Date().getFullYear();
    const seq = Math.floor(100000 + Math.random() * 900000);
    const joiningId = `JOIN-${currentYear}-${seq}`;
    const ndaId = `NDA-${currentYear}-${seq}`;
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // 3. Generate Documents
    const [joiningRes, ndaRes] = await Promise.all([
      generateJoiningLetter({
        documentId: joiningId,
        studentName: app.full_name,
        internshipName: app.internships.title,
        date: dateStr,
        duration: app.internships.duration || "4 Weeks",
        startDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      }),
      generateNDA({
        documentId: ndaId,
        studentName: app.full_name,
        internshipName: app.internships.title,
        date: dateStr
      })
    ]);

    if (!joiningRes.success || !ndaRes.success) {
      return { success: false, error: "Failed to generate official documents" };
    }

    // 4. Update Database
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        status: "Active",
        joining_letter_id: joiningId,
        joining_letter_file_id: joiningRes.fileId,
        nda_file_id: ndaRes.fileId
      })
      .eq('id', app.id);

    if (updateError) throw updateError;

    // 5. Send Email with Joining Letter (we use raw for now, can be upgraded to brevo template)
    try {
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${joiningRes.fileId}`;
      await sendBrevoEmail({
        to: [{ email: app.email, name: app.full_name }],
        subject: "Your InterNexa Joining Letter 🚀",
        htmlContent: `Hi ${app.full_name},<br><br>Welcome to InterNexa! Your onboarding is complete.<br><br>Please find your Joining Letter here: <a href="${publicUrl}">${publicUrl}</a><br><br>Log in to your dashboard to start your journey.<br><br>Best,<br>InterNexa Team`
      });
    } catch (e) {
      console.error("Failed to send joining letter email", e);
    }

    // 6. Notifications
    await supabaseAdmin.from('notifications').insert([{
      clerk_id: app.clerk_id,
      title: "Onboarding Complete & Joining Letter Issued",
      message: "You are officially an intern! Check your email or dashboard for your Joining Letter and NDA.",
      type: "success",
      link: "/dashboard/internships"
    }]);

    return { success: true };
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return { success: false, error: error.message };
  }
}
