"use client";

import { useState, useEffect } from "react";
import { approveApplication, rejectApplication, getAdminData, approveRewardClaim, approveManualPayment, rejectManualPayment, approveFastTrackPayment, rejectFastTrackPayment, updateAppSettings, getAppSettings, sendGlobalNotification, sendUserNotification, deleteUserCompletely, uploadQRImage, sendUserManualEmail } from "@/actions/admin.actions";
import { generateCertificateAction } from "@/actions/certificate.actions";
import { Button, Badge } from "@/components/shared";
import { Users, FileText, CreditCard, CheckCircle, XCircle, Clock, FolderGit2, Shield, Gift, Award, Download, RefreshCw, Bell, Settings, Send, Eye, MessageSquare, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function AdminDashboardClient({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState<"applications" | "users" | "transactions" | "submissions" | "manualPayments" | "rewardClaims" | "certificates" | "settings" | "notifications">("applications");
  const [data, setData] = useState(initialData);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  const [appDetailsModal, setAppDetailsModal] = useState<any>(null);
  const [settingsForm, setSettingsForm] = useState({ payment_199_upi: '', payment_199_qr: '', payment_99_upi: '', payment_99_qr: '' });
  const [notifForm, setNotifForm] = useState({ title: '', message: '', type: 'info' as any, link: '' });
  const [selectedUserForNotif, setSelectedUserForNotif] = useState<any>(null);

  const [selectedUserForEmail, setSelectedUserForEmail] = useState<any>(null);
  const [emailForm, setEmailForm] = useState({ subject: '', body: '', templateType: 'custom' });

  const handleEmailTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'instant_certification') {
      setEmailForm({
        templateType: val,
        subject: `Your InterNexa Instant Certification is Ready!`,
        body: `Congratulations on completing your program track!\n\nWe are thrilled to inform you that your instant certification has been automatically generated and is now available in your dashboard.\n\nYou can view and download your official certificate right now by clicking the button below. Keep pushing boundaries and learning!`
      });
    } else if (val === 'streak_reminder') {
      setEmailForm({
        templateType: val,
        subject: `Don't Break Your Learning Streak! 🔥`,
        body: `We noticed you haven't logged in today to continue your coursework. Consistency is the key to mastering your domain!\n\nJump back in now to maintain your daily streak and earn extra XP points on the leaderboard.`
      });
    } else if (val === 'fast_track') {
      setEmailForm({
        templateType: val,
        subject: `Exclusive Opportunity: Fast-Track Your InterNexa Certification! 🚀`,
        body: `We have noticed your outstanding dedication and progress in your current internship program.\n\nBecause of your exceptional performance, we are offering you an exclusive opportunity to upgrade to our Fast-Track Certification! By fast-tracking, you can instantly bypass the remaining standard wait times, immediately receive your official verified certificates (including your prestigious Letter of Recommendation), and boost your resume ahead of your peers.\n\nDon't miss out on this opportunity to accelerate your career. Click the button below to secure your Fast-Track Certification now before this exclusive offer expires!`
      });
    } else {
      setEmailForm({ templateType: val, subject: '', body: '' });
    }
  };

  const handleSendManualEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEmail || !emailForm.subject || !emailForm.body) return;
    
    setLoadingAction('sending_email');
    const studentName = selectedUserForEmail.full_name || selectedUserForEmail.name || 'Student';
    const res = await sendUserManualEmail(
      selectedUserForEmail.clerk_id,
      selectedUserForEmail.email,
      studentName,
      emailForm.subject,
      emailForm.body,
      emailForm.templateType
    );
    setLoadingAction(null);
    
    if (res.success) {
      alert(`Email successfully sent to ${selectedUserForEmail.email}!`);
      setSelectedUserForEmail(null);
      setEmailForm({ subject: '', body: '', templateType: 'custom' });
    } else {
      alert(`Failed to send email: ${res.error}`);
    }
  };

  useEffect(() => {
    async function loadSettings() {
      const s199 = await getAppSettings('payment_199');
      const s99 = await getAppSettings('payment_99');
      setSettingsForm({
        payment_199_upi: s199?.data?.upi_link || '',
        payment_199_qr: s199?.data?.qr_code_url || '',
        payment_99_upi: s99?.data?.upi_link || '',
        payment_99_qr: s99?.data?.qr_code_url || '',
      });
    }
    loadSettings();
  }, []);

  const handleUpdateSettings = async () => {
    setLoadingAction('settings');
    await updateAppSettings('payment_199', { upi_link: settingsForm.payment_199_upi, qr_code_url: settingsForm.payment_199_qr });
    await updateAppSettings('payment_99', { upi_link: settingsForm.payment_99_upi, qr_code_url: settingsForm.payment_99_qr });
    setLoadingAction(null);
    alert('Settings updated successfully!');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: '199' | '99') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingAction(`upload_${type}`);
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await uploadQRImage(formData);
    if (res.success && res.url) {
      if (type === '199') {
        setSettingsForm(prev => ({ ...prev, payment_199_qr: res.url! }));
        await updateAppSettings('payment_199', { upi_link: settingsForm.payment_199_upi, qr_code_url: res.url! });
      } else {
        setSettingsForm(prev => ({ ...prev, payment_99_qr: res.url! }));
        await updateAppSettings('payment_99', { upi_link: settingsForm.payment_99_upi, qr_code_url: res.url! });
      }
      alert('QR Code updated instantly!');
    } else {
      alert(res.error || 'Failed to upload QR Code');
    }
    setLoadingAction(null);
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction('notification');
    
    if (selectedUserForNotif) {
      const res = await sendUserNotification(selectedUserForNotif.clerk_id, notifForm.title, notifForm.message, notifForm.type, notifForm.link);
      setLoadingAction(null);
      if(res.success) {
        alert(`Notification sent to ${selectedUserForNotif.full_name}!`);
        setNotifForm({ title: '', message: '', type: 'info', link: '' });
        setSelectedUserForNotif(null);
      } else {
        alert('Failed: ' + res.error);
      }
    } else {
      const res = await sendGlobalNotification(notifForm.title, notifForm.message, notifForm.type, notifForm.link);
      setLoadingAction(null);
      if(res.success) {
        alert('Notification sent to ' + res.count + ' users!');
        setNotifForm({ title: '', message: '', type: 'info', link: '' });
      } else {
        alert('Failed: ' + res.error);
      }
    }
  };

  const handleDeleteUser = async (clerkId: string, name: string) => {
    if(!confirm(`WARNING: Are you absolutely sure you want to delete all data for ${name}? This action CANNOT be undone and will erase all their applications, projects, and payments.`)) return;
    if(!confirm(`FINAL CONFIRMATION: Type OK to delete ${name}.`)) return; // Simple double confirmation

    setLoadingAction(`delete_${clerkId}`);
    const res = await deleteUserCompletely(clerkId);
    setLoadingAction(null);

    if (res.success) {
      alert(`User ${name} has been completely deleted.`);
      fetchAdminData();
    } else {
      alert('Failed to delete user: ' + res.error);
    }
  };

  const fetchAdminData = async () => {
    const res = await getAdminData();
    if (res.success && res.data) {
      setData(res.data);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchAdminData, 10000);
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
        <Button 
          variant="outline" 
          onClick={async () => {
            setLoadingAction("refresh");
            await fetchAdminData();
            setLoadingAction(null);
          }}
          disabled={loadingAction === "refresh"}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loadingAction === "refresh" ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
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
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "settings", label: "Settings", icon: Settings },
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
                {[...data.applications].sort((a: any, b: any) => {
                  if (a.status === "Submitted" && b.status !== "Submitted") return -1;
                  if (a.status !== "Submitted" && b.status === "Submitted") return 1;
                  return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                }).map((app: any) => (
                  <tr key={app.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{app.application_id || app.reference_number}</td>
                    <td className="px-6 py-4 font-medium text-brand-900 dark:text-white">{app.full_name}</td>
                    <td className="px-6 py-4">{app.internships?.title || "Unknown"}</td>
                    <td className="px-6 py-4">
                      <Badge variant={app.status === "Accepted" || app.status === "Approved" ? "success" : app.status === "Rejected" ? "destructive" : "default"}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setAppDetailsModal(app)}>
                        <Eye className="w-4 h-4 mr-1.5" /> Details
                      </Button>
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
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
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
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedUserForNotif(u)} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-900/30">
                        <MessageSquare className="w-4 h-4 mr-1.5" /> Message
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedUserForEmail(u)} className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-900/30">
                        <Send className="w-4 h-4 mr-1.5" /> Email
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteUser(u.clerk_id, u.full_name)} disabled={loadingAction === `delete_${u.clerk_id}`} className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30">
                        <Trash2 className="w-4 h-4 mr-1.5" /> {loadingAction === `delete_${u.clerk_id}` ? "..." : "Delete Data"}
                      </Button>
                    </td>
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
          <div className="space-y-12">
            
            {/* Onboarding Payments (199) */}
            <div>
              <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                Onboarding Payments (₹199)
              </h3>
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
                    {[...(data.manualPayments || [])]
                      .filter((p: any) => !p.reference_number?.startsWith("FAST-"))
                      .sort((a: any, b: any) => {
                      if (a.status === "Pending" && b.status !== "Pending") return -1;
                      if (a.status !== "Pending" && b.status === "Pending") return 1;
                      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                    }).map((payment: any) => (
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
                              href={`${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"}/storage/v1/object/public/documents/${payment.screenshot_file_id}`} 
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
                    {(!data.manualPayments || data.manualPayments.filter((p: any) => !p.reference_number?.startsWith("FAST-")).length === 0) && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-brand-500">
                          No onboarding payments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fast-Track Certification Payments (99) */}
            <div>
              <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                Fast-Track Certification Payments (₹99)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap border-t-2 border-indigo-500/20">
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
                    {[...(data.manualPayments || [])]
                      .filter((p: any) => p.reference_number?.startsWith("FAST-"))
                      .sort((a: any, b: any) => {
                      if (a.status === "Pending" && b.status !== "Pending") return -1;
                      if (a.status !== "Pending" && b.status === "Pending") return 1;
                      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                    }).map((payment: any) => (
                      <tr key={payment.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-brand-900 dark:text-white">{payment.applications?.full_name || "Unknown"}</div>
                          <div className="text-xs text-brand-500">{payment.email_id}</div>
                        </td>
                        <td className="px-6 py-4 text-brand-900 dark:text-white">{payment.applications?.internships?.title || "Unknown"}</td>
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs font-semibold text-indigo-400">{payment.reference_number}</div>
                          <div className="text-xs text-brand-500 mt-1">{payment.upi_id}</div>
                        </td>
                        <td className="px-6 py-4">
                          {payment.screenshot_file_id ? (
                            <a 
                              href={`${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"}/storage/v1/object/public/documents/${payment.screenshot_file_id}`} 
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
                                  if (!confirm("Are you sure you want to reject this FAST-TRACK payment?")) return;
                                  setLoadingAction(`rej_${payment.id}`);
                                  const res = await rejectFastTrackPayment(payment.id);
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
                                  if (!confirm("Are you sure you want to approve this FAST-TRACK payment and generate documents?")) return;
                                  setLoadingAction(`app_${payment.id}`);
                                  const res = await approveFastTrackPayment(payment.id);
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
                                className="bg-indigo-600 hover:bg-indigo-500 text-white"
                              >
                                {loadingAction === `app_${payment.id}` ? "Generating..." : "Approve & Generate"}
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
                    {(!data.manualPayments || data.manualPayments.filter((p: any) => p.reference_number?.startsWith("FAST-")).length === 0) && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-brand-500">
                          No fast-track payments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

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
                  <th className="px-6 py-4 font-medium">Email</th>
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
                    <td className="px-6 py-4 text-brand-500">{app.email}</td>
                    <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">{app.internships?.title || "Unknown"}</td>
                    <td className="px-6 py-4 font-mono text-xs">{app.status === "Completed" ? `CERT-${app.id.substring(0,8).toUpperCase()}` : "-"}</td>
                    <td className="px-6 py-4">
                      {app.status === "Completed" ? (
                        <Badge variant="success" className="bg-emerald-500 text-white border-0">Generated</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 border-0">Pending</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.status === "Completed" ? (
                        <a 
                          href={`${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"}/storage/v1/object/public/documents/certificates/${app.id}.pdf`}
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
                                  a.id === app.id ? { ...a, status: "Completed" } : a
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

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="p-6 md:p-8 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-4">Onboarding Payments (₹199)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">UPI Link</label>
                  <input type="text" value={settingsForm.payment_199_upi} onChange={e => setSettingsForm({...settingsForm, payment_199_upi: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-brand-900 text-brand-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">Live QR Code</label>
                  <div className="flex items-start gap-4">
                    {settingsForm.payment_199_qr ? (
                      <div className="relative w-32 h-32 border-2 border-brand-200 dark:border-brand-800 rounded-xl overflow-hidden group">
                        <img src={settingsForm.payment_199_qr} alt="QR 199" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setSettingsForm({...settingsForm, payment_199_qr: ''})} className="text-white hover:text-red-400 p-2">
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border-2 border-dashed border-brand-200 dark:border-brand-800 rounded-xl flex items-center justify-center bg-brand-50 dark:bg-brand-900/50">
                        <span className="text-xs text-brand-400">No Image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="flex items-center justify-center w-full md:w-auto px-4 py-2 border border-brand-200 dark:border-brand-800 rounded-lg cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors">
                        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                          {loadingAction === 'upload_199' ? 'Uploading...' : 'Upload New Image'}
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, '199')} disabled={loadingAction === 'upload_199'} />
                      </label>
                      <p className="text-xs text-brand-500 mt-2">Instantly updates the live site. (JPG, PNG)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-4">Fast-Track Payments (₹99)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">UPI Link</label>
                  <input type="text" value={settingsForm.payment_99_upi} onChange={e => setSettingsForm({...settingsForm, payment_99_upi: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-brand-900 text-brand-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">Live QR Code</label>
                  <div className="flex items-start gap-4">
                    {settingsForm.payment_99_qr ? (
                      <div className="relative w-32 h-32 border-2 border-brand-200 dark:border-brand-800 rounded-xl overflow-hidden group">
                        <img src={settingsForm.payment_99_qr} alt="QR 99" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setSettingsForm({...settingsForm, payment_99_qr: ''})} className="text-white hover:text-red-400 p-2">
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border-2 border-dashed border-brand-200 dark:border-brand-800 rounded-xl flex items-center justify-center bg-brand-50 dark:bg-brand-900/50">
                        <span className="text-xs text-brand-400">No Image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="flex items-center justify-center w-full md:w-auto px-4 py-2 border border-brand-200 dark:border-brand-800 rounded-lg cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors">
                        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                          {loadingAction === 'upload_99' ? 'Uploading...' : 'Upload New Image'}
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, '99')} disabled={loadingAction === 'upload_99'} />
                      </label>
                      <p className="text-xs text-brand-500 mt-2">Instantly updates the live site. (JPG, PNG)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleUpdateSettings} disabled={loadingAction === "settings"} className="w-full md:w-auto">
              {loadingAction === "settings" ? "Updating..." : "Save All Settings"}
            </Button>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white mb-6">Send Global Notification</h2>
            <form onSubmit={handleSendNotification} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Notification Title</label>
                <input required type="text" value={notifForm.title} onChange={e => setNotifForm({...notifForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-brand-900 text-brand-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Message</label>
                <textarea required value={notifForm.message} onChange={e => setNotifForm({...notifForm, message: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-brand-900 text-brand-900 dark:text-white h-24" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Type</label>
                  <select value={notifForm.type} onChange={e => setNotifForm({...notifForm, type: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-brand-900 text-brand-900 dark:text-white">
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Link (Optional)</label>
                  <input type="text" value={notifForm.link} onChange={e => setNotifForm({...notifForm, link: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-brand-900 text-brand-900 dark:text-white" />
                </div>
              </div>
              <Button type="submit" disabled={loadingAction === "notification"} className="w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> {loadingAction === "notification" ? "Sending..." : "Broadcast to All Users"}
              </Button>
            </form>
          </div>
        )}
      {/* Application Details Modal */}
      {appDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-brand-900 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-brand-200 dark:border-brand-800 shadow-2xl relative">
            <button onClick={() => setAppDetailsModal(null)} className="absolute top-6 right-6 text-brand-400 hover:text-brand-900 dark:hover:text-white">✕</button>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white mb-6">Application Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-brand-500 mb-1">Full Name</p>
                <p className="font-medium text-brand-900 dark:text-white">{appDetailsModal.full_name}</p>
              </div>
              <div>
                <p className="text-brand-500 mb-1">Email</p>
                <p className="font-medium text-brand-900 dark:text-white">{appDetailsModal.email}</p>
              </div>
              <div>
                <p className="text-brand-500 mb-1">Phone</p>
                <p className="font-medium text-brand-900 dark:text-white">{appDetailsModal.phone}</p>
              </div>
              <div>
                <p className="text-brand-500 mb-1">College</p>
                <p className="font-medium text-brand-900 dark:text-white">{appDetailsModal.college_name}</p>
              </div>
              <div>
                <p className="text-brand-500 mb-1">Degree & Branch</p>
                <p className="font-medium text-brand-900 dark:text-white">{appDetailsModal.degree} - {appDetailsModal.branch}</p>
              </div>
              <div>
                <p className="text-brand-500 mb-1">Current Skills</p>
                <p className="font-medium text-brand-900 dark:text-white">{appDetailsModal.current_skills}</p>
              </div>
              <div>
                <p className="text-brand-500 mb-1">Resume</p>
                {appDetailsModal.resume_file_id ? (
                  <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"}/storage/v1/object/public/documents/${appDetailsModal.resume_file_id}`} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">View Resume</a>
                ) : (
                  <p>No Resume</p>
                )}
              </div>
              <div className="col-span-1 md:col-span-2">
                <p className="text-brand-500 mb-1">Why Join?</p>
                <p className="font-medium text-brand-900 dark:text-white bg-brand-50 dark:bg-brand-950 p-4 rounded-xl">{appDetailsModal.why_join}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Specific User Notification Modal */}
      {selectedUserForNotif && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-brand-900 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-brand-200 dark:border-brand-800 shadow-2xl relative">
            <button onClick={() => setSelectedUserForNotif(null)} className="absolute top-6 right-6 text-brand-400 hover:text-brand-900 dark:hover:text-white">✕</button>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-white mb-2">Message User</h2>
            <p className="text-brand-500 mb-6 text-sm">Send a direct notification to {selectedUserForNotif.full_name} ({selectedUserForNotif.email}).</p>
            
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Notification Title</label>
                <input required type="text" value={notifForm.title} onChange={e => setNotifForm({...notifForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-brand-950 text-brand-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Message</label>
                <textarea required value={notifForm.message} onChange={e => setNotifForm({...notifForm, message: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-brand-950 text-brand-900 dark:text-white h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Type</label>
                  <select value={notifForm.type} onChange={e => setNotifForm({...notifForm, type: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-brand-950 text-brand-900 dark:text-white">
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">Link (Optional)</label>
                  <input type="text" value={notifForm.link} onChange={e => setNotifForm({...notifForm, link: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-brand-950 text-brand-900 dark:text-white" />
                </div>
              </div>
              <Button type="submit" disabled={loadingAction === "notification"} className="w-full flex items-center justify-center gap-2 mt-2">
                <Send className="w-4 h-4" /> {loadingAction === "notification" ? "Sending..." : "Send to User"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Manual Email Modal */}
      {selectedUserForEmail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-500" /> Send Email
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">To: {selectedUserForEmail.full_name} ({selectedUserForEmail.email})</p>
              </div>
              <button onClick={() => setSelectedUserForEmail(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSendManualEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">AI Template Options</label>
                <select
                  value={emailForm.templateType}
                  onChange={handleEmailTemplateChange}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                >
                  <option value="custom">Custom (Write yourself)</option>
                  <option value="instant_certification">Instant Certification (Auto-Generated)</option>
                  <option value="streak_reminder">Daily Streak Reminder (Auto-Generated)</option>
                  <option value="fast_track">Fast-Track Certification (Auto-Generated)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Subject</label>
                <input 
                  type="text"
                  required
                  placeholder="Enter subject..."
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Body</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="Type email body here (HTML/Markdown newlines allowed)..."
                  value={emailForm.body}
                  onChange={(e) => setEmailForm({...emailForm, body: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" type="button" onClick={() => setSelectedUserForEmail(null)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loadingAction === 'sending_email'}>
                  {loadingAction === 'sending_email' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  {loadingAction === 'sending_email' ? 'Sending...' : 'Send Branded Email'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
