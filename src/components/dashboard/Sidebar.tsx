"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { DASHBOARD_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, Button } from "@/components/shared";
import { useTheme } from "@/hooks";
import { useNotifications } from "@/hooks/useRealtime";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { theme, toggleTheme, isDark } = useTheme();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    signOut({ redirectUrl: "/" });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-50 dark:bg-[#0a0a0a] border-r border-brand-200 dark:border-brand-900 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 h-14 border-b border-brand-200 dark:border-brand-900 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden group" onClick={() => setIsMobileOpen(false)}>
          <div className="w-6 h-6 rounded bg-brand-900 dark:bg-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <span className="text-white dark:text-brand-900 font-bold text-xs leading-none">I</span>
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg text-brand-900 dark:text-white tracking-tight whitespace-nowrap"
            >
              InterNexa
            </motion.span>
          )}
        </Link>
        
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-md text-brand-500 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-3 px-3 custom-scrollbar space-y-0.5">
        {DASHBOARD_NAV.map((item) => {
          const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Circle;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative",
                isActive
                  ? "bg-brand-200 dark:bg-brand-800 text-brand-900 dark:text-white font-medium"
                  : "text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/50 hover:text-brand-900 dark:hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-brand-900 dark:text-white" : "text-brand-500 group-hover:text-brand-700 dark:group-hover:text-brand-300")} />
              
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate text-sm">{item.label}</span>
                  {item.label === "Messages" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-brand-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 z-50 whitespace-nowrap shadow-sm">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-brand-200 dark:border-brand-900 shrink-0">
        <div className={cn("flex items-center p-2 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors cursor-pointer", isCollapsed ? "justify-center" : "gap-3")}>
          <Avatar src={user?.imageUrl} name={user?.fullName || "User"} size="sm" />
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-900 dark:text-white truncate leading-none mb-1">
                {user?.fullName || "Student"}
              </p>
              <p className="text-xs text-brand-500 truncate leading-none">
                {user?.primaryEmailAddress?.emailAddress || "student@internexa.com"}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 mt-2 px-3 py-2 rounded-lg text-brand-600 dark:text-brand-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group text-sm",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:block fixed top-0 left-0 bottom-0 z-40 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-64 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
