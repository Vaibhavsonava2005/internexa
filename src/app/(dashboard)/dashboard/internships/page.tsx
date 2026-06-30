"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageHeader, ProgressBar, Badge } from "@/components/shared";
import { PlayCircle, Clock, CheckCircle, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { getUserApplications } from "@/actions/application.actions";

export default function MyInternshipsPage() {
  const { user } = useUser();
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "pending" | "accepted">("all");
  
  const [applications, setApplications] = useState<any[]>([]);
  const [allInternships, setAllInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);
    
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
      );

      const [resApps, resInterns] = await Promise.all([
        getUserApplications(),
        supabase.from('internships').select('*').eq('is_active', true)
      ]);

      if (resApps.success && resApps.data) {
        setApplications(resApps.data);
      }
      if (resInterns.data) {
        setAllInternships(resInterns.data);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(() => {
      fetchApplications(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const filtered = (() => {
    let result: any[] = [];
    if (filter === "all") {
      result = allInternships.map(internship => {
        const matchingApp = applications.find(app => app.internship_id === internship.id);
        if (matchingApp) return matchingApp;
        
        return {
          id: `unapplied-${internship.id}`,
          status: "Not Applied",
          internships: internship
        };
      });
    } else {
      result = applications.filter(app => {
        if (filter === "pending" && (app.status === "Submitted" || app.status === "Under Review" || app.status === "Payment Verification Pending")) return true;
        if (filter === "accepted" && (app.status === "Accepted" || app.status === "Offer Accepted")) return true;
        if (filter === "active" && (app.status === "Active" || app.status === "Enrolled")) return true;
        if (filter === "completed" && app.status === "Completed") return true;
        return false;
      });
    }

    const statusWeight = (status: string) => {
      if (status === "Active" || status === "Enrolled") return 1;
      if (status === "Accepted" || status === "Offer Accepted") return 2;
      if (status === "Submitted" || status === "Under Review" || status === "Payment Verification Pending") return 3;
      if (status === "Not Applied") return 4;
      if (status === "Completed") return 5;
      return 6;
    };

    return result.sort((a, b) => statusWeight(a.status) - statusWeight(b.status));
  })();

  return (
    <div className="space-y-6 md:space-y-8 relative min-h-screen px-0 sm:px-4 md:px-0">
      <div className="px-4 sm:px-0">
        <PageHeader 
          title="My Internships" 
          description="Track your progress, view offers, and continue learning."
        >
          <Link 
            href="/internships"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Find New Internship
          </Link>
        </PageHeader>
      </div>

      <div className="flex overflow-x-auto no-scrollbar items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 px-4 sm:px-0 scroll-smooth">
        {["all", "pending", "accepted", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-bold capitalize transition-colors shrink-0",
              filter === f 
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm" 
                : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4 sm:px-0">
          {filtered.map((app, index) => {
            const internship = app.internships;
            const isAccepted = app.status === "Accepted" || app.status === "Offer Accepted";
            const isPending = app.status === "Submitted" || app.status === "Under Review" || app.status === "Payment Verification Pending";
            const isActive = app.status === "Active" || app.status === "Enrolled";
            const isCompleted = app.status === "Completed";
            const isNotApplied = app.status === "Not Applied";
            
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={cn("h-40 relative bg-gradient-to-br", internship?.thumbnail || "from-indigo-500 to-violet-600")}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {isCompleted && <Badge variant="success" className="bg-emerald-500 text-white border-0 px-3 py-1 text-sm font-bold shadow-sm">Completed</Badge>}
                    {isActive && <Badge variant="info" className="bg-white text-slate-900 border-0 px-3 py-1 text-sm font-bold shadow-sm">Active</Badge>}
                    {isAccepted && <Badge className="bg-amber-500 text-white border-0 px-3 py-1 text-sm font-bold shadow-sm">Action Required</Badge>}
                    {isPending && <Badge className="bg-slate-500 text-white border-0 px-3 py-1 text-sm font-bold shadow-sm">Under Review</Badge>}
                    {isNotApplied && <Badge className="bg-indigo-500 text-white border-0 px-3 py-1 text-sm font-bold shadow-sm">Open</Badge>}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-bold font-heading text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight">
                    {internship?.title || "Unknown Program"}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mb-6">
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4" />
                      {internship?.duration || "N/A"}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                    
                    {isCompleted && (
                      <>
                        <ProgressBar value={100} showLabel className="mb-6 h-3 rounded-full" />
                        <Link
                          href="/dashboard/certificates"
                          className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          View Certificate
                        </Link>
                      </>
                    )}

                    {isActive && (
                      <div className="space-y-4">
                        <ProgressBar value={15} showLabel className="mb-6 h-3 rounded-full" />
                        
                        <div className="space-y-3">
                          <Link
                            href={`/dashboard/courses`}
                            className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors shadow-sm"
                          >
                            <PlayCircle className="w-5 h-5" />
                            Go to Course
                          </Link>
                          {app.status !== "Rejected" && (
                            <a
                              href={`${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"}/storage/v1/object/public/documents/joining-letters/${app.id}.pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors shadow-sm"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Download Joining Letter
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {isAccepted && (
                      <Link
                        href={`/offer/${app.offer_letter_id}/onboarding`}
                        className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Start Onboarding
                      </Link>
                    )}

                    {isPending && (
                      <div className="flex items-center justify-center gap-2 text-center text-sm font-medium text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-2xl h-14 border border-dashed border-slate-200 dark:border-slate-800">
                        <Clock className="w-4 h-4" />
                        Application under review
                      </div>
                    )}

                    {isNotApplied && (
                      <Link
                        href={`/apply/${internship?.slug}`}
                        className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-md"
                      >
                        Apply Now
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-20 text-center px-4">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No {filter !== "all" ? filter : ""} internships found</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            You don't have any {filter !== "all" ? filter : ""} internships at the moment. Browse our catalog to start learning.
          </p>
          <Link 
            href="/internships"
            className="inline-flex items-center justify-center h-14 px-8 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
          >
            Find Internship
          </Link>
        </div>
      )}
    </div>
  );
}
