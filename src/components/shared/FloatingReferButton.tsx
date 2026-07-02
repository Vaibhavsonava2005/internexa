"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Share2, Copy, CheckCircle, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { getOrCreateUserProfile } from "@/actions/user.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function FloatingReferButton() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch referral code when opening the modal for the first time
  useEffect(() => {
    if (isOpen && isSignedIn && !referralCode) {
      setLoading(true);
      getOrCreateUserProfile().then((res) => {
        if (res.success && res.data?.referral_code) {
          setReferralCode(res.data.referral_code);
        }
        setLoading(false);
      });
    }
  }, [isOpen, isSignedIn, referralCode]);

  const referralLink = referralCode 
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://internexa.com'}/sign-up?ref=${referralCode}`
    : '';

  const handleShare = async () => {
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    if (navigator.share && referralLink) {
      try {
        await navigator.share({
          title: '🚀 Launch Your Career with InterNexa!',
          text: 'Join 50,000+ students on InterNexa and get a premium AI-powered internship!\n\n✨ Benefits include:\n💸 Up to ₹15,000 Stipend\n📜 Guaranteed Letter of Recommendation (LoR)\n🎓 Industry-Recognized Certificate\n\nUse my link to sign up for free:',
          url: referralLink,
        });
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isLoaded || !isSignedIn) return null;

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl hover:shadow-indigo-500/50 transition-shadow lg:bottom-10 lg:right-10"
      >
        <Gift className="w-6 h-6 animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="relative p-6 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Refer & Earn ₹100</h3>
                <p className="text-indigo-100">
                  Invite 5 friends to enroll in any premium internship and get ₹100 instantly!
                </p>
              </div>

              <div className="p-6">
                {!isSignedIn ? (
                  <div className="text-center space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                      Sign in to get your unique referral link and start earning rewards.
                    </p>
                    <button
                      onClick={() => router.push("/sign-in")}
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                    >
                      Sign In to Refer
                    </button>
                  </div>
                ) : loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Your Unique Referral Link
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-mono text-sm truncate border border-slate-200 dark:border-slate-700">
                          {referralLink}
                        </div>
                        <button
                          onClick={handleCopy}
                          className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700"
                        >
                          {copied ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleShare}
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-emerald-300" />
                          Link Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-5 h-5" />
                          Share Link Now
                        </>
                      )}
                    </button>
                    
                    <div className="text-center">
                      <Link href="/dashboard/refer-and-earn" onClick={() => setIsOpen(false)} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                        View my referrals dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
