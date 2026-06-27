"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendOfferLetterEmail } from "@/lib/email";
import { generateAndUploadOfferLetter } from "@/lib/pdf-generator";

// Helper for Activity Log
export async function logActivity(clerk_id: string, action: string, description?: string, metadata?: any) {
  try {
    await supabaseAdmin.from('activity_logs').insert([{
      clerk_id,
      action,
      description,
      metadata
    }]);
  } catch (error) {
    console.error("Failed to log activity", error);
  }
}

// Helper for Audit Log
export async function logAudit(admin_id: string, action: string, target_user_id?: string, details?: string, metadata?: any) {
  try {
    await supabaseAdmin.from('audit_logs').insert([{
      admin_id,
      action,
      target_user_id,
      details,
      metadata
    }]);
  } catch (error) {
    console.error("Failed to log audit", error);
  }
}

export async function approveApplication(applicationId: string) {
  const admin = await currentUser();
  if (!admin) return { success: false, error: "Not authenticated" };

  try {
    // 1. Fetch application details
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*, internships(title, duration)')
      .eq('id', applicationId)
      .single();

    if (fetchError || !application) {
      return { success: false, error: "Application not found" };
    }

    if (application.status === "Approved" || application.status === "Accepted") {
      return { success: false, error: "Application is already approved/accepted" };
    }

    // 2. Generate PDF Offer Letter
    const offerLetterId = `OFL-${application.internships.title.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const offerExpiresAt = new Date();
    offerExpiresAt.setHours(offerExpiresAt.getHours() + 72);
    
    const pdfResult = await generateAndUploadOfferLetter({
      offerId: offerLetterId,
      applicationId: application.application_id || application.reference_number || application.id,
      studentName: application.full_name,
      internshipName: application.internships.title,
      date: new Date().toLocaleDateString(),
      duration: application.internships.duration,
    });

    if (!pdfResult.success) {
      throw new Error(pdfResult.error || "PDF Generation failed");
    }

    // 3. Update Application Status
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        status: "Accepted",
        offer_letter_id: offerLetterId,
        offer_letter_file_id: pdfResult.fileId,
        offer_expires_at: offerExpiresAt.toISOString()
      })
      .eq('id', applicationId);

    if (updateError) throw updateError;

    // 4. Send Email with PDF attached
    await sendOfferLetterEmail({
      studentName: application.full_name,
      email: application.email,
      internshipName: application.internships.title,
      offerLetterId,
      applicationId: application.application_id || application.reference_number || application.id,
      duration: application.internships.duration || "4 Weeks",
      pdfUrl: pdfResult.fileId
    });

    // 5. Create Notification
    await supabaseAdmin.from('notifications').insert([{
      clerk_id: application.clerk_id,
      title: "Offer Letter Generated!",
      message: `Congratulations! You have been selected for ${application.internships.title}.`,
      type: "success",
      link: "/dashboard/internships"
    }]);

    // 6. Logging
    await logActivity(application.clerk_id, "Application Approved", `Offer Letter ${offerLetterId} generated.`);
    await logAudit(admin.id, "Approve Application", application.clerk_id, `Approved application ${applicationId}`);

    return { success: true, offerLetterId };

  } catch (error: any) {
    console.error("Approve application error:", error);
    return { success: false, error: error.message || "Failed to approve application" };
  }
}

export async function rejectApplication(applicationId: string) {
  const admin = await currentUser();
  if (!admin) return { success: false, error: "Not authenticated" };

  try {
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({ status: "Rejected" })
      .eq('id', applicationId);

    if (updateError) throw updateError;
    
    await logAudit(admin.id, "Reject Application", undefined, `Rejected application ${applicationId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Reject application error:", error);
    return { success: false, error: error.message };
  }
}

export async function getAdminData() {
  try {
    const [appsRes, usersRes, txRes] = await Promise.all([
      supabaseAdmin.from('applications').select('*, internships(title)'),
      supabaseAdmin.from('users').select('*'),
      supabaseAdmin.from('transactions').select('*')
    ]);

    const applications = appsRes.data || [];
    const users = usersRes.data || [];
    const transactions = txRes.data || [];



    return {
      success: true,
      data: {
        applications,
        users,
        transactions
      }
    };
  } catch (error: any) {
    console.error("Admin data fetch error:", error);
    // Return false so the UI knows there was an error fetching data
    return {
      success: false,
      error: error.message || "Failed to fetch admin data",
      data: null
    };
  }
}

import { cookies } from "next/headers";

export async function loginAdmin(password: string) {
  if (password === "0202") {
    (await cookies()).set("admin_session", "true", { path: "/" });
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}
