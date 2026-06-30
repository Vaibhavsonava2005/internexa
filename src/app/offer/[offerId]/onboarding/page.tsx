"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileSignature, UploadCloud, Shield, CheckCircle2, Loader2, FileText, ChevronRight, CreditCard, ExternalLink, AlertTriangle } from "lucide-react";
import { completeOnboarding } from "@/actions/onboarding.actions";
import { submitManualPayment } from "@/actions/payment.actions";
import { getAppSettings } from "@/actions/admin.actions";

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
  const [paymentLink, setPaymentLink] = useState("upi://pay?pa=InterNexa Labs@slc&pn=InterNexa Labs%20labs&am=199&tn=");
  const [qrUrl, setQrUrl] = useState("/qr-199.png");

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
        
        let link = "https://payments.cashfree.com/links?code=uakicu68k120_AAAAAAAUM2Y";
        if (res.data?.email) {
          link += `&customer_email=${encodeURIComponent(res.data.email)}`;
        }
        setPaymentLink(link);
        setQrUrl("/qr-99.png");
        
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
    if (!referenceNumber || !emailId || !upiId) {
      setError("Reference Number, Email, and UPI ID are required.");
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
      if (screenshot) {
        formData.append("screenshot", screenshot);
      }

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
              ? "Welcome to InterNexa Labs! Your enrollment is fully confirmed. You can now download your Official Joining Letter and access your dashboard."
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
          <p className="text-slate-400 mt-2">Complete these final steps to officially join InterNexa Labs.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          
          {step === 1 ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">1</div>
                <h2 className="text-xl font-bold text-white">Non-Disclosure Agreement (NDA)</h2>
              </div>
              
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-6 text-sm text-slate-400 space-y-4">
                <p>By typing your name below, you digitally sign and agree to the InterNexa Labs terms and conditions.</p>
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
                <p className="text-lg">To finalize your enrollment, the professional services fee is required.</p>
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

              <div className="flex flex-col gap-4 mb-4">
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 text-lg"
                >
                  <CreditCard className="w-6 h-6" /> Pay Now <ExternalLink className="w-4 h-4" />
                </a>
                
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <Shield className="w-5 h-5" /> I have completed the payment (Refresh Status)
                </button>
              </div>
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
