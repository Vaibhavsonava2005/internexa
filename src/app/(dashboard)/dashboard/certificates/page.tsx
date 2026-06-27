"use client";

import { motion } from "framer-motion";
import { Download, Share2, ShieldCheck, Award } from "lucide-react";
import { PageHeader, Badge } from "@/components/shared";

import { useEffect, useState } from "react";
import { getUserApplications } from "@/actions/application.actions";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCerts() {
      try {
        const res = await getUserApplications();
        if (res.success && res.data) {
          const completed = res.data.filter(app => app.status === "Completed" && app.certificate_id);
          setCertificates(completed);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCerts();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="My Certificates" 
        description="View, download, and share your verified certificates."
      />

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
                  {cert.certificate_id}
                </span>
                <Badge variant="success" className="bg-emerald-100 text-emerald-700">
                  Grade: A+
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button className="flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  PDF
                </button>
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
    </div>
  );
}
