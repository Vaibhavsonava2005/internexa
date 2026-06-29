"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { generateCertificate, generateJoiningLetter } from "@/lib/document-engine";
import { sendCertificateEmail } from "@/lib/email";

export async function checkAndProcessGraduations(clerkId: string) {
  try {
    // 1. Fetch all Enrolled applications for the user
    const { data: applications, error } = await supabaseAdmin
      .from('applications')
      .select('*, internships(*)')
      .eq('clerk_id', clerkId)
      .eq('status', 'Enrolled');

    if (error || !applications || applications.length === 0) {
      return { success: true, processed: 0 };
    }

    let processedCount = 0;
    const now = new Date();

    for (const app of applications) {
      if (!app.start_date || !app.internships?.duration_days) continue;

      const startDate = new Date(app.start_date);
      const durationDays = app.internships.duration_days;
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationDays);

      // Check if timeline is over
      if (now >= endDate) {
        // Trigger Graduation Event
        const certificateId = app.application_id ? app.application_id.replace("APP-", "CERT-") : `CERT-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`;
        
        let pdfFileId = null;
        try {
          const pdfResult = await generateCertificate({
            documentId: certificateId,
            applicationId: app.application_id || app.reference_number || app.id,
            studentName: app.full_name,
            internshipName: app.internships.title,
            date: new Date().toLocaleDateString(),
            grade: "A+",
          });
          if (pdfResult.success) pdfFileId = pdfResult.fileId;
        } catch (e) {
          console.error("Graduation cert generation failed", e);
        }

        // Update status to Completed
        await supabaseAdmin
          .from('applications')
          .update({ 
            status: "Completed",
            certificate_id: certificateId
          })
          .eq('id', app.id);

        // Send Email
        try {
          await sendCertificateEmail({
            studentName: app.full_name,
            email: app.email,
            internshipName: app.internships.title,
            certificateId: certificateId,
            pdfUrl: pdfFileId || undefined
          });
        } catch (e) {
          console.error("Graduation email failed", e);
        }

        // Notify Student
        await supabaseAdmin.from('notifications').insert([{
          clerk_id: clerkId,
          title: "Congratulations! You have Graduated! 🎉",
          message: `Your timeline for ${app.internships.title} is complete. Your official certificate is now available!`,
          type: "success",
          link: "/dashboard/certificates"
        }]);

        processedCount++;
      }
    }

    return { success: true, processed: processedCount };
  } catch (err: any) {
    console.error("checkAndProcessGraduations error:", err);
    return { success: false, error: err.message };
  }
}
