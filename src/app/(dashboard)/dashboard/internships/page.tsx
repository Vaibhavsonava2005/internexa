"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageHeader, ProgressBar, Badge } from "@/components/shared";
import { PlayCircle, Clock, CheckCircle, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { CheckoutModal } from "@/components/dashboard/CheckoutModal";
import { getUserApplications } from "@/actions/application.actions";

export default function MyInternshipsPage() {
  const { user } = useUser();
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "pending" | "accepted">("all");
  
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Checkout State
  const [checkoutData, setCheckoutData] = useState<{
    isOpen: boolean;
    appId: string;
    internshipName: string;
    amount: number;
  }>({
    isOpen: false,
    appId: "",
    internshipName: "",
    amount: 0
  });

  const fetchApplications = async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);
    
    try {
      const res = await getUserApplications();
      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
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

  const handleCheckoutSuccess = () => {
    // Refresh applications to show Enrolled/Active status
    fetchApplications();
  };

  const filtered = applications.filter(app => {
    if (filter === "all") return true;
    if (filter === "pending" && app.status === "Submitted") return true;
    if (filter === "accepted" && (app.status === "Accepted" || app.status === "Offer Accepted")) return true;
    if (filter === "active" && (app.status === "Active" || app.status === "Enrolled")) return true;
    if (filter === "completed" && app.status === "Completed") return true;
    return false;
  });

  return (
    <div className="space-y-8 relative min-h-screen">
      <PageHeader 
        title="My Internships" 
        description="Track your progress, view offers, and continue learning."
      >
        <Link 
          href="/internships"
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Find New Internship
        </Link>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {["all", "pending", "accepted", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors",
              filter === f 
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((app, index) => {
            const internship = app.internships;
            const isAccepted = app.status === "Accepted" || app.status === "Offer Accepted";
            const isPending = app.status === "Submitted" || app.status === "Under Review";
            const isActive = app.status === "Active" || app.status === "Enrolled";
            const isCompleted = app.status === "Completed";
            
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col"
              >
                <div className={cn("h-32 relative bg-gradient-to-br", internship?.thumbnail || "from-indigo-500 to-violet-600")}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4">
                    {isCompleted && <Badge variant="success" className="bg-emerald-500 text-white">Completed</Badge>}
                    {isActive && <Badge variant="info" className="bg-white text-slate-900">Active</Badge>}
                    {isAccepted && <Badge className="bg-amber-500 text-white border-0">Action Required</Badge>}
                    {isPending && <Badge className="bg-slate-500 text-white border-0">Under Review</Badge>}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-4 line-clamp-2">
                    {internship?.title || "Unknown Program"}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {internship?.duration || "N/A"}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    
                    {isCompleted && (
                      <>
                        <ProgressBar value={100} showLabel className="mb-4" />
                        <Link
                          href="/dashboard/certificates"
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          View Certificate
                        </Link>
                      </>
                    )}

                    {isActive && (
                      <>
                        <ProgressBar value={15} showLabel className="mb-4" />
                        <Link
                          href={`/dashboard/internships/${app.id}`}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Continue Learning
                        </Link>
                      </>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => setCheckoutData({
                          isOpen: true,
                          appId: app.id,
                          internshipName: internship?.title,
                          amount: 999 // Fixed price for the demo, or fetch from DB
                        })}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
                      >
                        <CreditCard className="w-4 h-4" />
                        Pay to Enroll
                      </button>
                    )}

                    {isPending && (
                      <div className="text-center text-sm text-slate-500 py-2">
                        Your application is under review.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No {filter !== "all" ? filter : ""} internships found</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            You don't have any {filter !== "all" ? filter : ""} internships at the moment. Browse our catalog to start learning.
          </p>
        </div>
      )}

      <CheckoutModal 
        isOpen={checkoutData.isOpen}
        onClose={() => setCheckoutData(prev => ({ ...prev, isOpen: false }))}
        applicationId={checkoutData.appId}
        internshipName={checkoutData.internshipName}
        amount={checkoutData.amount}
        clerkId={user?.id || ""}
        studentName={user?.fullName || ""}
        email={user?.primaryEmailAddress?.emailAddress || ""}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
