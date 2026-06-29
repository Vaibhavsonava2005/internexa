"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function markLessonComplete(lessonId: string, internshipId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const { error } = await supabaseAdmin.from('activity_logs').insert({
      clerk_id: userId,
      action: 'lesson_completed',
      description: `Completed lesson ${lessonId}`,
      metadata: { lesson_id: lessonId, internship_id: internshipId }
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Mark complete error:", err);
    return { success: false, error: err.message };
  }
}

export async function getCompletedLessons(internshipId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, data: [] };

    const { data, error } = await supabaseAdmin
      .from('activity_logs')
      .select('metadata')
      .eq('clerk_id', userId)
      .eq('action', 'lesson_completed')
      .filter('metadata->>internship_id', 'eq', internshipId);

    if (error) throw error;
    
    const completedIds = data.map((d: any) => d.metadata.lesson_id);
    return { success: true, data: completedIds };
  } catch (err: any) {
    console.error("Get progress error:", err);
    return { success: false, data: [] };
  }
}
