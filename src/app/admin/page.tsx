import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin/AdminLogin";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "true";

  if (isAdmin) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a] p-4">
      <AdminLogin />
    </div>
  );
}
