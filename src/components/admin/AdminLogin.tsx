"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/shared";
import { loginAdmin } from "@/actions/admin.actions";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(password);
      if (res.success) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-brand-950 p-8 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-xl">
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-400">
          <Lock className="w-6 h-6" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center text-brand-900 dark:text-white mb-2">Admin Access</h2>
      <p className="text-center text-brand-500 text-sm mb-8">Enter the secure password to continue</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 bg-brand-50 dark:bg-brand-900 border border-brand-200 dark:border-brand-800 rounded-lg text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500 outline-none transition-all"
            required
          />
        </div>
        
        {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
        
        <Button type="submit" className="w-full py-6 text-lg font-medium" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
        </Button>
      </form>
    </div>
  );
}
