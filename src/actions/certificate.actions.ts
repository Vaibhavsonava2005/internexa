"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { generateCertificate } from "@/lib/document-engine";

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
      return { success: true, certificateId: `CERT-${app.id.substring(0,8).toUpperCase()}`, fileId: `certificates/${app.id}.pdf` };
    }

    // 2. Generate unique Certificate ID
    const currentYear = new Date().getFullYear();
    const seq = Math.floor(100000 + Math.random() * 900000);
    const certificateId = `CERT-${currentYear}-${seq}`;
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

    if (updateError) throw updateError;

    // 5. Notifications
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
