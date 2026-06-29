"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserApplications } from "@/actions/application.actions";
import { markLessonComplete, getCompletedLessons } from "@/actions/progress.actions";
import { motion } from "framer-motion";
import { CheckCircle, PlayCircle, Video, Code, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Menu, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import Editor from "@monaco-editor/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;

  const [loading, setLoading] = useState(true);
  const [internship, setInternship] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function loadData() {
      const apps = await getUserApplications();
      const activeApp = apps.success && apps.data 
        ? apps.data.find((app: any) => app.status === "Active" || app.status === "Enrolled" || app.status === "Completed") 
        : null;

      if (activeApp && activeApp.internships) {
        setInternship(activeApp.internships);
        setModules(activeApp.internships.modules || []);
        
        const prog = await getCompletedLessons(activeApp.internships.id);
        if (prog.success) {
          setCompletedLessons(prog.data);
        }
      }
      setLoading(false);
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
  modules.forEach(mod => {
    mod.days?.forEach((day: any) => {
      flatLessons.push({ ...day, moduleTitle: mod.title });
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

  const handleMarkComplete = async () => {
    if (!currentLesson || isCompleted) return;
    
    // Optimistic UI update
    setCompletedLessons(prev => [...prev, currentLesson.id]);
    
    await markLessonComplete(currentLesson.id, internship.id);
    
    // Auto advance
    if (nextLesson) {
      setTimeout(() => {
        router.push(`/dashboard/courses/player/${nextLesson.id}`);
      }, 1500);
    }
  };

  const renderContent = () => {
    if (!currentLesson) return <p>Select a lesson from the sidebar.</p>;

    switch (currentLesson.type) {
      case "Video":
        return (
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-800">
            {currentLesson.content_url ? (
              <ReactPlayer 
                url={currentLesson.content_url}
                width="100%"
                height="100%"
                controls
                onEnded={handleMarkComplete}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <Video className="w-12 h-12 mb-2 opacity-50" />
                <p>Video content is being prepared.</p>
              </div>
            )}
          </div>
        );
      
      case "Reading":
        return (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 prose dark:prose-invert max-w-none">
            {currentLesson.content_url && currentLesson.content_url.endsWith('.md') ? (
              <Markdown remarkPlugins={[remarkGfm]}>{`## ${currentLesson.title}\n\nLoading content from repository...`}</Markdown>
            ) : (
              <div>
                <h2>{currentLesson.title}</h2>
                <p>{currentLesson.description}</p>
                {currentLesson.content_url && (
                  <iframe src={currentLesson.content_url} className="w-full h-[600px] mt-4 rounded-xl border border-slate-200" />
                )}
              </div>
            )}
          </div>
        );
      
      case "Coding":
        return (
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 h-[600px] flex flex-col">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
              <span className="font-mono text-emerald-400 font-bold text-sm">Interactive Playground</span>
              <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors">
                Run Code
              </button>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                defaultValue="// Write your code here"
                theme="vs-dark"
                options={{ minimap: { enabled: false }, fontSize: 14 }}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center py-20">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{currentLesson.title}</h3>
            <p className="text-slate-500">{currentLesson.description}</p>
            {currentLesson.content_url && (
              <a href={currentLesson.content_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">
                Open External Resource
              </a>
            )}
          </div>
        );
    }
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
          "shrink-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[calc(100vh-8rem)] sticky top-24 z-40 transition-all shadow-sm",
          !sidebarOpen && "border-none"
        )}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <h2 className="font-bold text-slate-900 dark:text-white truncate">Curriculum</h2>
          <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-2">
          {modules.map((mod: any, mIndex: number) => (
            <div key={mIndex} className="mb-2">
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {mod.title}
              </div>
              <div className="space-y-1">
                {mod.days?.map((lesson: any) => {
                  const isActive = lesson.id === currentLesson?.id;
                  const isDone = completedLessons.includes(lesson.id);
                  
                  return (
                    <Link 
                      href={`/dashboard/courses/player/${lesson.id}`}
                      key={lesson.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl transition-colors",
                        isActive 
                          ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50" 
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent"
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <PlayCircle className={cn("w-5 h-5", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-300 dark:text-slate-600")} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-bold truncate", isActive ? "text-indigo-900 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300")}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          {lesson.type === "Video" && <Video className="w-3 h-3" />}
                          {lesson.type === "Coding" && <Code className="w-3 h-3" />}
                          {lesson.type === "Reading" && <BookOpen className="w-3 h-3" />}
                          {lesson.duration}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Player Area */}
      <div className="flex-1 flex flex-col min-w-0 max-w-5xl mx-auto w-full">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-50">
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
            )}
            <div>
              <Link href="/dashboard/courses" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3 h-3" /> Back to Overview
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {currentLesson?.title || "Lesson"}
              </h1>
            </div>
          </div>
          
          <button 
            onClick={handleMarkComplete}
            disabled={isCompleted}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm",
              isCompleted 
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-default" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> Completed
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" /> Mark as Complete
              </>
            )}
          </button>
        </div>

        {/* Player Content */}
        <div className="flex-1">
          {renderContent()}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          {prevLesson ? (
            <Link 
              href={`/dashboard/courses/player/${prevLesson.id}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" /> Previous Lesson
            </Link>
          ) : <div />}
          
          {nextLesson ? (
            <Link 
              href={`/dashboard/courses/player/${nextLesson.id}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl text-indigo-700 dark:text-indigo-400 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
            >
              Next Lesson <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link 
              href={`/dashboard/courses`}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-sm"
            >
              Finish Module <CheckCircle className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
