"use client";

import { motion } from "framer-motion";
import { Download, Share2, ShieldCheck, Award, Zap, FileText, CheckCircle2 } from "lucide-react";
import { PageHeader, Badge, Button } from "@/components/shared";

import { useEffect, useState } from "react";
import { getUserApplications } from "@/actions/application.actions";
import { submitFastTrackPayment } from "@/actions/payment.actions";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [activeApps, setActiveApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    referenceNumber: "",
    emailId: "",
    upiId: "",
    screenshot: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCerts() {
      try {
        const res = await getUserApplications();
        if (res.success && res.data) {
          const completed = res.data.filter(app => app.status === "Completed");
          const active = res.data.filter(app => app.status === "Active");
          setCertificates(completed);
          setActiveApps(active);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCerts();
  }, []);

  const handleFastTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("applicationId", selectedApp.id);
      formData.append("referenceNumber", paymentForm.referenceNumber);
      formData.append("emailId", paymentForm.emailId);
      formData.append("upiId", paymentForm.upiId);
      if (paymentForm.screenshot) {
        formData.append("screenshot", paymentForm.screenshot);
      }

      const res = await submitFastTrackPayment(formData);
      if (res.success) {
        setSubmitSuccess(true);
      } else {
        setErrorMsg(res.error || "Failed to submit fast-track request");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="My Certificates" 
        description="View, download, and share your verified certificates."
      />

      {/* FAST-TRACK SECTION */}
      {!isLoading && activeApps.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-3xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Fast-Track Your Certificate</h3>
                <p className="text-indigo-200 text-sm max-w-xl">
                  Don't want to wait for the internship timeline to finish? You can instantly generate your Official Certificate, Letter of Recommendation, and Experience Letter right now for just ₹99.
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex flex-col gap-3">
              {activeApps.map(app => (
                <Button 
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app);
                    setIsModalOpen(true);
                    setSubmitSuccess(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white border-none w-full shadow-lg shadow-indigo-900/20"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Fast-Track {app.internships?.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>
      ) : certificates.length === 0 ? (
        <div className="text-center p-12 bg-slate-900 rounded-3xl border border-slate-800">
          <Award className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No Certificates Yet</h3>
          <p className="text-slate-400">Complete an internship to earn your verified certificate.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white dark:bg-slate-900 rounded-3xl p-1 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
          >
            {/* Certificate Preview Card */}
            <div className="relative h-48 rounded-[22px] overflow-hidden bg-slate-950 mb-4 p-6 flex flex-col items-center justify-center text-center border-4 border-slate-100 dark:border-slate-800">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-slate-900/90" />
              
              <Award className="w-10 h-10 text-amber-400 mb-2 relative z-10" />
              <h4 className="text-white font-bold font-heading leading-tight relative z-10">
                {cert.internships?.title || "InterNexa Program"}
              </h4>
              <p className="text-indigo-200 text-xs mt-2 relative z-10">
                Issued to {cert.full_name || "Student"}
              </p>
            </div>

            <div className="px-5 pb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-500 font-mono">
                  {cert.application_id?.replace("APP-", "CERT-") || cert.id.substring(0,8).toUpperCase()}
                </span>
                <Badge variant="success" className="bg-emerald-100 text-emerald-700">
                  Grade: A+
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a 
                  href={cert.application_id ? `/api/downloads/${cert.id}` : "#"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </a>
                <button className="flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      {/* Fast-Track Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Fast-Track Verification</h2>
              <p className="text-slate-400 text-sm">
                Pay a nominal fee of ₹99 to instantly generate your Certificate, Experience Letter, and LOR for <strong>{selectedApp?.internships?.title}</strong>.
              </p>
            </div>

            {submitSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-400 mb-2">Request Submitted!</h3>
                <p className="text-emerald-200 text-sm">
                  Your payment is under review. Once verified by the admin, your documents will be instantly emailed to you and available in this dashboard.
                </p>
                <Button 
                  onClick={() => setIsModalOpen(false)}
                  className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                >
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleFastTrackSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                    {errorMsg}
                  </div>
                )}
                
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center mb-6">
                  <p className="text-sm text-slate-400 mb-2">Pay securely using UPI</p>
                  <p className="text-xl font-bold text-indigo-400 font-mono tracking-wider">internexa@ybl</p>
                  <p className="text-xs text-slate-500 mt-2">Amount: ₹99</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Your Registered Email</label>
                  <input 
                    required 
                    type="email"
                    placeholder="Enter email used for payment"
                    value={paymentForm.emailId}
                    onChange={e => setPaymentForm({...paymentForm, emailId: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Your UPI ID (used for payment)</label>
                  <input 
                    required 
                    placeholder="e.g. 9876543210@ybl"
                    value={paymentForm.upiId}
                    onChange={e => setPaymentForm({...paymentForm, upiId: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">UTR / Transaction ID</label>
                  <input 
                    required 
                    placeholder="12-digit UTR number"
                    value={paymentForm.referenceNumber}
                    onChange={e => setPaymentForm({...paymentForm, referenceNumber: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Payment Screenshot (Optional)</label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={e => setPaymentForm({...paymentForm, screenshot: e.target.files?.[0] || null})}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white border-none"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Payment"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
