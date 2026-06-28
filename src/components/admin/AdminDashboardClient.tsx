"use client";

import { useState, useEffect } from "react";
import { approveApplication, rejectApplication, getAdminData, approveRewardClaim, approveManualPayment, rejectManualPayment } from "@/actions/admin.actions";
import { generateCertificateAction } from "@/actions/certificate.actions";
import { Button, Badge } from "@/components/shared";
import { Users, FileText, CreditCard, CheckCircle, XCircle, Clock, FolderGit2, Shield, Gift, Award, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function AdminDashboardClient({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState<"applications" | "users" | "transactions" | "submissions" | "manualPayments" | "rewardClaims" | "certificates">("applications");
  const [data, setData] = useState(initialData);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await getAdminData();
      if (res.success && res.data) {
        setData(res.data);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    setLoadingAction(id);
    const res = await approveApplication(id);
    if (res.success) {
      setData((prev: any) => ({
        ...prev,
        applications: prev.applications.map((app: any) => 
          app.id === id ? { ...app, status: "Accepted" } : app
        )
      }));
    } else {
      alert(res.error || "Failed to approve");
    }
    setLoadingAction(null);
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this application?")) return;
    setLoadingAction(id);
    const res = await rejectApplication(id);
    if (res.success) {
      setData((prev: any) => ({
        ...prev,
        applications: prev.applications.map((app: any) => 
          app.id === id ? { ...app, status: "Rejected" } : app
        )
      }));
    } else {
      alert(res.error || "Failed to reject");
    }
    setLoadingAction(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-brand-500">Manage all platform data and applications.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-brand-100 dark:bg-brand-900/50 p-1 rounded-xl mb-8 w-max flex-wrap">
        {[
          { id: "applications", label: "Applications", icon: FileText },
          { id: "submissions", label: "Projects", icon: FolderGit2 },
          { id: "users", label: "Users", icon: Users },
          { id: "transactions", label: "Auto Payments", icon: CreditCard },
          { id: "manualPayments", label: "Manual Verifications", icon: Shield },
          { id: "certificates", label: "Certificates", icon: Award },
          { id: "rewardClaims", label: "Reward Claims", icon: Gift },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? "bg-white dark:bg-brand-800 text-brand-900 dark:text-white shadow-sm" 
                  : "text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-brand-800/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <Badge variant={isActive ? "default" : "secondary"} className="ml-2 rounded-full px-2 py-0.5 text-xs">
              {tab.id === "certificates" ? data.applications.filter((a: any) => a.status === "Enrolled" || a.status === "Active" || a.status === "Completed").length : (data[tab.id]?.length || 0)}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-brand-950 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm overflow-hidden">
        
        {/* Applications */}
        {activeTab === "applications" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Application ID</th>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Program</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800">
                {data.applications.map((app: any) => (
                  <tr key={app.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{app.application_id || app.reference_number}</td>
                    <td className="px-6 py-4 font-medium text-brand-900 dark:text-white">{app.full_name}</td>
                    <td className="px-6 py-4">{app.internships?.title || "Unknown"}</td>
                    <td className="px-6 py-4">
                      <Badge variant={app.status === "Accepted" || app.status === "Approved" ? "success" : app.status === "Rejected" ? "destructive" : "default"}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.status === "Submitted" && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleApprove(app.id)}
                            disabled={loadingAction === app.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            {loadingAction === app.id ? "Processing..." : "Approve"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReject(app.id)}
                            disabled={loadingAction === app.id}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-900 dark:hover:bg-red-900/30"
                          >
                            <XCircle className="w-4 h-4 mr-1.5" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {app.status !== "Submitted" && (
                        <span className="text-brand-400 text-xs flex justify-end items-center gap-1">
                          <Clock className="w-3 h-3" /> Processed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {data.applications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-brand-500">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Clerk ID</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Full Name</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Successful Referrals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800">
                {data.users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{u.clerk_id?.substring(0, 16) || "N/A"}...</td>
                    <td className="px-6 py-4 font-medium text-brand-900 dark:text-white">{u.email}</td>
                    <td className="px-6 py-4">{u.full_name}</td>
                    <td className="px-6 py-4"><Badge variant="secondary">{u.role}</Badge></td>
                    <td className="px-6 py-4">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}</td>
                    <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">{u.successful_referrals || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments */}
        {activeTab === "transactions" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800">
                {data.transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{tx.razorpay_payment_id || tx.id}</td>
                    <td className="px-6 py-4 font-medium text-brand-900 dark:text-white">{formatCurrency(tx.amount, tx.currency)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={tx.status === "Success" || tx.status === "Completed" ? "success" : "default"}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">{tx.created_at ? new Date(tx.created_at).toLocaleDateString() : "N/A"}</td>
                  </tr>
                ))}
                {data.transactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-brand-500">
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

        {/* Submissions */}
        {activeTab === "submissions" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Domain & Project</th>
                  <th className="px-6 py-4 font-medium">Links</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800">
                {(data.submissions || []).map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-900 dark:text-white">{sub.student_name}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-900 dark:text-white">{sub.project_title}</div>
                      <div className="text-xs text-brand-500 mt-1">{sub.domain}</div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      {sub.github_link && (
                        <a href={sub.github_link} target="_blank" rel="noopener noreferrer" className="block text-indigo-500 hover:underline text-xs">
                          GitHub
                        </a>
                      )}
                      {sub.deployment_link && (
                        <a href={sub.deployment_link} target="_blank" rel="noopener noreferrer" className="block text-emerald-500 hover:underline text-xs">
                          Live Demo
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">{sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : "N/A"}</td>
                  </tr>
                ))}
                {(!data.submissions || data.submissions.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-brand-500">
                      No projects submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Manual Payments */}
        {activeTab === "manualPayments" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Applicant</th>
                  <th className="px-6 py-4 font-medium">Internship</th>
                  <th className="px-6 py-4 font-medium">UTR / UPI ID</th>
                  <th className="px-6 py-4 font-medium">Proof</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800">
                {(data.manualPayments || []).map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-900 dark:text-white">{payment.applications?.full_name || "Unknown"}</div>
                      <div className="text-xs text-brand-500">{payment.email_id}</div>
                    </td>
                    <td className="px-6 py-4 text-brand-900 dark:text-white">{payment.applications?.internships?.title || "Unknown"}</td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs">{payment.reference_number}</div>
                      <div className="text-xs text-brand-500 mt-1">{payment.upi_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      {payment.screenshot_file_id ? (
                        <a 
                          href={`/api/downloads/${payment.screenshot_file_id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-500 hover:underline text-xs flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" /> View Proof
                        </a>
                      ) : (
                        <span className="text-brand-400 text-xs italic">Not Provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={payment.status === "Approved" ? "success" : payment.status === "Rejected" ? "destructive" : "warning"}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {payment.status === "Pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              if (!confirm("Are you sure you want to reject this payment?")) return;
                              setLoadingAction(`rej_${payment.id}`);
                              const res = await rejectManualPayment(payment.id);
                              if (res.success) {
                                setData((prev: any) => ({
                                  ...prev,
                                  manualPayments: prev.manualPayments.map((p: any) => 
                                    p.id === payment.id ? { ...p, status: "Rejected" } : p
                                  )
                                }));
                              } else {
                                alert(res.error || "Failed to reject payment");
                              }
                              setLoadingAction(null);
                            }}
                            disabled={loadingAction === `rej_${payment.id}` || loadingAction === `app_${payment.id}`}
                          >
                            {loadingAction === `rej_${payment.id}` ? "..." : "Reject"}
                          </Button>
                          <Button 
                            size="sm"
                            onClick={async () => {
                              if (!confirm("Are you sure you want to approve this payment and issue the Joining Letter?")) return;
                              setLoadingAction(`app_${payment.id}`);
                              const res = await approveManualPayment(payment.id);
                              if (res.success) {
                                setData((prev: any) => ({
                                  ...prev,
                                  manualPayments: prev.manualPayments.map((p: any) => 
                                    p.id === payment.id ? { ...p, status: "Approved" } : p
                                  )
                                }));
                              } else {
                                alert(res.error || "Failed to approve payment");
                              }
                              setLoadingAction(null);
                            }}
                            disabled={loadingAction === `rej_${payment.id}` || loadingAction === `app_${payment.id}`}
                          >
                            {loadingAction === `app_${payment.id}` ? "Approving..." : "Approve"}
                          </Button>
                        </div>
                      ) : (
                        <span className={payment.status === "Approved" ? "text-emerald-500 text-xs flex justify-end items-center gap-1" : "text-red-500 text-xs flex justify-end items-center gap-1"}>
                          {payment.status === "Approved" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} {payment.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!data.manualPayments || data.manualPayments.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-brand-500">
                      No manual payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Reward Claims */}
        {activeTab === "rewardClaims" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">UPI ID</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800">
                {(data.rewardClaims || []).map((claim: any) => (
                  <tr key={claim.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors">
                    <td className="px-6 py-4">{new Date(claim.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-900 dark:text-white">{claim.users?.name || "Unknown"}</div>
                      <div className="text-xs text-brand-500">{claim.users?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{claim.upi_id}</td>
                    <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">₹{claim.amount}</td>
                    <td className="px-6 py-4">
                      <Badge variant={claim.status === "Approved" ? "success" : "warning"}>
                        {claim.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {claim.status === "Pending" ? (
                        <Button 
                          size="sm"
                          onClick={async () => {
                            if (!confirm("Are you sure you have manually sent ₹100 to this UPI ID?")) return;
                            setLoadingAction(claim.id);
                            const res = await approveRewardClaim(claim.id);
                            if (res.success) {
                              setData((prev: any) => ({
                                ...prev,
                                rewardClaims: prev.rewardClaims.map((c: any) => 
                                  c.id === claim.id ? { ...c, status: "Approved" } : c
                                )
                              }));
                            } else {
                              alert(res.error || "Failed to approve");
                            }
                            setLoadingAction(null);
                          }}
                          disabled={loadingAction === claim.id}
                        >
                          {loadingAction === claim.id ? "Approving..." : "Mark as Paid"}
                        </Button>
                      ) : (
                        <span className="text-emerald-500 text-xs flex justify-end items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!data.rewardClaims || data.rewardClaims.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-brand-500">
                      No reward claims found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certificates" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Program</th>
                  <th className="px-6 py-4 font-medium">Certificate ID</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800">
                {data.applications.filter((a: any) => a.status === "Enrolled" || a.status === "Active" || a.status === "Completed").map((app: any) => (
                  <tr key={app.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-900 dark:text-white">{app.full_name}</td>
                    <td className="px-6 py-4">{app.internships?.title || "Unknown"}</td>
                    <td className="px-6 py-4 font-mono text-xs">{app.certificate_id || "-"}</td>
                    <td className="px-6 py-4">
                      {app.status === "Completed" ? (
                        <Badge variant="success" className="bg-emerald-500 text-white border-0">Generated</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 border-0">Pending</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.status === "Completed" && app.certificate_file_id ? (
                        <a 
                          href={`${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"}/storage/v1/object/public/documents/${app.certificate_file_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-brand-100 text-brand-700 hover:bg-brand-200 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          View
                        </a>
                      ) : (
                        <Button
                          size="sm"
                          onClick={async () => {
                            if (!confirm("Generate completion certificate, experience letter, and LOR for this student?")) return;
                            setLoadingAction(`cert_${app.id}`);
                            const res = await generateCertificateAction(app.id);
                            if (res.success) {
                              setData((prev: any) => ({
                                ...prev,
                                applications: prev.applications.map((a: any) => 
                                  a.id === app.id ? { ...a, status: "Completed", certificate_id: res.certificateId, certificate_file_id: res.fileId } : a
                                )
                              }));
                            } else {
                              alert(res.error || "Failed to generate certificates");
                            }
                            setLoadingAction(null);
                          }}
                          disabled={loadingAction === `cert_${app.id}`}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          {loadingAction === `cert_${app.id}` ? "Generating..." : "Generate Certificates"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  );
}
