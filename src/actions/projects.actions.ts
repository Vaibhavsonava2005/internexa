"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function submitProject(data: {
  domain: string;
  projectTitle: string;
  githubLink?: string;
  deploymentLink?: string;
  description?: string;
}) {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    // Verify user actually has an active or completed internship
    const { data: apps, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('status')
      .eq('clerk_id', user.id)
      .in('status', ['Active', 'Completed']);
      
    if (fetchError || !apps || apps.length === 0) {
      return { success: false, error: "Unauthorized: You do not have an active internship." };
    }

    const studentName = user.fullName || "Student";
    
    const { error } = await supabaseAdmin.from("project_submissions").insert([{
      clerk_id: user.id,
      student_name: studentName,
      domain: data.domain,
      project_title: data.projectTitle,
      github_link: data.githubLink,
      deployment_link: data.deploymentLink,
      description: data.description
    }]);

    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    console.error("Project submission error:", err);
    return { success: false, error: err.message || "Failed to submit project" };
  }
}

import { cookies } from "next/headers";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");
  if (adminSession?.value !== "true") {
    throw new Error("Unauthorized: Admin access required");
  }
}

export async function getProjectSubmissions() {
  try {
    await verifyAdmin();
    const { data, error } = await supabaseAdmin
      .from("project_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
