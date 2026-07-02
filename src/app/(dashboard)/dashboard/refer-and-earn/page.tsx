"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getReferralStats, submitRewardClaim } from "@/actions/referral.actions";
import { getOrCreateUserProfile } from "@/actions/user.actions";
import { Gift, Share2, Copy, Users, CheckCircle, Clock, Award, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ReferAndEarnPage() {
  const [stats, setStats] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const [statsRes, userRes] = await Promise.all([
      getReferralStats(),
      getOrCreateUserProfile()
    ]);
    if (statsRes.success) setStats(statsRes.data);
    if (userRes.success) setUserProfile(userRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId) return;
    setSubmitting(true);
    setError("");
    const res = await submitRewardClaim(upiId);
    if (res.success) {
      setShowClaimModal(false);
      fetchData(); // Refresh stats to show pending claim
    } else {
      setError(res.error || "Failed to submit claim");
    }
    setSubmitting(false);
  };

  const referralLink = userProfile?.referral_code 
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://internexalabs.online'}/invite/${userProfile.referral_code}`
    : '';

  const messageText = `🚀 *Boost Your Career with InterNexa Labs!* 🎓\n\nI just found this amazing AI-powered internship platform. You get:\n✅ 35+ Premium Virtual Internships\n✅ Real-world Capstone Projects\n✅ ISO-Verified Certificates & LORs\n✅ 1-on-1 Expert Mentorship\n\nSign up using my exclusive invite link and let's learn together! 👇\n${referralLink}`;

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && referralLink) {
      try {
        await navigator.share({
          title: '🚀 Launch Your Career with InterNexa!',
          text: messageText,
        });
      } catch (error: any) {
        if (error.name !== 'AbortError') handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const existingClaimsCount = stats?.claims?.length || 0;
  const allowedClaims = Math.floor((stats?.successful || 0) / 5);
  const canClaim = allowedClaims > existingClaimsCount;
  
  // Progress calculation for the next claim
  const progressTowardsNextClaim = (stats?.successful || 0) % 5;
  const progressPercent = canClaim ? 100 : (progressTowardsNextClaim / 5) * 100;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold font-heading mb-2">Refer Friends, Earn ₹100</h1>
            <p className="text-indigo-100 text-lg mb-6">
              Invite your friends to InterNexa Labs. For every 5 friends who successfully enroll in an internship, you earn ₹100 directly to your UPI!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center bg-white/10 rounded-xl p-2 border border-white/20 backdrop-blur-md">
                <input 
                  type="text" 
                  value={referralLink} 
                  readOnly 
                  className="bg-transparent border-none text-white w-full outline-none px-2 font-mono text-sm"
                />
                <button onClick={handleCopy} className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Copy to clipboard">
                  {copied ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <button 
                onClick={handleNativeShare} 
                className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl shadow-sm transition-colors whitespace-nowrap"
              >
                <Share2 className="w-4 h-4" /> Share Now
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center w-32 h-32 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Gift className="w-16 h-16 text-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Referrals</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.total || 0}</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Successful Enrollments</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.successful || 0}</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pending Signups</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.pending || 0}</p>
          </div>
        </motion.div>
      </div>

      {/* Reward Progress Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Reward Progress</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Get 5 successful enrollments to claim ₹100</p>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-500" />
            <span className="font-bold text-slate-900 dark:text-white text-lg">{progressTowardsNextClaim} / 5</span>
          </div>
        </div>

        <div className="relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progressPercent}%` }} 
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
          />
        </div>

        <div className="flex justify-center">
          <button 
            disabled={!canClaim}
            onClick={() => setShowClaimModal(true)}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              canClaim 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {canClaim ? 'Claim ₹100 Reward' : 'Keep Referring to Unlock'}
          </button>
        </div>
      </motion.div>

      {/* Referrals History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Referral History</h2>
        </div>
        <div className="overflow-x-auto">
          {stats?.referrals?.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
                  <th className="p-4 font-medium">Friend</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {stats.referrals.map((ref: any) => (
                  <tr key={ref.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold uppercase overflow-hidden">
                          {ref.referred?.avatar ? (
                            <img src={ref.referred.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            ref.referred?.name?.charAt(0) || "U"
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{ref.referred?.name || "Unknown User"}</p>
                          <p className="text-xs text-slate-500">{ref.referred?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {ref.status === "Successful" ? (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Successful
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Payment
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {formatDistanceToNow(new Date(ref.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p>You haven't referred anyone yet.</p>
              <p className="text-sm mt-1">Share your link to get started!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Claim ₹100 Reward</h3>
            </div>
            <form onSubmit={handleClaim} className="p-6">
              {error && (
                <div className="p-4 mb-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-500/20">
                  {error}
                </div>
              )}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Enter your UPI ID
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g., name@okicici"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Please ensure your UPI ID is correct. The amount will be transferred manually by admin within 24 hours.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !upiId}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Claim
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
