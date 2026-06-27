"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, ApplicationFormData } from "@/lib/validations";
import { submitApplication } from "@/actions/application.actions";
import { Button } from "@/components/shared";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { useParams, useRouter } from "next/navigation";
import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export default function ApplyPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  if (isLoaded && !isSignedIn) {
    router.push(`/sign-in?redirect_url=/apply/${slug}`);
    return null;
  }

  const onSubmit = async (data: ApplicationFormData) => {
    if (!resumeFile) {
      setError("Please upload your resume (PDF)");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, (value ?? "").toString());
      });
      formData.append("resume", resumeFile);
      formData.append("internshipSlug", slug as string);

      const result = await submitApplication(formData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        setError(result.error || "Failed to submit application");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-brand-950 p-8 rounded-2xl border border-brand-200 dark:border-brand-800 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white mb-2">Application Submitted!</h2>
            <p className="text-brand-600 dark:text-brand-400 mb-6">
              We've received your application. A confirmation email has been sent to you.
            </p>
            <p className="text-sm text-brand-500 mb-8">Redirecting to dashboard...</p>
            <Loader2 className="w-6 h-6 text-accent-600 animate-spin mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-900 dark:text-white mb-4">
              Apply for Internship
            </h1>
            <p className="text-brand-600 dark:text-brand-400">
              Please fill out all the required information to process your application.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-brand-950 p-6 md:p-10 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}

            {/* Personal Info */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-brand-900 dark:text-white border-b border-brand-100 dark:border-brand-900 pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Full Name</label>
                  <input {...register("fullName")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Email</label>
                  <input {...register("email")} type="email" className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Phone Number</label>
                  <input {...register("phone")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-brand-900 dark:text-white border-b border-brand-100 dark:border-brand-900 pb-2">Education Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">College Name</label>
                  <input {...register("collegeName")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.collegeName && <p className="text-red-500 text-xs mt-1">{errors.collegeName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">University</label>
                  <input {...register("university")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Current Semester</label>
                  <input {...register("currentSemester")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.currentSemester && <p className="text-red-500 text-xs mt-1">{errors.currentSemester.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Degree</label>
                  <input {...register("degree")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Branch/Specialization</label>
                  <input {...register("branch")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Expected Graduation Year</label>
                  <input {...register("expectedGraduationYear")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.expectedGraduationYear && <p className="text-red-500 text-xs mt-1">{errors.expectedGraduationYear.message}</p>}
                </div>
              </div>
            </section>

            {/* Profile & Skills */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-brand-900 dark:text-white border-b border-brand-100 dark:border-brand-900 pb-2">Profile & Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Current Skills (comma separated)</label>
                  <textarea {...register("currentSkills")} rows={2} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.currentSkills && <p className="text-red-500 text-xs mt-1">{errors.currentSkills.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">GitHub Profile (Optional)</label>
                  <input {...register("githubProfile")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.githubProfile && <p className="text-red-500 text-xs mt-1">{errors.githubProfile.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">LinkedIn Profile (Optional)</label>
                  <input {...register("linkedinProfile")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.linkedinProfile && <p className="text-red-500 text-xs mt-1">{errors.linkedinProfile.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Portfolio Website (Optional)</label>
                  <input {...register("portfolio")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.portfolio && <p className="text-red-500 text-xs mt-1">{errors.portfolio.message}</p>}
                </div>
              </div>
            </section>

            {/* Internship Preferences */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-brand-900 dark:text-white border-b border-brand-100 dark:border-brand-900 pb-2">Internship Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Preferred Domain</label>
                  <input {...register("preferredDomain")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.preferredDomain && <p className="text-red-500 text-xs mt-1">{errors.preferredDomain.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Preferred Start Date</label>
                  <input type="date" {...register("preferredStartDate")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.preferredStartDate && <p className="text-red-500 text-xs mt-1">{errors.preferredStartDate.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Available Hours Per Week</label>
                  <input {...register("availableHours")} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.availableHours && <p className="text-red-500 text-xs mt-1">{errors.availableHours.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Preferred Duration</label>
                  <input {...register("preferredDuration")} placeholder="e.g., 3 months" className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.preferredDuration && <p className="text-red-500 text-xs mt-1">{errors.preferredDuration.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Why do you want to join this internship?</label>
                  <textarea {...register("whyJoin")} rows={3} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.whyJoin && <p className="text-red-500 text-xs mt-1">{errors.whyJoin.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Career Goals</label>
                  <textarea {...register("careerGoals")} rows={3} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                  {errors.careerGoals && <p className="text-red-500 text-xs mt-1">{errors.careerGoals.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Previous Experience (Optional)</label>
                  <textarea {...register("previousExperience")} rows={3} className="w-full px-4 py-2 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500" />
                </div>
              </div>
            </section>

            {/* Resume Upload */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-brand-900 dark:text-white border-b border-brand-100 dark:border-brand-900 pb-2">Resume Upload</h3>
              <div className="border-2 border-dashed border-brand-200 dark:border-brand-800 rounded-xl p-8 text-center bg-brand-50 dark:bg-[#0a0a0a]">
                <UploadCloud className="w-8 h-8 text-brand-400 mx-auto mb-4" />
                <label className="block text-sm font-medium text-brand-900 dark:text-white mb-2 cursor-pointer">
                  <span className="text-accent-600 dark:text-accent-500 hover:underline">Click to upload</span> or drag and drop
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setResumeFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <p className="text-xs text-brand-500">PDF, DOC, DOCX up to 10MB</p>
                {resumeFile && (
                  <p className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Selected: {resumeFile.name}
                  </p>
                )}
              </div>
            </section>

            {/* Declaration */}
            <section className="pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" {...register("termsAccepted")} className="mt-1 w-4 h-4 rounded border-brand-300 text-accent-600 focus:ring-accent-500" />
                <span className="text-sm text-brand-600 dark:text-brand-400">
                  I declare that the information provided is true and correct. I understand that any false information may result in the rejection of my application. I accept the Terms and Conditions of InterNexa.
                </span>
              </label>
              {errors.termsAccepted && <p className="text-red-500 text-xs mt-1 ml-7">{errors.termsAccepted.message}</p>}
            </section>

            <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
              Submit Application
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
