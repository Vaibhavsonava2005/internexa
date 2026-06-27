"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, ArrowRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { useTheme } from "@/hooks";
import { cn } from "@/lib/utils";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/shared";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark, mounted } = useTheme();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
          isScrolled
            ? "bg-white/80 dark:bg-brand-950/80 backdrop-blur-md border-brand-200 dark:border-brand-800 shadow-sm"
            : "bg-transparent border-transparent py-2"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
                    <defs>
                      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="50%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                      <linearGradient id="logo-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
                      stroke="url(#logo-gradient)"
                      strokeWidth="8"
                      className="dark:stroke-[url(#logo-gradient-dark)] drop-shadow-md"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M50 5 L50 45 M10 27.5 L50 45 M90 27.5 L50 45 M10 72.5 L50 45 M90 72.5 L50 45 M50 95 L50 45"
                      stroke="url(#logo-gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="dark:stroke-[url(#logo-gradient-dark)] opacity-70"
                    />
                    <circle cx="50" cy="45" r="8" fill="url(#logo-gradient)" className="dark:fill-[url(#logo-gradient-dark)]" />
                  </svg>
                </div>
                <span className="font-extrabold text-2xl text-brand-900 dark:text-white tracking-tight">
                  Inter<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-400 dark:from-indigo-400 dark:to-purple-400">Nexa</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-brand-600 dark:text-brand-300 hover:text-brand-900 dark:hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-white transition-colors rounded-full hover:bg-brand-100 dark:hover:bg-brand-800"
                aria-label="Toggle Theme"
              >
                {mounted ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : <Sun size={18} className="opacity-0" />}
              </button>

              {isSignedIn ? (
                <div className="flex items-center gap-4">
                  <Button variant="outline" asChild className="hidden sm:flex border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <UserButton />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/sign-in">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-white transition-colors"
                aria-label="Toggle Theme"
              >
                {mounted ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : <Sun size={18} className="opacity-0" />}
              </button>
              
              {isSignedIn && <UserButton />}
              
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-white"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-sm bg-white dark:bg-brand-950 p-6 shadow-2xl md:hidden border-l border-brand-200 dark:border-brand-800"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-brand-900 dark:bg-white flex items-center justify-center">
                    <span className="text-white dark:text-brand-900 font-bold text-lg leading-none">I</span>
                  </div>
                  <span className="font-bold text-xl text-brand-900 dark:text-white tracking-tight">
                    InterNexa
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-brand-500 hover:text-brand-900 dark:text-brand-400 dark:hover:text-white rounded-full hover:bg-brand-100 dark:hover:bg-brand-800"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900 font-medium transition-colors"
                  >
                    {item.label}
                    <ArrowRight size={16} className="opacity-40" />
                  </Link>
                ))}
              </div>

              {!isSignedIn && (
                <div className="mt-8 pt-8 border-t border-brand-200 dark:border-brand-800 flex flex-col gap-3">
                  <Button variant="outline" className="w-full justify-center" asChild>
                    <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button className="w-full justify-center" asChild>
                    <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
