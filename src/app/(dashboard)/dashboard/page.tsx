"use client";

import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { 
  Briefcase, Zap, Flame, Award,
  ArrowRight, Clock, Sparkles, Search,
  MessageSquare, FileText, CheckCircle2, Circle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shared";
import { cn } from "@/lib/utils";
import { getUserApplications } from "@/actions/application.actions";
import { Loader2 } from "lucide-react";

const STATS = [
  { label: "Active Applications", value: "1", icon: Briefcase, trend: "View status below" },
  { label: "Total XP Points", value: "2,450", icon: Zap, trend: "+350 this week" },
  { label: "Current Streak", value: "7 Days", icon: Flame, trend: "Personal best: 14" },
  { label: "Certificates", value: "0", icon: Award, trend: "Complete internship to earn" },
];

const TRACKING_STEPS = [
  "Submitted",
  "Under Review",
  "Interview Scheduled",
  "Approved",
  "Offer Letter Generated",
  "Internship Started",
  "Internship Completed",
  "Certificate Issued"
];

export default function DashboardHome() {
  const { user } = useUser();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getUserApplications();
        if (res.success && res.data) {
          setApplications(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-900 dark:text-white tracking-tight mb-2">
            Welcome back, {user?.firstName || "Student"}
          </h1>
          <p className="text-brand-500 dark:text-brand-400 text-sm">
            Track your applications and learning journey.
          </p>
        </div>
        <Button className="shrink-0 group" size="sm">
          <Sparkles className="w-4 h-4 mr-2 text-accent-100" />
          Claim Daily Reward
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-brand-950 rounded-xl p-5 border border-brand-200 dark:border-brand-800 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-brand-500">{stat.label}</p>
                <div className="p-2 rounded bg-brand-50 dark:bg-brand-900 text-brand-500">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-brand-900 dark:text-white leading-none mb-2">
                  {stat.value}
                </h3>
                <p className="text-xs text-brand-400">
                  {stat.trend}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-brand-950 rounded-xl border border-brand-200 dark:border-brand-800 shadow-sm p-6">
            <h2 className="text-lg font-bold text-brand-900 dark:text-white tracking-tight mb-6">
              Application Status
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12 bg-brand-50 dark:bg-[#0a0a0a] rounded-xl border border-dashed border-brand-200 dark:border-brand-800">
                <Briefcase className="w-8 h-8 text-brand-400 mx-auto mb-3" />
                <h3 className="text-brand-900 dark:text-white font-medium mb-1">No Applications Yet</h3>
                <p className="text-sm text-brand-500 mb-4">You haven't applied to any internships.</p>
                <Button asChild size="sm">
                  <Link href="/internships">Explore Programs</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {applications.map((app) => {
                  const currentStepIndex = TRACKING_STEPS.indexOf(app.status);
                  const isRejected = app.status === "Rejected";

                  return (
                    <div key={app.id || Math.random()} className="border border-brand-100 dark:border-brand-900 rounded-xl p-6 bg-brand-50 dark:bg-[#0a0a0a]">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-brand-200 dark:border-brand-800">
                        <div>
                          <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
                            Ref: {app.referenceNumber}
                          </p>
                          <h3 className="text-lg font-bold text-brand-900 dark:text-white">
                            {app.internship?.title || "Internship Program"}
                          </h3>
                        </div>
                        {app.offerLetterFileId && (
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/api/downloads/${app.offerLetterFileId}`} target="_blank">
                              Download Offer Letter
                            </Link>
                          </Button>
                        )}
                      </div>

                      {/* Timeline */}
                      {isRejected ? (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-900/50">
                          <p className="font-medium">Application Rejected</p>
                          <p className="text-sm mt-1">Unfortunately, we are unable to proceed with your application at this time.</p>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-brand-200 dark:bg-brand-800" />
                          <div className="space-y-6 relative">
                            {TRACKING_STEPS.map((step, idx) => {
                              const isCompleted = idx <= currentStepIndex;
                              const isCurrent = idx === currentStepIndex;
                              return (
                                <div key={step} className="flex items-center gap-4 relative z-10">
                                  <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-[#0a0a0a] border-2",
                                    isCompleted ? "border-emerald-500 text-emerald-500" : "border-brand-300 dark:border-brand-700 text-brand-300 dark:text-brand-700"
                                  )}>
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
                                  </div>
                                  <p className={cn(
                                    "text-sm font-medium",
                                    isCurrent ? "text-brand-900 dark:text-white" : "text-brand-500 dark:text-brand-400"
                                  )}>
                                    {step}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-brand-950 rounded-xl border border-brand-200 dark:border-brand-800 shadow-sm p-6">
            <h2 className="text-lg font-bold text-brand-900 dark:text-white tracking-tight mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Browse", icon: Search, href: "/internships", color: "text-blue-500" },
                { label: "AI Tools", icon: Zap, href: "/dashboard/ai-assistant", color: "text-violet-500" },
                { label: "Resume", icon: FileText, href: "/dashboard/profile", color: "text-emerald-500" },
                { label: "Help", icon: MessageSquare, href: "/dashboard/messages", color: "text-amber-500" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-brand-50 dark:bg-[#0a0a0a] hover:bg-brand-100 dark:hover:bg-brand-900 border border-brand-100 dark:border-brand-900 transition-colors text-center group"
                >
                  <action.icon className={cn("w-6 h-6 mb-2 transition-transform group-hover:scale-110", action.color)} />
                  <span className="text-xs font-medium text-brand-700 dark:text-brand-300">
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
