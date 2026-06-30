"use client";
import { useState } from "react";

import { Menu, Bell, Search, Sun, Moon, X, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
  const { unreadCount, notifications, latestNotification, clearLatestNotification, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  // Find current page title based on path
  const currentNav = DASHBOARD_NAV.find(item => pathname.startsWith(item.href)) || { label: "Dashboard" };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[60px] md:h-16 px-4 sm:px-6 lg:px-8 bg-white/90 dark:bg-brand-950/90 backdrop-blur-xl border-b border-brand-200 dark:border-brand-900 pt-safe shadow-sm md:shadow-none transition-all">
      
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle (Drawer) */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-2 -ml-2 text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-white rounded-xl hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
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
            className="w-full pl-10 pr-4 py-1.5 bg-brand-50 dark:bg-[#0a0a0a] border border-brand-200 dark:border-brand-800 rounded-lg text-sm focus:ring-2 focus:ring-accent-500 outline-none text-brand-900 dark:text-white shadow-sm transition-all placeholder:text-brand-400"
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

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-white rounded-md hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 border border-white dark:border-brand-950">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-800 shadow-xl rounded-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-brand-100 dark:border-brand-800 flex justify-between items-center">
                    <h3 className="font-bold text-brand-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-brand-500">No notifications yet.</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => !n.is_read && markAsRead(n.id)}
                          className={`p-4 border-b border-brand-100 dark:border-brand-800/50 last:border-0 cursor-pointer transition-colors ${n.is_read ? 'opacity-60' : 'bg-brand-50/50 dark:bg-brand-800/20 hover:bg-brand-50 dark:hover:bg-brand-800/40'}`}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-0.5 shrink-0 ${n.type === 'success' ? 'text-emerald-500' : n.type === 'warning' ? 'text-amber-500' : n.type === 'error' ? 'text-red-500' : 'text-indigo-500'}`}>
                              {n.type === 'success' ? <CheckCircle className="w-4 h-4" /> : n.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : n.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <h4 className={`text-sm font-semibold truncate ${n.is_read ? 'text-brand-700 dark:text-brand-300' : 'text-brand-900 dark:text-white'}`}>{n.title}</h4>
                              <p className="text-xs text-brand-500 mt-0.5 line-clamp-2">{n.message}</p>
                              {n.link && (
                                <Link href={n.link} onClick={() => setShowNotifications(false)} className="inline-block mt-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                                  View Details &rarr;
                                </Link>
                              )}
                              <p className="text-[10px] text-brand-400 mt-2">
                                {new Date(n.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

      {/* Global Notification Toast */}
      <AnimatePresence>
        {latestNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-800 shadow-2xl rounded-2xl p-4 overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
              latestNotification.type === 'success' ? 'bg-emerald-500' :
              latestNotification.type === 'warning' ? 'bg-amber-500' :
              latestNotification.type === 'error' ? 'bg-red-500' : 'bg-indigo-500'
            }`} />
            
            <div className="flex items-start gap-3 pl-2">
              <div className={`mt-0.5 ${
                latestNotification.type === 'success' ? 'text-emerald-500' :
                latestNotification.type === 'warning' ? 'text-amber-500' :
                latestNotification.type === 'error' ? 'text-red-500' : 'text-indigo-500'
              }`}>
                {latestNotification.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                 latestNotification.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                 latestNotification.type === 'error' ? <AlertTriangle className="w-5 h-5" /> :
                 <Info className="w-5 h-5" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-brand-900 dark:text-white truncate pr-6">{latestNotification.title}</h4>
                <p className="text-xs text-brand-500 mt-1 line-clamp-2">{latestNotification.message}</p>
                
                {latestNotification.link && (
                  <Link href={latestNotification.link} onClick={clearLatestNotification} className="inline-block mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    View Details &rarr;
                  </Link>
                )}
              </div>
              
              <button 
                onClick={clearLatestNotification}
                className="text-brand-400 hover:text-brand-900 dark:hover:text-white shrink-0 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
