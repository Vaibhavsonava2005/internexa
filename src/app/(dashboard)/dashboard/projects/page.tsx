"use client";

import { useState, useEffect } from "react";
import { getUserApplications } from "@/actions/application.actions";
import { submitProject, getProjectSubmissions } from "@/actions/projects.actions";
import { motion, AnimatePresence } from "framer-motion";
import { FolderKanban, CheckCircle, ExternalLink, GitBranch, UploadCloud, Loader2, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Helper to generate dynamic projects based on the internship title
function generateProjectsForDomain(title: string) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes("web") || lowerTitle.includes("full stack")) {
    return [
      { id: "proj_1", title: "Personal Portfolio Website", desc: "Build a responsive portfolio using HTML, CSS, and JS.", difficulty: "Beginner" },
      { id: "proj_2", title: "E-commerce Platform", desc: "Develop a full-stack e-commerce app with cart and checkout functionality.", difficulty: "Advanced" },
      { id: "proj_3", title: "Social Media Dashboard", desc: "Create an interactive dashboard with real-time data visualization.", difficulty: "Intermediate" }
    ];
  }
  if (lowerTitle.includes("data science") || lowerTitle.includes("machine learning")) {
    return [
      { id: "proj_1", title: "Exploratory Data Analysis", desc: "Perform EDA on a real-world dataset and visualize findings.", difficulty: "Beginner" },
      { id: "proj_2", title: "Predictive Pricing Model", desc: "Build an ML model to predict housing prices.", difficulty: "Intermediate" },
      { id: "proj_3", title: "Recommendation System", desc: "Create a content-based recommendation engine.", difficulty: "Advanced" }
    ];
  }
  if (lowerTitle.includes("app") || lowerTitle.includes("android") || lowerTitle.includes("ios")) {
    return [
      { id: "proj_1", title: "Task Manager App", desc: "Build a to-do list app with local storage.", difficulty: "Beginner" },
      { id: "proj_2", title: "Weather Forecast App", desc: "Integrate a weather API to show live forecasts.", difficulty: "Intermediate" },
      { id: "proj_3", title: "Chat Application", desc: "Develop a real-time chat app using Firebase.", difficulty: "Advanced" }
    ];
  }

  // Fallback generic projects
  return [
    { id: "proj_1", title: "Foundation Project", desc: "Apply the basic concepts learned in the first module.", difficulty: "Beginner" },
    { id: "proj_2", title: "Mid-term Application", desc: "Build a functional prototype combining multiple concepts.", difficulty: "Intermediate" },
    { id: "proj_3", title: "Capstone Project", desc: "A comprehensive final project demonstrating mastery of the domain.", difficulty: "Advanced" }
  ];
}

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [internship, setInternship] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  
  // Submission modal state
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const apps = await getUserApplications();
      const activeApp = apps.success && apps.data 
        ? apps.data.find((app: any) => app.status === "Active" || app.status === "Enrolled" || app.status === "Completed") 
        : null;

      if (activeApp && activeApp.internships) {
        setInternship(activeApp.internships);
        setProjects(generateProjectsForDomain(activeApp.internships.title));
        
        const subs = await getProjectSubmissions(activeApp.internships.id);
        if (subs.success) {
          setSubmissions(subs.data);
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) {
      setError("Repository URL is required.");
      return;
    }
    setError("");
    setSubmitting(true);
    
    const res = await submitProject(internship.id, selectedProject.id, repoUrl, liveUrl);
    
    if (res.success) {
      setSubmissions([...submissions, { projectId: selectedProject.id, repoUrl, liveUrl, submittedAt: new Date().toISOString() }]);
      setSelectedProject(null);
      setRepoUrl("");
      setLiveUrl("");
    } else {
      setError("Failed to submit project. Please try again.");
    }
    setSubmitting(false);
  };

  const getSubmissionStatus = (projectId: string) => {
    return submissions.find(s => s.projectId === projectId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Projects Locked</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          You need an active internship enrollment with a verified payment to access the projects section.
        </p>
        <Link href="/dashboard/internships" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
          View My Internships
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-4">
              <FolderKanban className="w-4 h-4" />
              <span>{internship.title} Projects</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
              Build & Submit Your Projects
            </h1>
            <p className="text-indigo-100 text-lg max-w-xl leading-relaxed">
              Apply what you've learned by completing these real-world projects. Submit your GitHub repository and live links to get verified.
            </p>
          </div>
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[140px]">
            <div className="text-3xl font-black mb-1">{submissions.length}/{projects.length}</div>
            <div className="text-indigo-200 font-medium text-sm">Completed</div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.map((proj, idx) => {
          const submission = getSubmissionStatus(proj.id);
          const isCompleted = !!submission;

          return (
            <motion.div 
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border relative overflow-hidden flex flex-col",
                isCompleted 
                  ? "border-emerald-200 dark:border-emerald-900/50" 
                  : "border-slate-200 dark:border-slate-800"
              )}
            >
              {isCompleted && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-bl-full -z-10" />
              )}
              
              <div className="flex justify-between items-start mb-4">
                <span className={cn(
                  "text-xs font-bold px-3 py-1 rounded-full",
                  proj.difficulty === "Beginner" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                  proj.difficulty === "Intermediate" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                )}>
                  {proj.difficulty}
                </span>
                
                {isCompleted && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                    <CheckCircle className="w-3.5 h-3.5" /> Submitted
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{proj.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-1">
                {proj.desc}
              </p>

              {isCompleted ? (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <a href={submission.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="flex items-center gap-2"><GitBranch className="w-4 h-4" /> Repository</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                  {submission.liveUrl && (
                    <a href={submission.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                      <span className="flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Live Demo</span>
                      <ExternalLink className="w-4 h-4 opacity-50" />
                    </a>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedProject(proj)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" /> Submit Project
                </button>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setSelectedProject(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <h3 className="text-xl font-bold">Submit {selectedProject.title}</h3>
                <p className="text-sm text-slate-500 mt-1">Provide the links to your work for verification.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">GitHub Repository URL <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="url"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Live Demo URL (Optional)</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="url"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://my-project.vercel.app"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    disabled={submitting}
                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : "Submit Project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
