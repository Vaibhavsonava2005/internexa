"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileSignature, UploadCloud, Shield, CheckCircle2, Loader2, FileText, ChevronRight, CreditCard, ExternalLink } from "lucide-react";
import { completeOnboarding } from "@/actions/onboarding.actions";

export default function OnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.offerId as string;

  const [step, setStep] = useState<1 | 2>(1);
  const [signature, setSignature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentClicked, setPaymentClicked] = useState(false);

  const handleNextStep = () => {
    if (!signature.trim() || signature.length < 3) {
      setError("Please provide a valid digital signature.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleVerifyPayment = async () => {
    setIsSubmitting(true);
    setError("");

    // Simulated Verification Delay
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const res = await completeOnboarding(offerId, signature);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/offer/${offerId}/success`);
        }, 1500);
      } else {
        setError(res.error || "Payment verification failed. Please contact support.");
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
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Redirecting to your Official Joining Letter...</p>
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
          <p className="text-slate-400 mt-2">Complete these final steps to officially join InterNexa.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          
          {step === 1 ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="transition-all duration-300">
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

              <button onClick={handleNextStep} disabled={signature.trim().length < 3} 
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
                Sign & Continue to Step 2 <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">2</div>
                <h2 className="text-xl font-bold text-white">Professional Services Fee</h2>
              </div>
              
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-8 text-slate-300 space-y-4">
                <p className="text-lg">To finalize your enrollment, a nominal fee of <strong className="text-white">₹199</strong> is required.</p>
                <div className="space-y-3 mt-4">
                  <h4 className="font-bold text-indigo-400">What is included?</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Industry-recognized Professional Certificate</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Official Experience Letter upon completion</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Letter of Recommendation (Performance based)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instantly generated Official Joining Letter</li>
                  </ul>
                </div>
              </div>

              {!paymentClicked ? (
                <a
                  href="https://rzp.io/rzp/lkeeUyjf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setPaymentClicked(true)}
                  className="w-full bg-[#3399cc] hover:bg-[#2b88b7] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 mb-4"
                >
                  <CreditCard className="w-5 h-5" /> Pay ₹199 via Razorpay <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button 
                  onClick={handleVerifyPayment} 
                  disabled={isSubmitting} 
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                  {isSubmitting ? "Verifying Payment..." : "I have completed the payment"}
                </button>
              )}
            </motion.div>
          )}

          {error && <p className="text-red-400 text-sm mt-6 text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

        </div>
      </div>
    </div>
  );
}
