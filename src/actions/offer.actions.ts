"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function getOfferDetails(offerLetterId: string) {
  try {
    if (!offerLetterId) return { success: false, error: "No offer ID provided" };
    const cleanId = decodeURIComponent(offerLetterId).trim();
    
    console.log("Fetching offer details for ID:", cleanId);
    
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*, internships(title, duration, category, price)')
      .eq('offer_letter_id', cleanId)
      .single();

    if (error || !data) {
      console.error("Offer fetch error:", error, "Data:", data);
      return { success: false, error: "Offer not found" };
    }

    return {
      success: true,
      data: {
        id: data.id,
        offerLetterId: data.offer_letter_id,
        applicationId: data.application_id || data.reference_number,
        studentName: data.full_name,
        email: data.email,
        status: data.status,
        internshipName: data.internships?.title || "Internship Program",
        duration: data.internships?.duration || "4 Weeks",
        category: data.internships?.category || "Technology",
        price: data.internships?.price || 199,
        offerExpiresAt: data.offer_expires_at,
        offerLetterFileId: data.offer_letter_file_id,
        createdAt: data.created_at
      }
    };
  } catch (error: any) {
    console.error("Get offer details error:", error);
    return { success: false, error: error.message };
  }
}

export async function acceptOffer(offerLetterId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({ status: "Offer Accepted" })
      .eq('offer_letter_id', offerLetterId)
      .eq('status', 'Accepted')
      .select()
      .single();

    if (error) {
      return { success: false, error: "Could not accept the offer. It may have expired or already been accepted." };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markPaymentComplete(offerLetterId: string, transactionRef: string) {
  try {
    // Update application status to Active/Enrolled
    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({ status: "Enrolled" })
      .eq('offer_letter_id', offerLetterId)
      .select('*, internships(title, price)')
      .single();

    if (error) throw error;

    const amount = data.internships?.price || 199;

    // Record the transaction
    await supabaseAdmin.from('transactions').insert([{
      clerk_id: data.clerk_id,
      application_id: data.id,
      amount: amount,
      currency: "INR",
      status: "Success",
      payment_method: "UPI",
      razorpay_payment_id: transactionRef,
    }]);

    // Create notification
    await supabaseAdmin.from('notifications').insert([{
      clerk_id: data.clerk_id,
      title: "Enrollment Confirmed! 🎉",
      message: `Your enrollment for ${data.internships?.title || 'the internship'} is confirmed. Start learning now!`,
      type: "success",
      link: "/dashboard/internships"
    }]);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
