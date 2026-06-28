"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { 
  Briefcase, Zap, Flame, Award,
  ArrowRight, Clock, Sparkles, Search,
  MessageSquare, FileText, CheckCircle2, Circle, ChevronDown, ChevronUp, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { Button, Badge } from "@/components/shared";
import { cn } from "@/lib/utils";
import { getUserApplications } from "@/actions/application.actions";
import { Loader2 } from "lucide-react";

const TRACKING_STEPS = [
  "Submitted",
  "Under Review",
  "Accepted",
  "Offer Sent",
  "Enrolled",
  "Internship Started",
  "Internship Completed",
  "Certificate Generated"
];

function getStepIndex(status: string) {
  if (status === "Submitted") return 0;
  if (status === "Under Review") return 1;
  if (status === "Accepted") return 2;
  if (status === "Offer Accepted") return 3;
  if (status === "Enrolled") return 4;
  if (status === "Active") return 5;
  if (status === "Completed") return 6; // Certificate Generated is 7, we assume 6 is Internship Completed
  return -1;
}

export default function DashboardHome() {
  const { user } = useUser();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  useEffect(() => {
    async function loadData(silent = false) {
      if (!silent) setIsLoading(true);
      try {
        const res = await getUserApplications();
        if (res.success && res.data) {
          setApplications(res.data);
          // Auto-expand the first application on load
          if (res.data.length > 0 && !expandedApp) {
            setExpandedApp(res.data[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!silent) setIsLoading(false);
      }
    }
    
    loadData();
    const interval = setInterval(() => loadData(true), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-6 px-0 sm:px-6 lg:px-8 pt-4 md:pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 sm:px-0">
        <div>
          {isLoading ? (
            <div className="h-8 w-64 bg-brand-100 dark:bg-brand-900 animate-pulse rounded-lg mb-2"></div>
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold text-brand-900 dark:text-white tracking-tight mb-1">
              {(() => {
                const hour = new Date().getHours();
                const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
                
                // Prioritize application name, fallback to Clerk firstName, fallback to "Student"
                const name = (applications.length > 0 && applications[0]?.full_name) 
                  ? applications[0].full_name.split(' ')[0] 
                  : (user?.firstName || "Student");
                  
                return `${greeting}, ${name}!`;
              })()}
            </h1>
          )}
          <p className="text-brand-500 dark:text-brand-400 text-sm">
            Track your applications and learning journey.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0">
        {[
          { label: "Active Applications", value: isLoading ? "-" : applications.length.toString(), icon: Briefcase, trend: "View status below" },
          { label: "Total XP Points", value: "0", icon: Zap, trend: "Earn XP by completing tasks" },
          { label: "Current Streak", value: "0 Days", icon: Flame, trend: "Start learning today!" },
          { label: "Certificates", value: "0", icon: Award, trend: "Complete internship to earn" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-brand-950 rounded-3xl p-6 border border-brand-200 dark:border-brand-800 shadow-sm flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-semibold text-brand-500 uppercase tracking-wider">{stat.label}</p>
                <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-900 text-brand-600 dark:text-brand-400">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-brand-900 dark:text-white leading-none mb-2">
                  {stat.value}
                </h3>
                <p className="text-sm text-brand-400">
                  {stat.trend}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-0">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-900 dark:text-white tracking-tight">
              Application Status
            </h2>
          </div>
            
          {isLoading ? (
            <div className="flex justify-center py-12 bg-white dark:bg-brand-950 rounded-3xl border border-brand-200 dark:border-brand-800">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-brand-950 rounded-3xl border border-dashed border-brand-200 dark:border-brand-800 shadow-sm">
              <Briefcase className="w-12 h-12 text-brand-300 dark:text-brand-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-2">No Applications Yet</h3>
              <p className="text-brand-500 mb-6 max-w-sm mx-auto">You haven't applied to any internships. Start your journey today.</p>
              <Button asChild className="h-14 px-8 rounded-full shadow-lg shadow-brand-500/20">
                <Link href="/internships">Explore Programs</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const currentStepIndex = getStepIndex(app.status);
                const isRejected = app.status === "Rejected";
                const isExpanded = expandedApp === app.id;
                const progressPercent = Math.max(5, Math.min(100, Math.round(((currentStepIndex + 1) / TRACKING_STEPS.length) * 100)));

                return (
                  <div key={app.id || Math.random()} className="bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-3xl overflow-hidden shadow-sm transition-all">
                    {/* Header Toggle */}
                    <div 
                      onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                      className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">Ref: {app.referenceNumber}</span>
                          {app.status === "Enrolled" || app.status === "Active" ? (
                            <Badge variant="success" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 border-0">Enrolled</Badge>
                          ) : isRejected ? (
                            <Badge variant="destructive" className="border-0">Rejected</Badge>
                          ) : (
                            <Badge className="bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300 border-0">{app.status}</Badge>
                          )}
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-brand-900 dark:text-white leading-tight">
                          {app.internship?.title || "Internship Program"}
                        </h3>
                        {!isRejected && (
                          <div className="mt-4 flex items-center gap-3">
                            <div className="h-2 w-full bg-brand-100 dark:bg-brand-900 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                className="h-full bg-brand-500 rounded-full"
                              />
                            </div>
                            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 whitespace-nowrap">{progressPercent}%</span>
                          </div>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900 flex items-center justify-center shrink-0 text-brand-600 dark:text-brand-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-brand-100 dark:border-brand-800 bg-brand-50/50 dark:bg-[#0a0a0a]"
                        >
                          <div className="p-6">
                            {app.offerLetterFileId && (
                              <div className="mb-8">
                                <Link 
                                  href={`/api/downloads/${app.offerLetterFileId}`} 
                                  target="_blank"
                                  className="w-full flex items-center justify-center gap-2 h-14 bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-800 rounded-2xl text-brand-900 dark:text-white font-bold hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors shadow-sm"
                                >
                                  <FileText className="w-5 h-5 text-brand-500" />
                                  Download Offer Letter
                                </Link>
                              </div>
                            )}

                            {/* Timeline */}
                            {isRejected ? (
                              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-5 rounded-2xl border border-red-200 dark:border-red-900/50">
                                <p className="font-bold text-lg mb-1">Application Rejected</p>
                                <p className="text-sm leading-relaxed">Unfortunately, we are unable to proceed with your application at this time.</p>
                              </div>
                            ) : (
                              <div className="relative pl-4">
                                <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-brand-200 dark:bg-brand-800" />
                                <div className="space-y-6 relative">
                                  {TRACKING_STEPS.map((step, idx) => {
                                    const isCompleted = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    
                                    // Custom text formatting
                                    let statusText = step;
                                    if (step === "Internship Started" && app.status === "Enrolled") statusText = "Ready to Start";

                                    return (
                                      <div key={step} className="flex items-center gap-5 relative z-10">
                                        <div className={cn(
                                          "w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#0a0a0a] border-2 shadow-sm transition-colors",
                                          isCompleted ? "border-brand-500 text-brand-500 dark:border-brand-400 dark:text-brand-400" : "border-brand-200 dark:border-brand-800 text-brand-300 dark:text-brand-700"
                                        )}>
                                          {isCompleted ? <CheckCircle className="w-4 h-4" strokeWidth={3} /> : <Circle className="w-3 h-3" />}
                                        </div>
                                        <div className="flex-1">
                                          <p className={cn(
                                            "text-base font-bold",
                                            isCurrent ? "text-brand-900 dark:text-white" : isCompleted ? "text-brand-700 dark:text-brand-300" : "text-brand-400 dark:text-brand-600"
                                          )}>
                                            {statusText}
                                          </p>
                                          {isCurrent && (
                                            <p className="text-xs font-medium text-brand-500 mt-0.5">Current Stage</p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-brand-950 rounded-3xl border border-brand-200 dark:border-brand-800 shadow-sm p-6">
            <h2 className="text-xl font-bold text-brand-900 dark:text-white tracking-tight mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Browse Apps", icon: Search, href: "/internships", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                { label: "AI Tools", icon: Zap, href: "/dashboard/ai-assistant", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
                { label: "Resume", icon: FileText, href: "/dashboard/profile", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                { label: "Help", icon: MessageSquare, href: "/dashboard/messages", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-brand-900 border border-brand-100 dark:border-brand-800 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110", action.bg)}>
                    <action.icon className={cn("w-6 h-6", action.color)} />
                  </div>
                  <span className="text-sm font-bold text-brand-900 dark:text-white">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
