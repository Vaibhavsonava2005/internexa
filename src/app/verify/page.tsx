"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, FileText, BadgeCheck, XCircle, Loader2 } from "lucide-react";

export default function VerificationPortal() {
  const [docId, setDocId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [docType, setDocType] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId.trim()) return;

    setStatus("loading");
    
    // Simulate API call for document verification
    setTimeout(() => {
      const upperId = docId.toUpperCase().trim();
      
      if (upperId.startsWith("OFF-")) {
        setDocType("Offer Letter");
        setStatus("valid");
      } else if (upperId.startsWith("JOIN-")) {
        setDocType("Joining Letter");
        setStatus("valid");
      } else if (upperId.startsWith("CERT-")) {
        setDocType("Completion Certificate");
        setStatus("valid");
      } else if (upperId.startsWith("NDA-")) {
        setDocType("Non-Disclosure Agreement");
        setStatus("valid");
      } else {
        setStatus("invalid");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-emerald-500/10 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 mb-2">
            Document Verification
          </h1>
          <p className="text-slate-400">
            Enter a Document ID (e.g., CERT-2026-000001) to verify its authenticity on the InterNexa blockchain network.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Document Reference ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={docId}
                  onChange={(e) => setDocId(e.target.value)}
                  placeholder="e.g. CERT-2026-123456"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 uppercase font-mono tracking-wider"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={status === "loading" || !docId.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying on Network...
                </>
              ) : (
                "Verify Authenticity"
              )}
            </button>
          </form>

          {/* Results Area */}
          {status === "valid" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <BadgeCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-emerald-400 font-bold">Authentic Document Verified</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    The reference ID <strong className="font-mono text-white">{docId.toUpperCase()}</strong> is a valid and authentic <strong className="text-white">{docType}</strong> issued by InterNexa.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {status === "invalid" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-bold">Verification Failed</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    No authentic document was found matching the ID <strong className="font-mono text-white">{docId.toUpperCase()}</strong>.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
