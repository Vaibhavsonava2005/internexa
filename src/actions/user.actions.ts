"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

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
      return { success: true, data: existing };
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
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;
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
