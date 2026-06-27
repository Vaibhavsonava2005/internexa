"use client";

import { useState, useEffect } from "react";
import { approveApplication, rejectApplication, getAdminData } from "@/actions/admin.actions";
import { Button, Badge } from "@/components/shared";
import { Users, FileText, CreditCard, CheckCircle, XCircle, Clock, FolderGit2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function AdminDashboardClient({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState<"applications" | "users" | "transactions" | "submissions">("applications");
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
      <div className="flex space-x-1 bg-brand-100 dark:bg-brand-900/50 p-1 rounded-xl mb-8 w-max">
        {[
          { id: "applications", label: "Applications", icon: FileText },
          { id: "submissions", label: "Projects", icon: FolderGit2 },
          { id: "users", label: "Users", icon: Users },
          { id: "transactions", label: "Payments", icon: CreditCard },
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
                {data[tab.id].length}
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
    </div>
  );
}
