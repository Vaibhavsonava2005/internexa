"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function submitManualPayment(formData: FormData) {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    const applicationId = formData.get("applicationId") as string;
    const referenceNumber = formData.get("referenceNumber") as string;
    const emailId = formData.get("emailId") as string;
    const upiId = formData.get("upiId") as string;
    const screenshot = formData.get("screenshot") as File;

    if (!applicationId || !referenceNumber || !emailId || !upiId) {
      return { success: false, error: "Reference Number, Email, and UPI ID are required" };
    }

    let fileName = "optional";

    if (screenshot && typeof screenshot === "object" && screenshot.name) {
      // 1. Upload screenshot to Supabase Storage
      const fileExt = screenshot.name.split('.').pop();
      fileName = `payments/${user.id}_${Date.now()}.${fileExt}`;
      const arrayBuffer = await screenshot.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabaseAdmin.storage
        .from('documents')
        .upload(fileName, buffer, {
          contentType: screenshot.type,
        });

      if (uploadError) throw uploadError;
    }

    // 2. Insert into manual_payments table
    const { error: dbError } = await supabaseAdmin.from('manual_payments').insert([{
      application_id: applicationId,
      clerk_id: user.id,
      reference_number: referenceNumber,
      email_id: emailId,
      upi_id: upiId,
      screenshot_file_id: fileName,
      status: 'Pending'
    }]);

    if (dbError) {
      // Clean up file if db insert fails
      if (fileName) {
        await supabaseAdmin.storage.from('documents').remove([fileName]);
      }
      throw dbError;
    }

    // 3. Update application status
    await supabaseAdmin
      .from('applications')
      .update({ status: 'Payment Verification Pending' })
      .eq('id', applicationId);

    // 4. Create notification
    await supabaseAdmin.from('notifications').insert([{
      clerk_id: user.id,
      title: "Payment Under Review",
      message: `Your payment for reference ${referenceNumber} has been submitted and is under review.`,
      type: "info",
      link: "/dashboard/internships"
    }]);

    return { success: true };
  } catch (error: any) {
    console.error("Submit manual payment error:", error);
    return { success: false, error: error.message || "Failed to submit payment" };
  }
}

export async function setApplicationPaymentIntent(applicationId: string, type: 'Onboarding' | 'Certificate' = 'Onboarding') {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    // We update the updated_at column to NOW() and status to indicate a payment is in progress
    // so the webhook knows EXACTLY which application to fulfill.
    const status = type === 'Onboarding' ? 'Payment Processing' : 'FastTrack Processing';
    
    const { error } = await supabaseAdmin
      .from('applications')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .eq('clerk_id', user.id);
      
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Set payment intent error:", err);
    return { success: false, error: err.message };
  }
}

export async function submitFastTrackPayment(formData: FormData) {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    const applicationId = formData.get("applicationId") as string;
    const referenceNumber = formData.get("referenceNumber") as string;
    const emailId = formData.get("emailId") as string;
    const upiId = formData.get("upiId") as string;
    const screenshot = formData.get("screenshot") as File;

    if (!applicationId || !referenceNumber || !emailId || !upiId) {
      return { success: false, error: "Reference Number, Email, and UPI ID are required" };
    }

    let fileName = "optional";

    if (screenshot && typeof screenshot === "object" && screenshot.name) {
      const fileExt = screenshot.name.split('.').pop();
      fileName = `payments/fasttrack_${user.id}_${Date.now()}.${fileExt}`;
      const arrayBuffer = await screenshot.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabaseAdmin.storage
        .from('documents')
        .upload(fileName, buffer, {
          contentType: screenshot.type,
        });

      if (uploadError) throw uploadError;
    }

    // Insert into manual_payments table with FAST- prefix
    const prefixedRef = `FAST-${referenceNumber}`;
    const { error: dbError } = await supabaseAdmin.from('manual_payments').insert([{
      application_id: applicationId,
      clerk_id: user.id,
      reference_number: prefixedRef,
      email_id: emailId,
      upi_id: upiId,
      screenshot_file_id: fileName,
      status: 'Pending'
    }]);

    if (dbError) {
      if (fileName) {
        await supabaseAdmin.storage.from('documents').remove([fileName]);
      }
      throw dbError;
    }

    // Do NOT update application status to 'Payment Verification Pending' because they are already 'Active'
    // The fast track remains pending until admin approves it.

    await supabaseAdmin.from('notifications').insert([{
      clerk_id: user.id,
      title: "Fast-Track Certification Payment Under Review",
      message: `Your payment for reference ${prefixedRef} has been submitted. Documents will be generated upon approval.`,
      type: "info",
      link: "/dashboard/certificates"
    }]);

    return { success: true };
  } catch (error: any) {
    console.error("Submit fast-track payment error:", error);
    return { success: false, error: error.message || "Failed to submit payment" };
  }
}
