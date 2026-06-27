"use client";

import { UserProfile } from "@clerk/nextjs";
import { useTheme } from "@/hooks";
import { PageHeader } from "@/components/shared";

export default function SettingsPage() {
  const { isDark } = useTheme();

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Account Settings" 
        description="Manage your account preferences and security."
      />

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <UserProfile 
          appearance={{
            elements: {
              rootBox: "w-full max-w-full",
              card: "shadow-none p-0 w-full max-w-full bg-transparent border-0",
              navbar: "hidden md:block",
              navbarMobileMenuButton: "md:hidden mb-4",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              profileSection: "mb-8 pb-8 border-b border-slate-200 dark:border-slate-800 last:border-0",
              profileSectionTitle: "text-lg font-bold text-slate-900 dark:text-white mb-4",
              profileSectionTitleText: "text-lg font-bold",
              profileSectionContent: "space-y-4",
              badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
              formFieldInput: "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700",
            }
          }}
        />
      </div>
    </div>
  );
}
