"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function InviteClient({ code }: { code: string }) {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Automatically redirect after 3 seconds for a smooth transition effect
    const timer = setTimeout(() => {
      setRedirecting(true);
      window.location.href = `/sign-up?ref=${code}`;
    }, 3000);

    return () => clearTimeout(timer);
  }, [code, router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[25%] -left-[10%] w-[50%] h-[50%] bg-violet-500/20 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
          You've been invited!
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          A friend has invited you to join InterNexa Labs. Start your journey today and get access to premium AI internships.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>35+ Premium Domains</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Real-world Capstone Projects</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>ISO-Verified Certificates</span>
          </div>
        </div>

        <button
          onClick={() => {
            setRedirecting(true);
            window.location.href = `/sign-up?ref=${code}`;
          }}
          disabled={redirecting}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
        >
          {redirecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Redirecting...
            </>
          ) : (
            <>
              Accept Invite & Sign Up
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
