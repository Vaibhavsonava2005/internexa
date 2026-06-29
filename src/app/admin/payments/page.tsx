"use client";

import { useEffect, useState } from "react";
import { getAdminData, approveManualPayment, rejectManualPayment } from "@/actions/admin.actions";
import { Loader2, CheckCircle, XCircle, Search, FileImage, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/shared";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const res = await getAdminData();
    if (res.success && res.data) {
      setPayments(res.data.manualPayments || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm("Are you sure you want to approve this payment? This will email the official joining letter to the student.")) return;
    
    setProcessingId(id);
    setError("");
    const res = await approveManualPayment(id);
    if (res.success) {
      fetchData();
    } else {
      setError(res.error || "Failed to approve payment");
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Are you sure you want to reject this payment? This will email the student to pay again.")) return;
    
    setProcessingId(id);
    setError("");
    const res = await rejectManualPayment(id);
    if (res.success) {
      fetchData();
    } else {
      setError(res.error || "Failed to reject payment");
    }
    setProcessingId(null);
  };

  const filteredPayments = payments.filter(p => 
    (p.reference_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.email_id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.applications?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manual Payment Verifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review and approve student payment screenshots</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Student / Internship</th>
                <th className="px-6 py-4 font-medium">Payment Details</th>
                <th className="px-6 py-4 font-medium">Screenshot</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No manual payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={payment.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{payment.applications?.full_name}</div>
                      <div className="text-slate-500 text-xs mt-1">{payment.applications?.internships?.title}</div>
                      <div className="text-slate-500 text-xs">{payment.email_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-700 dark:text-slate-300 mb-1">
                        Ref: {payment.reference_number}
                      </div>
                      <div className="text-xs text-slate-500">
                        UPI: {payment.upi_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${payment.screenshot_file_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors text-xs font-medium"
                      >
                        <FileImage className="w-3.5 h-3.5" /> View Proof <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        payment.status === 'Approved' ? 'success' : 
                        payment.status === 'Rejected' ? 'destructive' : 'secondary'
                      }>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(payment.id)}
                            disabled={processingId === payment.id}
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Approve & Send Joining Letter"
                          >
                            {processingId === payment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleReject(payment.id)}
                            disabled={processingId === payment.id}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Reject & Request Repayment"
                          >
                            {processingId === payment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
