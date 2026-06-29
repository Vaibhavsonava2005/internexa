"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendOfferLetterEmail } from "@/lib/email";
import { generateAndUploadOfferLetter, generateAndUploadJoiningLetter } from "@/lib/pdf-generator";
import { sendJoiningLetterEmail, sendPaymentRejectedEmail } from "@/lib/email";

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

import { cookies } from "next/headers";
import { verifyAdminJwt, signAdminJwt } from "@/lib/jwt";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");
  
  if (!adminSession?.value) {
    throw new Error("Unauthorized: Admin access required");
  }

  const isValid = await verifyAdminJwt(adminSession.value);
  if (!isValid) {
    throw new Error("Unauthorized: Invalid admin session");
  }
}

export async function approveApplication(applicationId: string) {
  const admin = await currentUser();
  if (!admin) return { success: false, error: "Not authenticated" };

  try {
    await verifyAdmin();
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
    const { count: offerCount } = await supabaseAdmin
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .not('offer_letter_id', 'is', null);
      
    const seq = (offerCount || 0) + 1;
    const offerLetterId = application.application_id ? application.application_id.replace("APP-", "OFF-") : `OFF-${new Date().getFullYear()}-${String(seq).padStart(6, '0')}`;
    
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

    // Calculate start date (3 days from now)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 3);

    // 3. Update Application Status
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        status: "Accepted",
        offer_letter_id: offerLetterId,
        offer_letter_file_id: pdfResult.fileId,
        offer_expires_at: offerExpiresAt.toISOString(),
        start_date: startDate.toISOString().split('T')[0]
      })
      .eq('id', applicationId);

    if (updateError) throw updateError;

    // Give Supabase CDN 1 second to propagate the file so Brevo doesn't get a 404
    await new Promise(r => setTimeout(r, 1000));

    // 4. Send Email with PDF attached
    const emailRes = await sendOfferLetterEmail({
      studentName: application.full_name,
      email: application.email,
      internshipName: application.internships.title,
      offerLetterId,
      applicationId: application.application_id || application.reference_number || application.id,
      duration: application.internships.duration || "4 Weeks",
      pdfUrl: pdfResult.fileId
    });

    if (!emailRes.success) {
      // Revert status if email failed (safety measure)
      await supabaseAdmin.from('applications').update({ status: "Submitted", offer_letter_id: null }).eq('id', applicationId);
      throw new Error(`Email failed: ${emailRes.error}`);
    }

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
    await verifyAdmin();
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
    await verifyAdmin();
    const [appsRes, usersRes, txRes, projectsRes, paymentsRes, rewardClaimsRes] = await Promise.all([
      supabaseAdmin.from('applications').select('*, internships(title)'),
      supabaseAdmin.from('users').select('*'),
      supabaseAdmin.from('transactions').select('*'),
      supabaseAdmin.from('project_submissions').select('*').order('submitted_at', { ascending: false }),
      supabaseAdmin.from('manual_payments').select('*, applications(full_name, internships(title))').order('created_at', { ascending: false }),
      supabaseAdmin.from('reward_claims').select('*, users(name, email)').order('created_at', { ascending: false })
    ]);

    const applications = appsRes.data || [];
    const users = usersRes.data || [];
    const transactions = txRes.data || [];
    const submissions = projectsRes.data || [];
    const manualPayments = paymentsRes.data || [];
    const rewardClaims = rewardClaimsRes.data || [];

    // Attach successful referral counts to users
    if (users.length > 0) {
      const { data: referrals } = await supabaseAdmin.from('referrals').select('referrer_id, status').eq('status', 'Successful');
      const refCountMap: Record<string, number> = {};
      referrals?.forEach(r => {
        refCountMap[r.referrer_id] = (refCountMap[r.referrer_id] || 0) + 1;
      });
      users.forEach(u => {
        u.successful_referrals = refCountMap[u.clerk_id] || 0;
      });
    }

    return {
      success: true,
      data: {
        applications,
        users,
        transactions,
        submissions,
        manualPayments,
        rewardClaims
      }
    };
  } catch (error: any) {
    console.error("Admin data fetch error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch admin data",
      data: null
    };
  }
}

