"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileSignature, UploadCloud, Shield, CheckCircle2, Loader2, FileText, ChevronRight, CreditCard, ExternalLink, AlertTriangle } from "lucide-react";
import { completeOnboarding } from "@/actions/onboarding.actions";
import { submitManualPayment } from "@/actions/payment.actions";

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
  
  // Manual Verification State
  const [showManualForm, setShowManualForm] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [upiId, setUpiId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [offer, setOffer] = useState<any>(null);

  useEffect(() => {
    async function load() {
      import('@/actions/offer.actions').then(async (m) => {
        const res = await m.getOfferDetails(offerId);
        if (res.success && res.data) {
          setOffer(res.data);
          if (res.data.status === "Enrolled" || res.data.status === "Active") {
            setSuccess(true);
          }
        }
        setIsLoading(false);
      });
    }
    load();
  }, [offerId]);
  const handleNextStep = () => {
    if (!signature.trim() || signature.length < 3) {
      setError("Please provide a valid digital signature.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleVerifyPayment = async () => {
    if (!referenceNumber.trim()) {
      setError("Please enter your UPI UTR Number or Reference ID.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulated Verification Delay
    await new Promise((r) => setTimeout(r, 1500));
    
    // Intentionally show unsuccessful payment to trigger manual verification
    setIsSubmitting(false);
    setError("Unsuccessful payment or payment not instantly verifiable. Please submit a screenshot of your payment below to contact support.");
    setShowManualForm(true);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber || !emailId || !upiId || !screenshot) {
      setError("All fields are required for manual verification.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (!offer?.id) {
        throw new Error("Application session lost. Please refresh the page.");
      }
      
      const formData = new FormData();
      formData.append("applicationId", offer.id);
      formData.append("referenceNumber", referenceNumber);
      formData.append("emailId", emailId);
      formData.append("upiId", upiId);
      formData.append("screenshot", screenshot);

      const res = await submitManualPayment(formData);

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || "Failed to submit payment verification.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (success) {
    const isActuallyEnrolled = offer?.status === "Enrolled" || offer?.status === "Active";
    
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">
            {isActuallyEnrolled ? "Onboarding Complete! 🎉" : "Payment Under Review!"}
          </h1>
          
          <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            {isActuallyEnrolled 
              ? "Welcome to InterNexa! Your enrollment is fully confirmed. You can now download your Official Joining Letter and access your dashboard."
              : "Your payment screenshot has been successfully submitted. Our team will verify it shortly and you will receive an email with your Official Joining Letter."
            }
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isActuallyEnrolled && offer?.joiningLetterFileId && (
              <a 
                href={`/api/downloads/${offer.joiningLetterFileId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
              >
                <FileText className="w-5 h-5" /> Download Joining Letter
              </a>
            )}
            <button 
              onClick={() => router.push('/dashboard/internships')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium w-full sm:w-auto"
            >
              Go to Dashboard
            </button>
          </div>
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 font-serif italic text-lg outline-none"
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
                <p className="text-lg">To finalize your enrollment, a nominal fee of <strong className="text-white">₹{offer?.price || 199}</strong> is required.</p>
                <div className="space-y-3 mt-4">
                  <h4 className="font-bold text-indigo-400">What is included?</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Industry-recognized Professional Certificate</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Official Experience Letter upon completion</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Letter of Recommendation (Performance based)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instantly generated Official Joining Letter</li>
                  </ul>
                </div>
              </div>

              {!paymentClicked ? (
                <a
                  href={`upi://pay?pa=internexa@slc&pn=InterNexa&am=${offer?.price || 199}&cu=INR`}
                  onClick={() => {
                    setPaymentClicked(true);
                    setShowManualForm(true);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 mb-4 text-lg"
                >
                  <CreditCard className="w-6 h-6" /> Pay Now via UPI <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <div className="space-y-4">
                  {!showManualForm ? (
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                      <h3 className="font-bold text-white mb-2">Verify Your Payment</h3>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">UPI UTR Number / Reference ID</label>
                        <input
                          type="text"
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value)}
                          placeholder="e.g. 123456789012"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <button 
                        onClick={handleVerifyPayment} 
                        disabled={isSubmitting || !referenceNumber} 
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                        {isSubmitting ? "Verifying..." : "Verify Payment"}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleManualSubmit} className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg flex gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-indigo-200">
                          <p className="font-semibold text-indigo-300 mb-1">Manual Verification Required</p>
                          <p>Since your payment couldn't be instantly verified, please submit your payment details below. Our team will verify it and issue your joining letter shortly.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Payment Reference ID</label>
                          <input
                            type="text"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Your UPI ID (used for payment)</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. 9876543210@ybl"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Email ID (for communication)</label>
                        <input
                          type="email"
                          value={emailId}
                          onChange={(e) => setEmailId(e.target.value)}
                          placeholder="e.g. john@example.com"
                          required
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Payment Screenshot Proof</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                            required
                            className="hidden"
                            id="screenshot-upload"
                          />
                          <label htmlFor="screenshot-upload" className="w-full border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 transition-colors">
                            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                            {screenshot ? (
                              <span className="text-emerald-400 font-medium">{screenshot.name}</span>
                            ) : (
                              <span className="text-slate-400 text-sm">Click to upload payment screenshot (JPG/PNG)</span>
                            )}
                          </label>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting} 
                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all mt-4"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                        {isSubmitting ? "Submitting..." : "Submit Proof for Verification"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {error && (
            <div className="mt-6 text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
