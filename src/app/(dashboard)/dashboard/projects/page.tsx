"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderGit2, Link as LinkIcon, GitBranch, Send, Loader2, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { getUserApplications } from "@/actions/application.actions";
import { submitProject } from "@/actions/projects.actions";

// Mock project ideas based on domain
const getProjectsForDomain = (domain: string) => {
  const common = [
    { title: "Portfolio Website", desc: "Build a responsive personal portfolio using modern tools." },
    { title: "Task Management App", desc: "Create a full-stack CRUD application for task tracking." }
  ];
  if (domain.toLowerCase().includes("web") || domain.toLowerCase().includes("stack")) {
    return [
      { title: "E-Commerce Platform API", desc: "Build a robust backend API with authentication, products, and orders." },
      { title: "Real-time Chat App", desc: "Implement WebSockets for a live chat interface." },
      ...common
    ];
  }
  if (domain.toLowerCase().includes("data") || domain.toLowerCase().includes("ai")) {
    return [
      { title: "Predictive Analysis Model", desc: "Train a machine learning model on a public dataset." },
      { title: "Data Visualization Dashboard", desc: "Build an interactive dashboard using D3 or Pandas/Streamlit." },
      ...common
    ];
  }
  return [
    { title: "Industry Capstone Project", desc: "Solve a real-world problem specific to your domain." },
    ...common
  ];
};

export default function ProjectsPage() {
  const [activeDomain, setActiveDomain] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [selectedProject, setSelectedProject] = useState("");
  const [github, setGithub] = useState("");
  const [deployed, setDeployed] = useState("");
  const [desc, setDesc] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await getUserApplications();
      if (res.success && res.data) {
        const active = res.data.find(app => app.status === "Active" || app.status === "Completed");
        if (active) {
          setActiveDomain(active.internships?.category || active.internships?.title || "Technology");
        }
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !github) {
      setError("Please select a project and provide a GitHub link.");
      return;
    }
    
    setSubmitting(true);
    setError("");
    
    const res = await submitProject({
      domain: activeDomain,
      projectTitle: selectedProject,
      githubLink: github,
      deploymentLink: deployed,
      description: desc
    });
    
    setSubmitting(false);
    if (res.success) {
      setSuccess(true);
      setGithub("");
      setDeployed("");
      setDesc("");
      setSelectedProject("");
    } else {
      setError(res.error || "Failed to submit project.");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>;
  }

  if (!activeDomain) {
    return (
      <div className="space-y-8">
        <PageHeader title="My Projects" description="Apply your skills to real-world scenarios." />
        <div className="text-center p-12 bg-slate-900 rounded-3xl border border-slate-800">
          <FolderGit2 className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">Enroll to Unlock Projects</h3>
          <p className="text-slate-400">You need an active internship to view and submit projects.</p>
        </div>
      </div>
    );
  }

  const projectIdeas = getProjectsForDomain(activeDomain);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Project Submissions" 
        description={`Complete and submit projects for your ${activeDomain} internship.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Ideas */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Projects</h3>
          <div className="space-y-4">
            {projectIdeas.map((proj, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedProject(proj.title)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedProject === proj.title 
                    ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 shadow-sm" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                }`}
              >
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{proj.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{proj.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Submission Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 h-fit">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Submit Your Work</h3>
          
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Submission Received!</h4>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Your project has been submitted for review by your mentor.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Selected Project</label>
              <input 
                type="text" 
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                placeholder="Select from left or type custom project"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <GitBranch className="w-4 h-4" /> GitHub Repository URL *
              </label>
              <input 
                type="url" 
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Live Deployment URL (Optional)
              </label>
              <input 
                type="url" 
                value={deployed}
                onChange={(e) => setDeployed(e.target.value)}
                placeholder="https://my-project.vercel.app"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Brief Description</label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What technologies did you use? Any challenges faced?"
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {submitting ? "Submitting..." : "Submit Project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
