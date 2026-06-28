"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

// ─── Get or Create User Profile ─────────────────────────────
export async function getOrCreateUserProfile() {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    // Check if user exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', user.id)
      .limit(1)
      .single();

    if (existing) {
      const now = new Date();
      const lastActive = new Date(existing.last_active || now);
      
      const isDifferentDay = now.toDateString() !== lastActive.toDateString();
      
      if (isDifferentDay) {
        // Check if it was yesterday for streak
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let newStreak = existing.streak || 0;
        let xpGained = 10; // 10 XP for daily login
        
        if (lastActive.toDateString() === yesterday.toDateString()) {
          newStreak += 1;
          if (newStreak >= 3) xpGained += 50; // 50 XP Streak bonus
        } else {
          newStreak = 1; // Reset streak
        }
        
        const newXp = (existing.xp || 0) + xpGained;
        const newLevel = Math.floor(newXp / 1000) + 1; // 1000 XP per level
        
        const { data: updated, error: updateError } = await supabaseAdmin
          .from('users')
          .update({ 
            last_active: now.toISOString(),
            streak: newStreak,
            xp: newXp,
            level: newLevel
          })
          .eq('id', existing.id)
          .select()
          .single();
          
        if (updated && !updateError) {
          return { success: true, data: updated };
        }
      }
      
      return { success: true, data: existing };
    }

    // Generate a unique 6 character referral code
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Check for referred_by cookie
    const cookieStore = await cookies();
    const referredByCookie = cookieStore.get("internexa_ref")?.value;
    
    let referredBy = null;
    let referrerClerkId = null;
    
    // Verify the referral code belongs to a valid user
    if (referredByCookie) {
      const { data: referrer } = await supabaseAdmin
        .from('users')
        .select('clerk_id, referral_code')
        .eq('referral_code', referredByCookie)
        .single();
        
      if (referrer) {
        referredBy = referrer.referral_code;
        referrerClerkId = referrer.clerk_id;
      }
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          clerk_id: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student",
          avatar: user.imageUrl || "",
          role: "student",
          xp: 0,
          level: 1,
          streak: 0,
          is_profile_complete: false,
          onboarding_step: 0,
          skills: [],
          interests: [],
          last_active: new Date().toISOString(),
          referral_code: referralCode,
          referred_by: referredBy,
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;
    
    // If successfully referred, create a pending referral entry
    if (referrerClerkId) {
      await supabaseAdmin.from('referrals').insert([
        {
          referrer_id: referrerClerkId,
          referred_id: user.id,
          status: 'Pending',
        }
      ]);
    }
    
    return { success: true, data: newUser };
  } catch (error: any) {
    console.error("Error getting/creating user:", error);
    return { success: false, error: error.message || "Failed to get user profile" };
  }
}

// ─── Update User Profile ────────────────────────────────────
export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
  bio?: string;
  college?: string;
  degree?: string;
  year?: string;
  skills?: string[];
  interests?: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
}) {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', user.id)
      .single();

    if (!existing) {
      return { success: false, error: "User not found" };
    }

    // Check if profile is complete
    const isComplete = !!(
      (data.name || existing.name) &&
      (data.college || existing.college) &&
      (data.degree || existing.degree) &&
      (data.year || existing.year)
    );

    const updateData: any = {
      ...data,
      is_profile_complete: isComplete,
      last_active: new Date().toISOString()
    };

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('clerk_id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }
}

// ─── Complete Onboarding Step ───────────────────────────────
export async function completeOnboardingStep(step: number) {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    const { data: updated, error } = await supabaseAdmin
      .from('users')
      .update({ onboarding_step: step })
      .eq('clerk_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating onboarding step:", error);
    return { success: false, error: "Failed to update onboarding step" };
  }
}

// ─── Add XP ─────────────────────────────────────────────────
export async function addUserXP(amount: number) {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('xp, level')
      .eq('clerk_id', user.id)
      .single();

    if (!existing) return { success: false, error: "User not found" };

    const newXp = existing.xp + amount;
    // Simple level formula: level = floor(sqrt(xp / 100)) + 1
    const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;

    const { data: updated, error } = await supabaseAdmin
      .from('users')
      .update({ xp: newXp, level: newLevel })
      .eq('clerk_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: updated, leveledUp: newLevel > existing.level };
  } catch (error: any) {
    console.error("Error adding XP:", error);
    return { success: false, error: "Failed to add XP" };
  }
}
