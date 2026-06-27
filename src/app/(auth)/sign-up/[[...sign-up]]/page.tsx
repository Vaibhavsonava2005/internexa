"use client";

import { SignUp } from "@clerk/nextjs";
import { useTheme } from "@/hooks";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

const BENEFITS = [
  "Join 50,000+ ambitious learners",
  "Access 200+ premium internship programs",
  "Earn industry-recognized certificates",
  "Get 1-on-1 mentorship from experts",
];

export default function SignUpPage() {
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

        <div className="relative z-10 max-w-md">
          <div className="mb-12">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/20">
              <span className="text-white font-bold text-3xl font-heading">I</span>
            </div>
            <h1 className="text-4xl font-bold font-heading text-white mb-4">
              Start Your Journey
            </h1>
            <p className="text-indigo-200 text-lg">
              Create an account and launch your tech career today.
            </p>
          </div>

          <div className="space-y-6">
            {BENEFITS.map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 text-white">
                <CheckCircle className="w-6 h-6 text-indigo-400 shrink-0" />
                <span className="text-lg text-indigo-50">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 overflow-y-auto py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-heading font-bold text-2xl text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <span className="text-white text-lg">I</span>
              </div>
              InterNexa
            </Link>
          </div>

          <SignUp
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
