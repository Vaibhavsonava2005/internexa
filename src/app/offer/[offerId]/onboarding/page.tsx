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

  const [step, setStep] = useState<1 | 2>(1);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [signature, setSignature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!idFile || !signature.trim()) {
      setError("Please upload an ID and provide your digital signature.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 1. Upload ID to Supabase
      const fileExt = idFile.name.split('.').pop();
      const fileName = `id-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`id-proofs/${fileName}`, idFile);

      if (uploadError) throw new Error("Failed to upload ID proof");

      // 2. Call Server Action
      const res = await completeOnboarding(offerId, uploadData.path, signature);

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
          <div className={`transition-all duration-300 ${step !== 1 ? "opacity-50 pointer-events-none" : ""}`}>
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

            {step === 1 && (
              <button onClick={() => {
                if (signature.trim().length > 2) setStep(2);
                else setError("Please enter your full name to sign");
              }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                I Agree & Sign <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {error && step === 1 && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}

          <div className="h-px bg-slate-800 my-8" />

          {/* Step 2: ID Upload */}
          <div className={`transition-all duration-300 ${step !== 2 ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">2</div>
              <h2 className="text-xl font-bold text-white">Identity Verification</h2>
            </div>

            <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-950 hover:bg-slate-900 transition-colors cursor-pointer relative group">
              <input type="file" onChange={handleFileUpload} accept="image/*,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{idFile ? idFile.name : "Upload College ID or Gov ID"}</p>
                  <p className="text-slate-500 text-sm mt-1">PNG, JPG, or PDF (Max 5MB)</p>
                </div>
              </div>
            </div>

            {error && step === 2 && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

            {step === 2 && (
              <div className="mt-8 flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium">
                  Back
                </button>
                <button onClick={handleSubmit} disabled={isSubmitting || !idFile} 
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                  {isSubmitting ? "Generating Documents..." : "Complete Onboarding"}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
