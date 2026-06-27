"use client";

import { Menu, Bell, Search, Sun, Moon } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useTheme } from "@/hooks";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV } from "@/lib/constants";
import { useNotifications } from "@/hooks/useRealtime";

interface TopBarProps {
  setIsMobileOpen: (v: boolean) => void;
}

export function TopBar({ setIsMobileOpen }: TopBarProps) {
  const { user } = useUser();
  const { isDark, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  // Find current page title based on path
  const currentNav = DASHBOARD_NAV.find(item => pathname.startsWith(item.href)) || { label: "Dashboard" };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-brand-950/80 backdrop-blur-md border-b border-brand-200 dark:border-brand-900">
      
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-2 -ml-2 text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-white rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title */}
        <h1 className="text-lg font-bold text-brand-900 dark:text-white hidden sm:block tracking-tight">
          {currentNav.label}
        </h1>
      </div>

      <div className="flex flex-1 justify-end md:justify-between items-center gap-4 ml-4 md:ml-8">
        {/* Search */}
        <div className="hidden md:flex relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
          <input
            type="text"
            placeholder="Search internships, tools, or help... (⌘K)"
            className="w-full pl-9 pr-4 py-1.5 bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 rounded-lg text-sm focus:ring-2 focus:ring-accent-500 outline-none text-brand-900 dark:text-white shadow-sm transition-all placeholder:text-brand-400"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-white rounded-md hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
          >
            {mounted ? (isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />) : <Sun className="w-4 h-4 opacity-0" />}
          </button>

          <button className="relative p-1.5 text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-white rounded-md hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 border border-white dark:border-brand-950">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <div className="w-px h-5 bg-brand-200 dark:border-brand-800 mx-2 hidden sm:block" />

          <div className="pl-1 flex items-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7 rounded",
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
