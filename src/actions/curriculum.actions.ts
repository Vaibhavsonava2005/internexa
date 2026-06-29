"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function saveCurriculum(internshipId: string, modules: any[]) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const { error } = await supabaseAdmin
      .from('internships')
      .update({ modules })
      .eq('id', internshipId);

    if (error) throw error;
    
    return { success: true };
  } catch (err: any) {
    console.error("Save curriculum error:", err);
    return { success: false, error: err.message };
  }
}

export async function getInternshipsAdmin() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, data: [] };

    const { data, error } = await supabaseAdmin
      .from('internships')
      .select('id, title, modules')
      .order('title');

    if (error) throw error;
    
    return { success: true, data };
  } catch (err: any) {
    console.error("Get internships admin error:", err);
    return { success: false, data: [] };
  }
}
