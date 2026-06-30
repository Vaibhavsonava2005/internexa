"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { generateCertificate } from "@/lib/document-engine";
import { sendCertificateEmail } from "@/lib/email";

export async function generateCertificateAction(applicationId: string) {
  try {
    // 1. Fetch application details
    const { data: app, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*, internships(title, duration)')
      .eq('id', applicationId)
      .single();

    if (fetchError || !app) {
      return { success: false, error: "Application not found" };
    }

    if (app.status === "Completed") {
      const existingId = app.application_id ? app.application_id.replace("APP-", "CERT-") : `CERT-${app.id.substring(0,8).toUpperCase()}`;
      return { success: true, certificateId: existingId, fileId: `certificates/${app.id}.pdf` };
    }

    // Check Timeline or Fast-Track
    const isFastTrack = app.payment_status_99 === 'verified';
    if (!isFastTrack) {
      // Assuming duration in format "X Days" or "X Weeks"
      const durationStr = app.internships.duration || "";
      let daysRequired = 30; // default
      if (durationStr.includes("Week")) {
        daysRequired = parseInt(durationStr) * 7;
      } else if (durationStr.includes("Month")) {
        daysRequired = parseInt(durationStr) * 30;
      } else if (durationStr.includes("Day")) {
        daysRequired = parseInt(durationStr);
      }
      
      const enrolledDate = new Date(app.created_at);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - enrolledDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < daysRequired) {
        return { success: false, error: `Timeline not completed. Required: ${daysRequired} days, Passed: ${diffDays} days. Fast-track (99₹) not verified.` };
      }
    }

    // 2. Generate unique Certificate ID (Deterministic based on application_id)
    const currentYear = new Date().getFullYear();
    const seq = Math.floor(100000 + Math.random() * 900000);
    const certificateId = app.application_id ? app.application_id.replace("APP-", "CERT-") : `CERT-${currentYear}-${seq}`;
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // 3. Generate Certificate Document
    const certRes = await generateCertificate({
      documentId: certificateId,
      applicationId: app.id,
      studentName: app.full_name,
      internshipName: app.internships.title,
      duration: app.internships.duration,
      date: dateStr,
      grade: "A+" // For this implementation, everyone who finishes all tasks gets an A+
    });

    if (!certRes.success) {
      return { success: false, error: "Failed to generate official certificate" };
    }

    // 4. Update Database (Only status, schema does not have certificate_file_id)
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        status: "Completed"
      })
      .eq('id', app.id);

    if (updateError) {
      console.error("Database update failed:", updateError);
      return { success: false, error: "Failed to update status" };
    }

    // 5. Send Certificate Email
    try {
      await sendCertificateEmail({
        studentName: app.full_name,
        email: app.email,
        internshipName: app.internships.title,
        certificateId: certificateId,
        pdfUrl: certRes.fileId
      });
    } catch (emailErr) {
      console.error("Failed to send certificate email:", emailErr);
      // We don't fail the action if email fails, since PDF is generated
    }

    // 6. Notifications
    await supabaseAdmin.from('notifications').insert([{
      clerk_id: app.clerk_id,
      title: "Internship Completed! 🎉",
      message: "Congratulations! You have completed your internship. Your certificate is now available.",
      type: "success",
      link: "/dashboard/tasks"
    }]);

    return { success: true, certificateId, fileId: certRes.fileId };
  } catch (error: any) {
    console.error("Certificate generation error:", error);
    return { success: false, error: error.message };
  }
}
