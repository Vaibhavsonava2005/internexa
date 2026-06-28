"use server";

import { currentUser } from "@clerk/nextjs/server";
import { applicationSchema } from "@/lib/validations";
import { sendOfferLetterEmail, sendApplicationReceivedEmail } from "@/lib/email";
import { getOrCreateUserProfile } from "@/actions/user.actions";
import { supabaseAdmin } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

function generateReferenceNumber() {
  const random = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();
  return `INX-REF-${random}`;
}

async function generateApplicationId() {
  const year = new Date().getFullYear();
  // Get count of applications for sequential ID
  const { count, error } = await supabaseAdmin
    .from('applications')
    .select('*', { count: 'exact', head: true });
    
  const seq = (count || 0) + 1;
  return `APP-${year}-${String(seq).padStart(6, '0')}`;
}

export async function submitApplication(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // 1. Extract data and validate
    const rawData: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "resume" && key !== "internshipSlug") {
        rawData[key] = value === "true" ? true : value;
      }
    }
    
    const internshipSlug = formData.get("internshipSlug") as string;
    const resumeFile = formData.get("resume") as File;
    
    // Resume is optional
    // if (!resumeFile) {
    //   return { success: false, error: "Resume is required" };
    // }

    const validatedData = applicationSchema.parse(rawData);

    // 2. Fetch internship details
    const { data: internships, error: internshipError } = await supabaseAdmin
      .from('internships')
      .select('*')
      .eq('slug', internshipSlug)
      .limit(1);

    if (internshipError || !internships || internships.length === 0) {
      // In development, if DB isn't seeded, we could mock the ID, but let's be strict for production.
      return { success: false, error: "Internship not found" };
    }
    const internship = internships[0];

    // 3. Check if user already applied
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('clerk_id', user.id)
      .eq('internship_id', internship.id)
      .limit(1);

    if (existing && existing.length > 0) {
      return { success: false, error: "You have already applied for this internship." };
    }

    // 4. Upload Resume
    let resumeFileId = "";
    try {
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('resumes')
        .upload(fileName, resumeFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      resumeFileId = uploadData.path;
    } catch (e: any) {
      console.error("Resume upload failed", e);
      resumeFileId = "mock-resume-id";
    }

    // 5. Ensure user exists in users table
    await getOrCreateUserProfile();

    // 6. Create Application Record
    const referenceNumber = generateReferenceNumber();
    const applicationId = await generateApplicationId();
    const submissionTime = new Date().toISOString();

    const { data: newApp, error: insertError } = await supabaseAdmin
      .from('applications')
      .insert([
        {
          clerk_id: user.id,
          internship_id: internship.id,
          application_id: applicationId,
          reference_number: referenceNumber,
          status: "Submitted", // Real flow: stays submitted until Admin approves
          resume_file_id: resumeFileId,
          full_name: validatedData.fullName,
          email: validatedData.email,
          phone: validatedData.phone,
          college_name: validatedData.collegeName,
          university: validatedData.university || "N/A",
          current_semester: validatedData.currentSemester || "N/A",
          degree: validatedData.degree || "N/A",
          branch: validatedData.branch || "N/A",
          expected_graduation_year: validatedData.expectedGraduationYear || "N/A",
          current_skills: validatedData.currentSkills || "N/A",
          github_profile: validatedData.githubProfile || null,
          linkedin_profile: validatedData.linkedinProfile || null,
          portfolio: validatedData.portfolio || null,
          preferred_domain: validatedData.preferredDomain || "N/A",
          preferred_start_date: validatedData.preferredStartDate || new Date().toISOString().split('T')[0],
          available_hours: validatedData.availableHours || "N/A",
          preferred_duration: validatedData.preferredDuration || "N/A",
          career_goals: validatedData.careerGoals || "N/A",
          why_join: validatedData.whyJoin || "N/A",
          previous_experience: validatedData.previousExperience || null,
          terms_accepted: validatedData.termsAccepted,
          submission_date: submissionTime
        }
      ])
      .select();

    if (insertError) {
      throw insertError;
    }

    const applicationDbId = newApp[0].id;

    // 7. Send Application Received Email
    try {
      await sendApplicationReceivedEmail({
        studentName: validatedData.fullName,
        email: validatedData.email,
        internshipName: internship.title,
        applicationId,
        referenceNumber,
      });
    } catch (emailError) {
      console.error("Failed to send Application Received email", emailError);
    }

    // 8. Create Dashboard Notification
    await supabaseAdmin.from('notifications').insert([
      {
        clerk_id: user.id,
        title: "Application Submitted",
        message: `Your application for ${internship.title} has been successfully submitted! Reference: ${referenceNumber}`,
        type: "info",
        link: "/dashboard/internships"
      }
    ]);

    // 9. Log Activity
    await supabaseAdmin.from('activity_logs').insert([
      {
        clerk_id: user.id,
        action: "Application Submitted",
        description: `Applied for ${internship.title}`,
        metadata: { applicationId, referenceNumber }
      }
    ]);

    return { success: true, referenceNumber };

  } catch (error: any) {
    console.error("Submit application error:", error);
    if (error.name === "ZodError") {
      return { success: false, error: "Validation failed" };
    }
    return { success: false, error: error.message || "Failed to submit application" };
  }
}

export async function getUserApplications() {
  const user = await currentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        internships:internship_id (*)
      `)
      .eq('clerk_id', user.id)
      .order('submission_date', { ascending: false });

    if (error) throw error;

    // Map to expected format (rename internships to internship)
    const appsWithInternships = data.map((app: any) => ({
      ...app,
      internship: app.internships,
      // Map postgres snake_case to camelCase where frontend expects it
      referenceNumber: app.reference_number,
      offerLetterFileId: app.offer_letter_file_id,
      joiningLetterFileId: app.joining_letter_file_id
    }));

    return { success: true, data: appsWithInternships };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLeaderboardStats() {
  try {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('id, full_name, status, clerk_id');

    if (error) throw error;

    const userStats: Record<string, { name: string, xp: number, active: number, completed: number, clerk_id: string }> = {};

    data?.forEach(app => {
      const id = app.clerk_id || app.full_name;
      if (!userStats[id]) {
        userStats[id] = { name: app.full_name, xp: 0, active: 0, completed: 0, clerk_id: app.clerk_id };
      }
      
      if (app.status === "Active" || app.status === "Enrolled") {
        userStats[id].xp += 250;
        userStats[id].active += 1;
      }
      if (app.status === "Completed") {
        userStats[id].xp += 1000;
        userStats[id].completed += 1;
      }
    });

    const leaderboard = Object.values(userStats)
      .filter(u => u.xp > 0)
      .sort((a, b) => b.xp - a.xp)
      .map((u, index) => ({
        ...u,
        rank: index + 1,
        level: Math.floor(u.xp / 500) + 1
      }));

    return { success: true, data: leaderboard };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
