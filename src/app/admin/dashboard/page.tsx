import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { getAdminData } from "@/actions/admin.actions";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "true";

  if (!isAdmin) {
    redirect("/admin");
  }

  const { success, data, error } = await getAdminData();

  if (!success || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-brand-950">
        <p className="text-red-500">Failed to load admin data: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] p-4 sm:p-8">
      <AdminDashboardClient initialData={data} />
    </div>
  );
}
