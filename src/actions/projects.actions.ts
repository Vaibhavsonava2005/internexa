"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function submitProject(internshipId: string, projectId: string, repoUrl: string, liveUrl: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const { error } = await supabaseAdmin
      .from('activity_logs')
      .insert({
        clerk_id: userId,
        action_type: 'PROJECT_SUBMISSION',
        details: { internshipId, projectId, repoUrl, liveUrl, submittedAt: new Date().toISOString() }
      });

    if (error) throw error;
    
    return { success: true };
  } catch (err: any) {
    console.error("Project submission error:", err);
    return { success: false, error: err.message };
  }
}

export async function getProjectSubmissions(internshipId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, data: [] };

    const { data, error } = await supabaseAdmin
      .from('activity_logs')
      .select('*')
      .eq('clerk_id', userId)
      .eq('action_type', 'PROJECT_SUBMISSION');

    if (error) throw error;
    
    // Filter out submissions for this specific internship
    const submissions = data
      .filter(log => log.details && log.details.internshipId === internshipId)
      .map(log => log.details);

    return { success: true, data: submissions };
  } catch (err: any) {
    console.error("Get project submissions error:", err);
    return { success: false, data: [] };
  }
}

export async function getUserProjects() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, data: [] };

    const { data, error } = await supabaseAdmin
      .from('activity_logs')
      .select('*')
      .eq('clerk_id', userId)
      .eq('action_type', 'PROJECT_SUBMISSION');

    if (error) throw error;
    
    // Map to the format expected by tasks/page.tsx
    const mapped = data.map(log => ({
      id: log.id,
      project_title: `Project ${log.details?.projectId || 'Submission'}`,
      submitted_at: log.created_at || log.details?.submittedAt,
      domain: log.details?.domain // If domain was tracked before, else this might not perfectly match old format, but it won't crash
    }));

    return { success: true, data: mapped };
  } catch (err: any) {
    console.error("Get user projects error:", err);
    return { success: false, data: [] };
  }
}
