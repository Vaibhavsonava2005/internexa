"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function getReferralStats() {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    // Get referrals where referrer_id = user.id
    const { data: referrals, error } = await supabaseAdmin
      .from("referrals")
      .select("*, referred:users!referrals_referred_id_fkey(name, email, avatar)")
      .eq("referrer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const successful = referrals?.filter((r) => r.status === "Successful") || [];
    const pending = referrals?.filter((r) => r.status === "Pending") || [];
    const total = referrals?.length || 0;

    // Get any existing reward claims
    const { data: claims } = await supabaseAdmin
      .from("reward_claims")
      .select("*")
      .eq("clerk_id", user.id)
      .order("created_at", { ascending: false });

    return {
      success: true,
      data: {
        total,
        successful: successful.length,
        pending: pending.length,
        referrals: referrals || [],
        claims: claims || [],
      },
    };
  } catch (error: any) {
    console.error("Error fetching referral stats:", error);
    return { success: false, error: error.message };
  }
}

export async function submitRewardClaim(upiId: string) {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    // Double check they have 5 successful referrals
    const { data: referrals, error: refError } = await supabaseAdmin
      .from("referrals")
      .select("id")
      .eq("referrer_id", user.id)
      .eq("status", "Successful");

    if (refError) throw refError;

    const successfulCount = referrals?.length || 0;
    
    // Also check how many approved/pending claims they already have
    // Assuming 1 claim per 5 successful referrals
    const { data: claims, error: claimsError } = await supabaseAdmin
      .from("reward_claims")
      .select("id")
      .eq("clerk_id", user.id);

    if (claimsError) throw claimsError;

    const existingClaimsCount = claims?.length || 0;
    const allowedClaims = Math.floor(successfulCount / 5);

    if (existingClaimsCount >= allowedClaims) {
      return { success: false, error: "You don't have enough new successful referrals for another claim." };
    }

    // Insert claim
    const { error: insertError } = await supabaseAdmin
      .from("reward_claims")
      .insert([
        {
          clerk_id: user.id,
          upi_id: upiId,
          amount: 100,
          status: "Pending",
        }
      ]);

    if (insertError) throw insertError;

    // Send notification to admin (optional) or just user
    await supabaseAdmin.from('notifications').insert([{
      clerk_id: user.id,
      title: "Reward Claimed!",
      message: "Your ₹100 reward claim has been submitted and is pending admin approval.",
      type: "success",
      link: "/dashboard/refer-and-earn"
    }]);

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting reward claim:", error);
    return { success: false, error: error.message };
  }
}
