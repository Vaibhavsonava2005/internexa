"use client";

import { motion } from "framer-motion";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared";
import Link from "next/link";

const TEMPLATES = [
  {
    id: "t1",
    name: "Harvard Classic",
    desc: "The gold standard ATS-friendly template used by Ivy League graduates.",
    color: "bg-slate-100",
    tags: ["ATS Optimized", "Professional", "Strict"]
  },
  {
    id: "t2",
    name: "Tech Innovator",
    desc: "Modern two-column layout perfect for highlighting skills and GitHub projects.",
    color: "bg-indigo-50",
    tags: ["Tech", "Modern", "Creative"]
  },
  {
    id: "t3",
    name: "Executive Brief",
    desc: "Clean and concise layout for experienced professionals and MBA students.",
    color: "bg-blue-50",
    tags: ["Executive", "Clean", "Minimal"]
  },
  {
    id: "t4",
    name: "Data Scientist",
    desc: "Tailored for analytical roles, featuring a dedicated tools & methodologies section.",
    color: "bg-emerald-50",
    tags: ["Data", "Analytical", "Structured"]
  },
  {
    id: "t5",
    name: "Product Manager",
    desc: "Focuses on impact, metrics, and leadership experience.",
    color: "bg-purple-50",
    tags: ["Product", "Leadership", "Metrics"]
  },
  {
    id: "t6",
    name: "Startup Hustler",
    desc: "Bold typography and high-contrast sections to stand out at fast-paced startups.",
    color: "bg-rose-50",
    tags: ["Startup", "Bold", "Impactful"]
  }
];

export default function ResumePage() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Resume Templates" 
        description="Download premium ATS-friendly templates to craft the perfect resume."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((tpl, index) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Preview Area */}
            <div className={`h-48 ${tpl.color} dark:bg-slate-800 p-6 flex flex-col justify-center items-center relative overflow-hidden border-b border-slate-100 dark:border-slate-800`}>
              <div className="w-24 h-32 bg-white dark:bg-slate-900 shadow-md rounded border border-slate-200 dark:border-slate-700 relative flex flex-col p-2 gap-2 transform group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="w-3/4 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-1" />
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="w-4/5 h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
              </div>
            </div>

            {/* Details Area */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{tpl.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 h-10">{tpl.desc}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {tpl.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              <Link 
                href={`/dashboard/resume/preview/${tpl.id}`}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Template
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