export async function approveRewardClaim(claimId: string) {
  try {
    await verifyAdmin();
    
    const { data: claim, error: fetchError } = await supabaseAdmin
      .from('reward_claims')
      .select('*')
      .eq('id', claimId)
      .single();
      
    if (fetchError || !claim) return { success: false, error: "Claim not found" };
    
    const { error: updateError } = await supabaseAdmin
      .from('reward_claims')
      .update({ status: 'Approved' })
      .eq('id', claimId);
      
    if (updateError) throw updateError;
    
    // Notify user
    await supabaseAdmin.from('notifications').insert([{
      clerk_id: claim.clerk_id,
      title: "Reward Paid! 🎉",
      message: "Your ₹100 reward has been approved and sent to your UPI ID.",
      type: "success",
      link: "/dashboard/refer-and-earn"
    }]);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function loginAdmin(password: string) {
  if (password === "0202") {
    const token = await signAdminJwt();
    (await cookies()).set("admin_session", token, { 
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}

import { generateCertificate } from "@/lib/document-engine";
import { sendCertificateEmail } from "@/lib/email";

export async function approveFastTrackPayment(paymentId: string) {
  try {
    await verifyAdmin();

    const { data: payment, error: fetchError } = await supabaseAdmin
      .from('manual_payments')
      .select('*, applications(*, internships(title))')
      .eq('id', paymentId)
      .single();

    if (fetchError || !payment) return { success: false, error: "Payment not found" };

    const application = payment.applications;

    // 1. Update Payment Status
    await supabaseAdmin.from('manual_payments').update({ status: "Approved" }).eq('id', paymentId);

    // 2. Generate Certificate
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
      console.error("Fast track cert generation failed", e);
    }

    // 3. Update Application Status
    await supabaseAdmin
      .from('applications')
      .update({ 
        status: "Completed",
        certificate_id: certificateId
      })
      .eq('id', application.id);

    // 4. Send Email with all 3 docs attached
    try {
      await sendCertificateEmail({
        studentName: application.full_name,
        email: payment.email_id,
        internshipName: application.internships.title,
        certificateId: certificateId,
        pdfUrl: pdfFileId || undefined
      });
    } catch (e) {
      console.error("Fast track email failed", e);
    }

    // 5. Notify
    await supabaseAdmin.from('notifications').insert([{
      clerk_id: application.clerk_id,
      title: "Fast-Track Certification Approved! 🎉",
      message: `Your fast-track request for ${application.internships.title} is approved. Documents sent to email!`,
      type: "success",
      link: "/dashboard/certificates"
    }]);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectFastTrackPayment(paymentId: string) {
  try {
    await verifyAdmin();
    const { data: payment } = await supabaseAdmin.from('manual_payments').select('*, applications(*)').eq('id', paymentId).single();
    if (!payment) return { success: false };

    await supabaseAdmin.from('manual_payments').update({ status: "Rejected" }).eq('id', paymentId);

    await supabaseAdmin.from('notifications').insert([{
      clerk_id: payment.clerk_id,
      title: "Fast-Track Verification Failed",
      message: `Your recent fast-track payment submission could not be verified.`,
      type: "error",
      link: "/dashboard/certificates"
    }]);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
export async function approveManualPayment(paymentId: string) {
  const admin = await currentUser();
  if (!admin) return { success: false, error: "Not authenticated" };

  try {
    await verifyAdmin();

    // 1. Fetch payment and application details
    const { data: payment, error: fetchError } = await supabaseAdmin
      .from('manual_payments')
      .select('*, applications(*, internships(title, duration))')
      .eq('id', paymentId)
      .single();

    if (fetchError || !payment) {
      return { success: false, error: "Payment record not found" };
    }

    if (payment.status !== "Pending") {
      return { success: false, error: "Payment is already processed" };
    }

    const application = payment.applications;

    // 2. Generate PDF Joining Letter
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
      if (pdfResult.success) {
        pdfFileId = pdfResult.fileId;
      }
    } catch (pdfError) {
      console.error("PDF Generation failed in manual approval:", pdfError);
    }

    // Calculate start date (tomorrow)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);

    // 3. Update Application Status to Enrolled
    await supabaseAdmin
      .from('applications')
      .update({
        status: "Enrolled",
        start_date: startDate.toISOString().split('T')[0]
      })
      .eq('id', application.id);

    // 4. Update Payment Status to Approved
    await supabaseAdmin
      .from('manual_payments')
      .update({ status: "Approved" })
      .eq('id', paymentId);

    // 4b. Update Referral Status to Successful (if exists)
    await supabaseAdmin
      .from('referrals')
      .update({ status: "Successful" })
      .eq('referred_id', application.clerk_id)
      .eq('status', 'Pending');

    // 5. Send Joining Letter Email
    try {
      await sendJoiningLetterEmail({
        studentName: application.full_name,
        email: payment.email_id,
        internshipName: application.internships.title,
        letterId: offerLetterId,
        applicationId: application.application_id || application.reference_number || application.id,
        duration: application.internships.duration || "4 Weeks",
        pdfUrl: pdfFileId || undefined
      });
    } catch (emailErr) {
      console.error("Failed to send joining email in manual approval", emailErr);
    }

    // 6. Create Notification
    await supabaseAdmin.from('notifications').insert([{
      clerk_id: application.clerk_id,
      title: "Payment Approved!",
      message: `Your payment for ${application.internships.title} is verified. Welcome aboard!`,
      type: "success",
      link: "/dashboard/internships"
    }]);

    await logActivity(application.clerk_id, "Payment Approved", "Payment verified by admin.");
    
    return { success: true };
  } catch (error: any) {
    console.error("Approve payment error:", error);
    return { success: false, error: error.message || "Failed to approve payment" };
  }
}

export async function rejectManualPayment(paymentId: string) {
  const admin = await currentUser();
  if (!admin) return { success: false, error: "Not authenticated" };

  try {
    await verifyAdmin();

    const { data: payment, error: fetchError } = await supabaseAdmin
      .from('manual_payments')
      .select('*, applications(*, internships(title))')
      .eq('id', paymentId)
      .single();

    if (fetchError || !payment) {
      return { success: false, error: "Payment record not found" };
    }

    const application = payment.applications;

    // 1. Update Payment Status to Rejected
    await supabaseAdmin
      .from('manual_payments')
      .update({ status: "Rejected" })
      .eq('id', paymentId);

    // 2. Update Application Status
    await supabaseAdmin
      .from('applications')
      .update({ status: "Accepted" }) // Revert to Accepted so they can pay again
      .eq('id', application.id);

    // 3. Send Rejection Email
    await sendPaymentRejectedEmail({
      email: payment.email_id,
      name: application.full_name,
      internshipName: application.internships.title,
    });

    // 4. Create Notification
    await supabaseAdmin.from('notifications').insert([{
      clerk_id: application.clerk_id,
      title: "Payment Verification Failed",
      message: `Your recent payment submission could not be verified. Please try again.`,
      type: "error",
      link: `/offer/${application.id}/onboarding`
    }]);
    
    return { success: true };
  } catch (error: any) {
    console.error("Reject payment error:", error);
    return { success: false, error: error.message };
  }
}

