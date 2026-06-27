"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileSignature, UploadCloud, Shield, CheckCircle2, Loader2, FileText, ChevronRight } from "lucide-react";
import { completeOnboarding } from "@/actions/onboarding.actions";
import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.offerId as string;

  const [signature, setSignature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!signature.trim()) {
      setError("Please provide your digital signature.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Call Server Action
      const res = await completeOnboarding(offerId, signature);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/internships');
        }, 3000);
      } else {
        setError(res.error || "Failed to complete onboarding");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Onboarding Complete!</h1>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Your NDA and Joining Letter have been generated and emailed to you. Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
            Final Onboarding Steps
          </h1>
          <p className="text-slate-400 mt-2">Sign your agreements to officially join InterNexa.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          
          {/* Step 1: NDA */}
          <div className="transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">1</div>
              <h2 className="text-xl font-bold text-white">Non-Disclosure Agreement (NDA)</h2>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-6 h-48 overflow-y-auto text-sm text-slate-400 space-y-4">
              <p><strong>1. Confidential Information:</strong> The Intern agrees that all materials, code, proprietary processes, client data, and internal communications accessed during the internship are strictly confidential.</p>
              <p><strong>2. Non-Disclosure:</strong> The Intern shall not share, publish, or distribute any confidential information to third parties without prior written consent.</p>
              <p><strong>3. Return of Materials:</strong> Upon completion, the Intern agrees to delete or return all confidential assets.</p>
              <p>By typing your name below, you digitally sign and agree to these terms.</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <FileSignature className="w-4 h-4" /> Digital Signature (Type Full Name)
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 font-serif italic text-lg"
              />
            </div>

            <button onClick={handleSubmit} disabled={isSubmitting || signature.trim().length < 3} 
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
              {isSubmitting ? "Generating Documents..." : "I Agree, Sign & Complete"}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

        </div>
      </div>
    </div>
  );
}
