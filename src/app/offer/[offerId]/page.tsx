"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Clock, Shield, Award, Users, Briefcase, Star,
  BookOpen, FileText, Zap, ArrowRight, Loader2, Download,
  BadgeCheck, GraduationCap, Rocket, Heart, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { getOfferDetails, acceptOffer, markPaymentComplete } from "@/actions/offer.actions";

type Step = "loading" | "offer" | "accepted" | "payment" | "success";

export default function OfferPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.offerId as string;

  const [step, setStep] = useState<Step>("loading");
  const [offer, setOffer] = useState<any>(null);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    async function load() {
      if (!offerId) return;
      const res = await getOfferDetails(offerId);
      if (res.success && res.data) {
        setOffer(res.data);
        if (res.data.status === "Enrolled" || res.data.status === "Active") {
          setStep("success");
        } else if (res.data.status === "Offer Accepted") {
          setStep("payment");
        } else if (res.data.status === "Accepted") {
          setStep("offer");
        } else {
          setStep("offer");
        }
      } else {
        setError("This offer link is invalid or has expired.");
        setStep("offer");
      }
    }
    load();
  }, [offerId]);

  const handleAccept = async () => {
    setAccepting(true);
    const res = await acceptOffer(offerId);
    if (res.success) {
      router.push(`/offer/${offerId}/onboarding`);
    } else {
      setError(res.error || "Failed to accept offer");
      setAccepting(false);
    }
  };

  const handlePaymentSubmit = async () => {
    setSubmittingPayment(true);
    setError("");
    
    // Simulated Verification Delay
    await new Promise((r) => setTimeout(r, 2000));
    const res = await markPaymentComplete(offerId, paymentRef);
    if (res.success) {
      setStep("success");
    } else {
      setError(res.error || "Failed to verify payment. Contact support.");
    }
    setSubmittingPayment(false);
  };

  const isExpired = offer?.offerExpiresAt && new Date(offer.offerExpiresAt) < new Date();

  const BENEFITS = [
    { icon: BookOpen, title: "Industry-Grade Curriculum", desc: "Curated by industry experts with hands-on projects" },
    { icon: Users, title: "1-on-1 Expert Mentorship", desc: "Personal mentor from top companies for guidance" },
    { icon: Award, title: "Verified Certificate", desc: "Industry-recognized certificate with QR verification" },
    { icon: FileText, title: "Letter of Recommendation", desc: "Performance-based LOR from your mentor" },
    { icon: Briefcase, title: "Career & Placement Support", desc: "Resume review, mock interviews & job referrals" },
    { icon: Zap, title: "Real-World Projects", desc: "Build portfolio-worthy projects for your resume" },
    { icon: GraduationCap, title: "Skill Assessment & Badge", desc: "Skill badges to showcase on LinkedIn" },
    { icon: Rocket, title: "Lifetime Community Access", desc: "Join 50,000+ learners & alumni network" },
  ];

  const TIMELINE = [
    { step: 1, title: "Accept Your Offer", desc: "Review and accept your internship offer letter", color: "#10b981", icon: CheckCircle2 },
    { step: 2, title: "Complete Onboarding", desc: "Complete payment & set up your learning dashboard", color: "#6366f1", icon: Shield },
    { step: 3, title: "Start Learning", desc: "Access curriculum, projects & connect with mentor", color: "#f59e0b", icon: BookOpen },
    { step: 4, title: "Submit Projects", desc: "Work on real-world projects with mentor guidance", color: "#ec4899", icon: Briefcase },
    { step: 5, title: "Earn Certificate", desc: "Receive verified certificate & letter of recommendation", color: "#8b5cf6", icon: Award },
  ];

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading your offer details...</p>
        </motion.div>
      </div>
    );
  }

  if (error && !offer) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Offer Not Found</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link href="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Go to Homepage
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-indigo-600/10 to-purple-600/20" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(99,102,241,0.15) 0%, transparent 50%)" }} />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Logo */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">InterNexa Labs</h2>
              <p className="text-slate-400 text-sm mt-1">Bridge the Gap Between Learning and Leading</p>
            </div>
            
            {step === "success" ? (
              <div className="mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-2xl sm:text-5xl font-extrabold mb-4 break-words">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-300">Enrollment Confirmed!</span>
                </h1>
                <p className="text-slate-300 text-lg max-w-xl mx-auto">Welcome aboard, {offer?.studentName}! Your learning journey begins now.</p>
              </div>
            ) : step === "payment" ? (
              <div className="mb-6">
                <div className="text-6xl mb-4">💳</div>
                <h1 className="text-2xl sm:text-5xl font-extrabold mb-4 break-words">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-300">Complete Your Enrollment</span>
                </h1>
                <p className="text-slate-300 text-lg max-w-xl mx-auto">One last step to unlock your internship, {offer?.studentName}!</p>
              </div>
            ) : (
              <div className="mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-2xl sm:text-5xl font-extrabold mb-4 break-words">
                  Congratulations, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-300">{offer?.studentName}!</span>
                </h1>
                <p className="text-slate-300 text-lg max-w-xl mx-auto">You have been officially selected for the <strong className="text-white">{offer?.internshipName}</strong> internship program.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 space-y-10">

        {/* Step Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 sm:gap-4">
          {["Offer", "Accept", "Payment", "Enrolled"].map((label, i) => {
            const currentIdx = step === "offer" ? 0 : step === "accepted" ? 1 : step === "payment" ? 2 : 3;
            const isCompleted = i <= currentIdx;
            return (
              <div key={label} className="flex items-center gap-2 sm:gap-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isCompleted ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-500 border border-slate-700"}`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-3.5 h-3.5 rounded-full border border-current inline-block" />}
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </div>
                {i < 3 && <div className={`w-6 sm:w-12 h-0.5 rounded ${isCompleted && i < currentIdx ? "bg-emerald-500" : "bg-slate-700"}`} />}
              </div>
            );
          })}
        </motion.div>

        {/* Offer Details Card */}
        {step === "offer" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 px-6 sm:px-8 py-5 border-b border-slate-700/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-emerald-400" />
                  Official Offer Details
                </h3>
              </div>
              <div className="px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Offer ID</p>
                  <p className="text-white font-mono font-bold text-sm">{offer?.offerLetterId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Application No</p>
                  <p className="text-white font-mono font-bold text-sm">{offer?.applicationId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Program</p>
                  <p className="text-indigo-400 font-bold">{offer?.internshipName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Duration</p>
                  <p className="text-white font-semibold">{offer?.duration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Student</p>
                  <p className="text-white font-semibold">{offer?.studentName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Offer Expires</p>
                  <p className={`font-semibold text-sm ${isExpired ? "text-red-400" : "text-amber-400"}`}>
                    {offer?.offerExpiresAt ? new Date(offer.offerExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "72 Hours from issue"}
                  </p>
                </div>
              </div>
              
              {/* Download Offer Letter */}
              {offer?.offerLetterFileId && (
                <div className="px-6 sm:px-8 pb-4">
                  <a href={`/api/downloads/${offer.offerLetterFileId}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    <Download className="w-4 h-4" /> Download Offer Letter PDF
                  </a>
                </div>
              )}

              {/* Accept Button */}
              <div className="px-6 sm:px-8 pb-8 pt-2">
                {isExpired ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                    <p className="text-red-400 font-semibold">⏰ This offer has expired</p>
                    <p className="text-red-400/70 text-sm mt-1">Please contact info.InterNexa Labs@gmail.com for assistance.</p>
                  </div>
                ) : (
                  <button onClick={handleAccept} disabled={accepting}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 disabled:opacity-50">
                    {accepting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    {accepting ? "Accepting..." : "Accept This Offer"}
                  </button>
                )}
                {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Step */}
        {(step === "success" || step === "accepted" || step === "payment") && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 rounded-2xl border border-emerald-500/30 p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3">You're All Set! 🚀</h2>
              <p className="text-slate-300 text-lg max-w-md mx-auto mb-8">Your enrollment for <strong className="text-indigo-400">{offer?.internshipName}</strong> is confirmed. Head to your dashboard to start learning.</p>
              <Link href={`/offer/${offerId}/onboarding`}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/25">
                <Rocket className="w-5 h-5" /> Start Onboarding <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Benefits Section (always visible) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-2xl font-extrabold text-white mb-6 text-center">
            🎁 What You'll Get with <span className="text-indigo-400">{offer?.internshipName}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/30 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                    <b.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">{b.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="text-2xl font-extrabold text-white mb-6 text-center">📍 Your Journey Ahead</h3>
          <div className="relative">
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-slate-800" />
            <div className="space-y-6">
              {TIMELINE.map((t, i) => {
                const Icon = t.icon;
                return (
                  <motion.div key={t.step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-5 relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0 relative z-10"
                      style={{ backgroundColor: `${t.color}15`, border: `2px solid ${t.color}40` }}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: t.color }} />
                    </div>
                    <div className="pt-1">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: t.color }}>Step {t.step}</span>
                      <h4 className="text-white font-bold text-base mt-1">{t.title}</h4>
                      <p className="text-slate-400 text-sm mt-0.5">{t.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Trust & Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-center pt-8 border-t border-slate-800">
          <div className="flex items-center justify-center gap-6 mb-6 text-slate-500">
            <div className="flex items-center gap-2 text-xs"><Shield className="w-4 h-4" /> Secure & Verified</div>
            <div className="flex items-center gap-2 text-xs"><Star className="w-4 h-4" /> 50,000+ Students</div>
            <div className="flex items-center gap-2 text-xs"><Heart className="w-4 h-4" /> 4.9/5 Rating</div>
          </div>
          <h2 className="text-2xl font-extrabold text-indigo-400 mb-1">InterNexa Labs</h2>
          <p className="text-slate-500 text-sm mb-2">Bridge the Gap Between Learning and Leading</p>
          <p className="text-slate-600 text-xs">Need help? <a href="mailto:info.InterNexa Labs@gmail.com" className="text-indigo-400 hover:underline">info.InterNexa Labs@gmail.com</a></p>
          <p className="text-slate-700 text-xs mt-4">© {new Date().getFullYear()} InterNexa Labs. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}
