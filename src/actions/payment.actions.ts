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

    let fileName = null;

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
