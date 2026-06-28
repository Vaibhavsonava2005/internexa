"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Award, Loader2, Download, Calendar, FolderKanban } from "lucide-react";
import { getUserApplications } from "@/actions/application.actions";
import { getUserProjects } from "@/actions/projects.actions";
import { generateCertificateAction } from "@/actions/certificate.actions";
import { format, differenceInDays } from "date-fns";

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      const apps = await getUserApplications();
      const activeApp = apps.success && apps.data ? apps.data.find((app: any) => app.status === "Active" || app.status === "Enrolled" || app.status === "Completed") : null;
      setApplication(activeApp || null);

      if (activeApp) {
        const projRes = await getUserProjects();
        if (projRes.success && projRes.data) {
          setProjects(projRes.data.filter((p: any) => p.domain === activeApp.internships?.category));
        }
      }
      
      setLoading(false);
    }
    load();
  }, []);

  const handleCompleteInternship = async () => {
    if (!application) return;
    setGenerating(true);
    const res = await generateCertificateAction(application.id);
    if (res.success) {
      setApplication({ ...application, status: "Completed", certificate_id: res.certificateId, certificate_file_id: res.fileId });
    } else {
      alert("Error: " + res.error);
    }
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Active Internships</h2>
        <p className="text-slate-400">You need to enroll and complete onboarding to access tasks and attendance.</p>
      </div>
    );
  }

  // Calculate real-time attendance
  const startDate = new Date(application.start_date || application.submission_date);
  const durationStr = application.internships?.duration || "30 Days";
  const durationMatch = durationStr.match(/\d+/);
  const durationDays = durationMatch ? parseInt(durationMatch[0]) : 30;
  
  const daysPassed = Math.max(0, differenceInDays(new Date(), startDate));
  const attendancePercent = Math.min(100, Math.round((daysPassed / durationDays) * 100));
  
  const isCompleted = application.status === "Completed" || attendancePercent >= 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Tasks & Attendance</h1>
          <p className="text-slate-400 mt-1">{application.internships?.title}</p>
        </div>
        
        {application.status === "Completed" && (
          <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"}/storage/v1/object/public/documents/certificates/${application.id}.pdf`} 
             target="_blank" rel="noopener noreferrer"
             className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-emerald-500/30 transition-colors">
            <Download className="w-4 h-4" /> Download Certificate
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Calendar className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Real-Time Attendance</h2>
            </div>
            
            <div className="space-y-4 mb-6 text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Start Date</span>
                <span className="font-medium text-white">{format(startDate, 'PP')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Duration</span>
                <span className="font-medium text-white">{durationDays} Days</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>Days Elapsed</span>
                <span className="font-medium text-white">{daysPassed} Days</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400">Attendance Logged</span>
              <span className="text-indigo-400 font-bold">{attendancePercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${attendancePercent}%` }}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Project Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col max-h-[400px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Project Logs</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {projects.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-500 text-sm">No projects submitted yet.</p>
                <p className="text-slate-600 text-xs mt-1">Submit projects from the Projects tab to log them here.</p>
              </div>
            ) : (
              projects.map(proj => (
                <div key={proj.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-white text-sm">{proj.project_title}</h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Submitted on {format(new Date(proj.submitted_at), 'PPP')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isCompleted && application.status !== "Completed" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
            <Award className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Internship Timeline Completed! 🎉</h3>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">You have completed the required duration for this internship. Generate your official completion certificate below.</p>
            
            <button 
              onClick={handleCompleteInternship}
              disabled={generating}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Award className="w-5 h-5" />}
              {generating ? "Generating Certificate..." : "Claim My Certificate"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
