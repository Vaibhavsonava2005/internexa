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

    if (app.status !== "Accepted" && app.status !== "Offer Accepted") {
      return { success: false, error: "Invalid application status for onboarding" };
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
        status: "Active"
      })
      .eq('id', app.id);

    if (updateError) throw updateError;

    // 5. Send Email with Joining Letter
    try {
      const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://internexa.vercel.app'}/offer/${offerLetterId}/success`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to InterNexa!</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px;">Dear <strong>${app.full_name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.5;">Congratulations! Your onboarding for the <strong>${app.internships.title}</strong> internship is officially complete. We are thrilled to have you join our cohort.</p>
            <p style="font-size: 16px; line-height: 1.5;">Your payment has been successfully processed and your Official Joining Letter has been generated.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${publicUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Download Joining Letter</a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5;">You can now log in to your student dashboard to access your curriculum and begin your journey.</p>
            <p style="font-size: 16px; margin-top: 30px;">Best regards,<br><strong>The InterNexa Team</strong></p>
          </div>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
            &copy; ${new Date().getFullYear()} InterNexa EdTech. All rights reserved.
          </div>
        </div>
      `;
      
      await sendBrevoEmail({
        to: [{ email: app.email, name: app.full_name }],
        subject: "🎉 Congratulations! Your InterNexa Joining Letter is Ready",
        htmlContent: emailHtml
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
