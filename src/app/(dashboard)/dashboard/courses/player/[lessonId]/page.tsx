"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getUserApplications } from "@/actions/application.actions";
import { markLessonComplete, getCompletedLessons } from "@/actions/progress.actions";
import { motion } from "framer-motion";
import { CheckCircle, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Menu, Loader2, ArrowLeft, Lock, FileText, Clock, Award } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format, differenceInDays, addDays, startOfDay } from "date-fns";
import { marked } from "marked";

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const searchParams = useSearchParams();
  const targetAppId = searchParams.get("appId");

  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [internship, setInternship] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const apps = await getUserApplications();
        const activeApp = apps.success && apps.data 
          ? apps.data.find((app: any) => {
              if (targetAppId) return app.id === targetAppId;
              return app.status === "Active" || app.status === "Enrolled" || app.status === "Completed";
            }) 
          : null;

        if (activeApp && activeApp.internships) {
          setApplication(activeApp);
          setInternship(activeApp.internships);
          setModules(activeApp.internships.modules || []);
          
          const prog = await getCompletedLessons(activeApp.internships.id);
          if (prog.success) {
            setCompletedLessons(prog.data);
          }
        }
      } catch (err) {
        console.error("Failed to load course data", err);
      } finally {
        setLoading(false);
        setIsMounted(true);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!internship || modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <BookOpen className="w-16 h-16 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold">No Course Content Found</h2>
        <Link href="/dashboard/courses" className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg">Return to Courses</Link>
      </div>
    );
  }

  // Find current lesson
  let currentLesson = null;
  let nextLesson = null;
  let prevLesson = null;
  
  let flatLessons: any[] = [];
  let gIndex = 0;
  modules.forEach((mod, mIndex) => {
    if (!mod) return;
    (mod.days || []).forEach((day: any, dIndex: number) => {
      if (!day) return;
      const pseudoId = day.id || `mod-${mIndex}-day-${dIndex}`;
      flatLessons.push({ ...day, id: pseudoId, moduleTitle: mod.title, globalIndex: gIndex });
      gIndex++;
    });
  });

  const currentIndex = flatLessons.findIndex(l => l.id === lessonId);
  
  if (currentIndex !== -1) {
    currentLesson = flatLessons[currentIndex];
    if (currentIndex < flatLessons.length - 1) nextLesson = flatLessons[currentIndex + 1];
    if (currentIndex > 0) prevLesson = flatLessons[currentIndex - 1];
  } else if (flatLessons.length > 0) {
    currentLesson = flatLessons[0];
    if (flatLessons.length > 1) nextLesson = flatLessons[1];
  }

  const isCompleted = currentLesson ? completedLessons.includes(currentLesson.id) : false;

  let startDate = new Date();
  if (application) {
    const rawDate = application.start_date || application.submission_date;
    if (rawDate) {
      if (typeof rawDate === "string" && rawDate.includes("-") && !rawDate.includes("T")) {
        const [year, month, day] = rawDate.split('-').map(Number);
        startDate = new Date(year, month - 1, day);
      } else {
        const parsed = new Date(rawDate);
        if (!isNaN(parsed.getTime())) {
          startDate = parsed;
        }
      }
    }
  }

  // Calculate strict calendar days passed
  const todayStart = startOfDay(new Date());
  const courseStart = startOfDay(startDate);
  const daysPassed = differenceInDays(todayStart, courseStart);

  const handleMarkComplete = async () => {
    if (!currentLesson || isCompleted || currentLesson.globalIndex > daysPassed) return;
    
    // Optimistic UI update
    setCompletedLessons(prev => [...prev, currentLesson.id]);
    
    try {
      await markLessonComplete(currentLesson.id, internship.id);
    } catch (err) {
      console.error(err);
    }
    
    // Auto advance
    if (nextLesson) {
      setTimeout(() => {
        router.push(`/dashboard/courses/player/${nextLesson.id}`);
      }, 1500);
    }
  };

  const renderContent = () => {
    if (!currentLesson) return <p>Select a lesson from the sidebar.</p>;

    if (!isCompleted && currentLesson.globalIndex > daysPassed) {
      const unlockDate = addDays(startDate, currentLesson.globalIndex);
      return (
        <div className="w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center py-32 shadow-sm">
          <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <Lock className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">Day {currentLesson.globalIndex !== undefined ? currentLesson.globalIndex + 1 : currentLesson.day || 1} is Locked</h2>
          <p className="text-slate-500 max-w-md mb-8 text-lg">
            This module is part of your daily drip schedule to ensure you properly absorb the material.
          </p>
          <div className="px-8 py-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold rounded-2xl border border-indigo-100 dark:border-indigo-800 text-lg flex items-center gap-3">
            <Clock className="w-6 h-6" />
            Unlocks on {isNaN(unlockDate.getTime()) ? "a future date" : format(unlockDate, 'EEEE, MMMM do')}
          </div>
        </div>
      );
    }

    const rawMarkdown = currentLesson.content_markdown || 
      `# ${currentLesson.title}\n\nThis document is currently being generated or could not be found. Please check back later.`;
      
    let htmlContent = "";
    try {
      htmlContent = marked.parse(rawMarkdown) as string;
    } catch (e) {
      console.error("Markdown parse error:", e);
      htmlContent = "<p>Error parsing document content.</p>";
    }

    return (
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
        {/* Document Header Cover */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <BookOpen className="w-64 h-64" />
          </div>
          <div className="relative z-10 text-white">
            <div className="flex items-center gap-3 mb-4 text-indigo-100 font-medium">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/10">Day {currentLesson.globalIndex !== undefined ? currentLesson.globalIndex + 1 : currentLesson.day || 1}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {currentLesson.duration || "45 mins"}</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> {currentLesson.moduleTitle}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              {currentLesson.title}
            </h1>
            <p className="text-indigo-100 text-lg max-w-2xl">
              {currentLesson.description || "Read through this comprehensive guide to master today's topic."}
            </p>
          </div>
        </div>
        
        {/* Document Body */}
        <div className="p-8 md:p-12 md:px-16">
          <div 
            className="prose prose-slate dark:prose-invert prose-lg max-w-none 
                       prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                       prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                       prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                       prose-img:rounded-2xl prose-img:shadow-md
                       prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl
                       prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-indigo-50 dark:prose-code:bg-indigo-900/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
                       prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-900/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Overlay for Mobile */}
      {!sidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Curriculum Sidebar */}
      <motion.div 
        initial={false}
        animate={{ width: sidebarOpen ? "320px" : "0px", opacity: sidebarOpen ? 1 : 0 }}
        className={cn(
          "shrink-0 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[calc(100vh-8rem)] sticky top-24 z-40 transition-all shadow-sm",
          !sidebarOpen && "border-none"
        )}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h2 className="font-bold text-slate-900 dark:text-white truncate">Curriculum Outline</h2>
          <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-3">
          {modules.map((mod: any, mIndex: number) => {
            if (!mod) return null;
            return (
            <div key={mIndex} className="mb-4">
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                {mod.title}
                {mod.days && mod.days.every((d: any) => completedLessons.includes(d.id)) && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
              <div className="space-y-1">
                {(mod.days || []).map((lesson: any) => {
                  if (!lesson) return null;
                  const isActive = lesson.id === currentLesson?.id;
                  const isDone = completedLessons.includes(lesson.id);
                  const isLocked = !isDone && (lesson.globalIndex ?? 0) > daysPassed;
                  
                  return (
                    <Link 
                      href={isLocked ? "#" : `/dashboard/courses/player/${lesson.id}`}
                      key={lesson.id}
                      onClick={(e) => isLocked && e.preventDefault()}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl transition-all relative group",
                        isActive 
                          ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 shadow-sm" 
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent",
                        isLocked && "opacity-60 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent"
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isLocked ? (
                          <Lock className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                        ) : isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <FileText className={cn("w-5 h-5", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500")} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-bold truncate transition-colors", 
                          isActive ? "text-indigo-900 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300",
                          isLocked && "group-hover:text-slate-700 dark:group-hover:text-slate-300"
                        )}>
                          Day {lesson.globalIndex !== undefined ? lesson.globalIndex + 1 : lesson.day || 1}: {lesson.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          {lesson.duration}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Player Area */}
      <div className="flex-1 flex flex-col min-w-0 max-w-5xl mx-auto w-full pb-12">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
            )}
            <div>
              <Link href="/dashboard/courses" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 mb-1">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Player Content */}
        <div className="flex-1">
          {renderContent()}
        </div>

        {/* Bottom Navigation & Mark Complete */}
        <div className="mt-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {prevLesson ? (
                <Link 
                  href={prevLesson.globalIndex > daysPassed ? "#" : `/dashboard/courses/player/${prevLesson.id}`}
                  onClick={(e) => prevLesson.globalIndex > daysPassed && e.preventDefault()}
                  className={cn(
                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                    prevLesson.globalIndex > daysPassed && "opacity-50 cursor-not-allowed hover:bg-slate-50"
                  )}
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </Link>
              ) : <div className="hidden sm:block w-32" />}
            </div>

            <button 
              onClick={handleMarkComplete}
              disabled={isCompleted || (currentLesson && currentLesson.globalIndex > daysPassed)}
              className={cn(
                "w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-lg transition-all shadow-sm",
                isCompleted 
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-800 cursor-default" 
                  : (currentLesson && currentLesson.globalIndex > daysPassed)
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-2 border-slate-200 dark:border-slate-700"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:shadow-lg"
              )}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-6 h-6" /> Document Completed
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" /> Mark Document as Read
                </>
              )}
            </button>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {nextLesson ? (
                <Link 
                  href={nextLesson.globalIndex > daysPassed ? "#" : `/dashboard/courses/player/${nextLesson.id}`}
                  onClick={(e) => nextLesson.globalIndex > daysPassed && e.preventDefault()}
                  className={cn(
                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl text-indigo-700 dark:text-indigo-400 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors",
                    nextLesson.globalIndex > daysPassed && "opacity-50 cursor-not-allowed hover:bg-indigo-50"
                  )}
                >
                  Next <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link 
                  href={`/dashboard/courses`}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  Finish <CheckCircle className="w-5 h-5" />
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
