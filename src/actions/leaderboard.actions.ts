"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

const INDIAN_NAMES = [
  "Aarav Patel", "Rohan Sharma", "Priya Singh", "Ananya Gupta", "Aditya Kumar", 
  "Neha Reddy", "Arjun Desai", "Kavya Joshi", "Rahul Verma", "Sneha Iyer", 
  "Vikram Singh", "Riya Menon", "Karan Malhotra", "Nisha Nair", "Rohit Das", 
  "Pooja Shah", "Amit Agarwal", "Swati Mishra", "Manish Jain", "Shruti Tiwari", 
  "Kiran Rao", "Megha Pillai", "Vivek Bhatia", "Simran Kaur", "Ajay Chauhan", 
  "Nidhi Kapoor", "Suresh Menon", "Ankita Bose", "Vishal Mathur", "Divya Thakur", 
  "Prateek Sharma", "Ritu Yadav", "Akash Pandey", "Shilpa Gupta", "Siddharth Roy", 
  "Tanvi Agarwal", "Tarun Joshi", "Varun Shetty", "Jyoti Singh", "Yash Patel", 
  "Monica Iyer", "Kunal Verma", "Anjali Desai", "Nikhil Kumar", "Rashi Shah", 
  "Naveen Rao", "Preeti Nair", "Deepak Mishra", "Suman Bose", "Aman Rajput"
];

// Simple seeded PRNG
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export async function getGlobalLeaderboard() {
  try {
    // Generate daily seed based on current date
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Generate 50 fake users
    const fakes = INDIAN_NAMES.map((name, index) => {
      // Seed depends on the day AND the person's index so it shuffles daily
      const personalSeed = dateSeed + index * 13;
      
      // XP between 2000 and 15000, fluctuates daily
      const baseXP = 5000 + (index * 150);
      const randomXP = Math.floor(seededRandom(personalSeed) * 5000);
      const totalXP = baseXP + randomXP;
      
      // Level based on XP
      const level = Math.floor(totalXP / 1000) + 1;
      const streak = Math.floor(seededRandom(personalSeed + 1) * 30);
      
      return {
        clerk_id: `fake_${index}`,
        name,
        xp: totalXP,
        level,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        streak
      };
    });
    
    // Sort descending by XP
    fakes.sort((a, b) => b.xp - a.xp);
    
    return { success: true, data: fakes };
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

    // 3. Get those users sorted by XP, strictly ensuring they have an email/contact attached
    const { data: peers, error: peersErr } = await supabaseAdmin
      .from('users')
      .select('clerk_id, name, xp, level, avatar, streak, email')
      .in('clerk_id', peerClerkIds)
      .not('email', 'is', null)
      .neq('email', '')
      .order('xp', { ascending: false })
      .limit(100);
      
    if (peersErr) throw peersErr;
    
    return { success: true, data: peers };
  } catch (err: any) {
    console.error("Failed to get peers leaderboard", err);
    return { success: false, error: err.message };
  }
}
