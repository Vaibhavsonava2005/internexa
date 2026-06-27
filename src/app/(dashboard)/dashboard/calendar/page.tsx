"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, CheckCircle2, Clock, CalendarDays, Award } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { getUserApplications } from "@/actions/application.actions";

export default function CalendarPage() {
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getUserApplications();
      if (res.success && res.data) {
        const activeOrCompleted = res.data.find(app => app.status === "Active" || app.status === "Completed");
        setApplication(activeOrCompleted);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>;
  }

  if (!application) {
    return (
      <div className="space-y-8">
        <PageHeader title="Internship Calendar" description="Track your internship progress day by day." />
        <div className="text-center p-12 bg-slate-900 rounded-3xl border border-slate-800">
          <CalendarIcon className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No Active Internship</h3>
          <p className="text-slate-400">Enroll in an internship to track your daily progress.</p>
        </div>
      </div>
    );
  }

  // Parse start date from DB or fallback to application creation date if missing
  const startDateStr = application.start_date || application.created_at;
  const startDate = new Date(startDateStr);
  startDate.setHours(0, 0, 0, 0);

  // Compute duration correctly based on string (e.g. "60 Days", "4 Weeks", "6 Months")
  const durationStr = (application.internships?.duration || "4 Weeks").toLowerCase();
  const num = parseInt(durationStr.match(/\d+/)?.[0] || "4");
  let totalDays = num * 7; // Default to weeks

  if (durationStr.includes("day")) {
    totalDays = num;
  } else if (durationStr.includes("month")) {
    totalDays = num * 30; // Approximation
  } else if (durationStr.includes("week")) {
    totalDays = num * 7;
  }

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + totalDays - 1); // Inclusive end date

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate days passed (progress)
  let daysPassed = 0;
  if (today > startDate) {
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    daysPassed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } else if (today.getTime() === startDate.getTime()) {
    daysPassed = 1;
  }

  // Cap daysPassed at totalDays
  daysPassed = Math.min(daysPassed, totalDays);
  
  if (application.status === "Completed") {
    daysPassed = totalDays; // Force complete
  }

  const progressPercentage = Math.round((daysPassed / totalDays) * 100);

  // Generate an array of dates for the grid
  const daysArray = Array.from({ length: totalDays }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Internship Progress Calendar" 
        description="Track your daily progress from start to finish."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Start Date</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">End Date</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <Clock className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500">Progress</p>
            <div className="flex items-end justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {daysPassed} / {totalDays} Days
              </h3>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Tracker</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-3 h-3 rounded-full bg-emerald-500" /> Completed
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" /> Upcoming
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {daysArray.map((date, index) => {
            const isPast = date < today || (date.getTime() === today.getTime() && daysPassed > 0);
            const isToday = date.getTime() === today.getTime();
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  isPast 
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" 
                    : isToday
                    ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 ring-4 ring-indigo-500/20"
                    : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                }`}
              >
                <span className={`text-xs font-medium mb-1 ${isPast ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}>
                  Day {index + 1}
                </span>
                <span className={`font-bold ${isPast ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
                  {date.getDate()}
                </span>
                
                {isPast && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute -top-2 -right-2 bg-white dark:bg-slate-900 rounded-full" />
                )}
                
                {isToday && !isPast && (
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
