"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function getGlobalLeaderboard() {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('clerk_id, name, xp, level, avatar, streak')
      .order('xp', { ascending: false })
      .limit(100);

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Failed to get global leaderboard", err);
    return { success: false, error: err.message };
  }
}

export async function getMyPeersLeaderboard() {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    // 1. Get current user's enrolled internships
    const { data: myApps, error: myAppsErr } = await supabaseAdmin
      .from('applications')
      .select('internship_id')
      .eq('clerk_id', user.id);
      
    if (myAppsErr) throw myAppsErr;
    
    const myInternshipIds = myApps?.map(a => a.internship_id) || [];
    
    if (myInternshipIds.length === 0) {
      // If no internships, fallback to Global
      return await getGlobalLeaderboard(); 
    }

    // 2. Find all applications for these internships
    const { data: peerApps, error: peerAppsErr } = await supabaseAdmin
      .from('applications')
      .select('clerk_id')
      .in('internship_id', myInternshipIds);
      
    if (peerAppsErr) throw peerAppsErr;
    
    const peerClerkIds = Array.from(new Set(peerApps?.map(a => a.clerk_id) || []));

    // 3. Get those users sorted by XP
    const { data: peers, error: peersErr } = await supabaseAdmin
      .from('users')
      .select('clerk_id, name, xp, level, avatar, streak')
      .in('clerk_id', peerClerkIds)
      .order('xp', { ascending: false })
      .limit(100);
      
    if (peersErr) throw peersErr;
    
    return { success: true, data: peers };
  } catch (err: any) {
    console.error("Failed to get peers leaderboard", err);
    return { success: false, error: err.message };
  }
}
