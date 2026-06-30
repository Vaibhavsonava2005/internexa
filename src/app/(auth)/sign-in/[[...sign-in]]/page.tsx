"use client";

import { SignIn } from "@clerk/nextjs";
import { useTheme } from "@/hooks";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  const { isDark } = useTheme();

  return (
    <div className="flex w-full min-h-screen">
      {/* Left side - Branding/Illustration */}
      <div className="hidden lg:flex w-1/2 relative bg-indigo-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-indigo-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        <div className="relative z-10 max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-8 border border-white/20">
            <span className="text-white font-bold text-3xl font-heading">I</span>
          </div>
          <h1 className="text-4xl font-bold font-heading text-white mb-6">
            Welcome Back to InterNexa Labs
          </h1>
          <p className="text-indigo-200 text-lg">
            Continue your journey to master industry skills and land your dream job.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-heading font-bold text-2xl text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <span className="text-white text-lg">I</span>
              </div>
              InterNexa Labs
            </Link>
          </div>

          <SignIn
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl",
                headerTitle: "text-2xl font-heading font-bold text-slate-900 dark:text-white",
                headerSubtitle: "text-slate-500 dark:text-slate-400",
                formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
                socialButtonsBlockButton: "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
                formFieldLabel: "text-slate-700 dark:text-slate-300",
                formFieldInput: "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-indigo-500",
                footerActionLink: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
