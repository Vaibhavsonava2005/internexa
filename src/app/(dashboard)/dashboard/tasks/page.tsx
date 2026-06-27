"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Award, Loader2, Download } from "lucide-react";
import { getUserApplications } from "@/actions/application.actions";
import { generateCertificateAction } from "@/actions/certificate.actions";

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [tasks, setTasks] = useState([
    { id: 1, title: "Onboarding & Environment Setup", completed: false },
    { id: 2, title: "Week 1: Core Concepts & Fundamentals", completed: false },
    { id: 3, title: "Week 2: Advanced Modules", completed: false },
    { id: 4, title: "Week 3: Minor Project Implementation", completed: false },
    { id: 5, title: "Week 4: Major Project & Final Review", completed: false }
  ]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      const apps = await getUserApplications();
      const activeApp = apps.find((app: any) => app.status === "Active" || app.status === "Completed");
      setApplication(activeApp || null);
      if (activeApp?.status === "Completed") {
        setTasks(tasks.map(t => ({ ...t, completed: true })));
      }
      setLoading(false);
    }
    load();
  }, []);

  const toggleTask = (id: number) => {
    if (application?.status === "Completed") return; // locked if completed
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

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
        <p className="text-slate-400">You need to enroll and complete onboarding to access tasks.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Tasks & Progress</h1>
          <p className="text-slate-400 mt-1">{application.internships.title}</p>
        </div>
        
        {application.status === "Completed" && application.certificate_file_id && (
          <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${application.certificate_file_id}`} 
             target="_blank" rel="noopener noreferrer"
             className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-emerald-500/30 transition-colors">
            <Download className="w-4 h-4" /> Download Certificate
          </a>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white">Overall Progress</h3>
          <span className="text-indigo-400 font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 mb-8 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full"
          />
        </div>

        <div className="space-y-3">
          {tasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${task.completed ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
            >
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6 text-indigo-400 shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-slate-600 shrink-0" />
              )}
              <span className={`font-medium ${task.completed ? 'text-indigo-200' : 'text-slate-300'}`}>
                {task.title}
              </span>
            </div>
          ))}
        </div>

        {progress === 100 && application.status !== "Completed" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
              <Award className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Incredible Work! 🎉</h3>
              <p className="text-slate-300 mb-6 max-w-md mx-auto">You have completed all your tasks for this internship. Generate your official completion certificate below.</p>
              
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
    </div>
  );
}
