"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, PlayCircle, BookOpen, Loader2, ChevronDown, ChevronUp, CheckCircle, Video, FileText, Code, BadgeCheck } from "lucide-react";
import { getUserApplications } from "@/actions/application.actions";
import { checkAndProcessGraduations } from "@/actions/graduation.actions";
import { generateDynamicCurriculum, CurriculumModule } from "@/lib/curriculum-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [activeAppIndex, setActiveAppIndex] = useState(0);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  useEffect(() => {
    async function load() {
      // 1. Fetch applications
      const apps = await getUserApplications();
      
      // 2. Determine active apps
      const activeAppsList = apps.success && apps.data ? apps.data.filter((app: any) => app.status === "Active" || app.status === "Enrolled" || app.status === "Completed") : [];
      setApplications(activeAppsList);

      if (activeAppsList.length > 0) {
        const storedAppId = sessionStorage.getItem("internexa_active_course_app_id");
        if (storedAppId) {
          const foundIdx = activeAppsList.findIndex((a: any) => a.id === storedAppId);
          if (foundIdx !== -1) {
            setActiveAppIndex(foundIdx);
          }
        }
      }
      
      // 3. Background graduation check (lazy evaluation)
      if (activeAppsList.length > 0) {
        // use the clerk_id from the first application
        const clerkId = activeAppsList[0].clerk_id;
        checkAndProcessGraduations(clerkId).then(res => {
          // If graduations were processed, we might want to reload or we can just rely on the next visit
          if (res.success && res.processed > 0) {
            console.log("Processed " + res.processed + " graduations");
          }
        });
      }

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Active Courses</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">You need to enroll in an internship program and complete onboarding to access the course curriculum.</p>
      </div>
    );
  }

  const application = applications[activeAppIndex];
  
  if (application.status === "Completed") {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Course Tabs (if multiple) */}
        {applications.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {applications.map((app, idx) => (
              <button
                key={app.id}
                onClick={() => setActiveAppIndex(idx)}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all border",
                  activeAppIndex === idx 
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20"
                    : "bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800"
                )}
              >
                {app.internships?.title || `Course ${idx + 1}`}
              </button>
            ))}
          </div>
        )}
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BadgeCheck className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Course Completed!</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            Congratulations! You have successfully completed this internship program. Your official certificates and documents have been generated.
          </p>
          <Link 
            href="/dashboard/certificates"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors"
          >
            View My Certificates
          </Link>
        </div>
      </div>
    );
  }

  const internship = application.internships;
  
  const modules = internship?.modules && Array.isArray(internship.modules) && internship.modules.length > 0
    ? internship.modules
    : generateDynamicCurriculum(internship?.category || "Default", internship?.duration_days || 30);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Course Tabs (if multiple) */}
      {applications.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {applications.map((app, idx) => (
            <button
              key={app.id}
              onClick={() => {
                setActiveAppIndex(idx);
                sessionStorage.setItem("internexa_active_course_app_id", app.id);
              }}
              className={cn(
                "px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all border",
                activeAppIndex === idx 
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              {app.internships?.title || `Course ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{internship?.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Official Course Curriculum & Learning Path</p>
          <div className="flex items-center gap-4 mt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
              <Clock className="w-4 h-4" /> {internship?.duration || "4 Weeks"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
              <BookOpen className="w-4 h-4" /> {modules.length} Modules
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {modules.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Curriculum is being prepared...</p>
          </div>
        ) : (
          modules.map((mod: any, index: number) => {
            const isExpanded = expandedModule === index;
            
            return (
              <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all">
                <div 
                  onClick={() => setExpandedModule(isExpanded ? null : index)}
                  className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-lg shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                        {mod.title || `Module ${index + 1}`}
                      </h3>
                      {mod.duration && (
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {mod.duration}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0a0a0a]"
                    >
                      <div className="p-6">
                        {mod.description && (
                          <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            {mod.description}
                          </p>
                        )}
                        
                        {mod.days && Array.isArray(mod.days) && mod.days.length > 0 ? (
                          <div className="space-y-3">
                            {mod.days.map((lesson: any, dIndex: number) => (
                              <Link 
                                href={`/dashboard/courses/player/${lesson.id || `mod-${index}-day-${dIndex}`}?appId=${application.id}`}
                                key={dIndex} 
                                className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors group cursor-pointer"
                              >
                                <div className="mt-0.5">
                                  {lesson.type === "Video" ? (
                                    <Video className="w-5 h-5 text-indigo-500" />
                                  ) : lesson.type === "Coding" ? (
                                    <Code className="w-5 h-5 text-emerald-500" />
                                  ) : lesson.type === "Project" ? (
                                    <BadgeCheck className="w-5 h-5 text-amber-500" />
                                  ) : (
                                    <FileText className="w-5 h-5 text-blue-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    Day {lesson.day || lesson.globalIndex + 1 || dIndex + 1}: {lesson.title}
                                  </h4>
                                  {lesson.duration && (
                                    <p className="text-xs font-medium text-slate-500 mt-1">{lesson.duration}</p>
                                  )}
                                </div>
                                <PlayCircle className="w-6 h-6 text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 transition-colors" />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500">
                            Course content for this module is being processed.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
