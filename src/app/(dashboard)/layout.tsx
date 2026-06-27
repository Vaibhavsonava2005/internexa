"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { getUserApplications } from "@/actions/application.actions";
import { Lock, Sparkles } from "lucide-react";

function PremiumLockOverlay({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      // Premium routes that require enrollment
      const premiumRoutes = ["/dashboard/projects", "/dashboard/resume", "/dashboard/certificates", "/dashboard/calendar"];
      const isPremium = premiumRoutes.some(r => pathname?.includes(r));

      if (!isPremium) {
        setIsLocked(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await getUserApplications();
        if (res.success && res.data) {
          // If they have any active or completed application, they have paid/enrolled
          const hasAccess = res.data.some(app => app.status === "Active" || app.status === "Completed");
          setIsLocked(!hasAccess);
        } else {
          setIsLocked(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    checkAccess();
  }, [pathname]);

  if (isLoading) {
    return <div className="h-full w-full">{children}</div>;
  }

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative h-full w-full">
      {/* Underlying content blurred */}
      <div className="pointer-events-none select-none filter blur-[6px] opacity-60">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-2xl rounded-3xl p-8 max-w-md w-full text-center transform scale-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
            <Lock className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Premium Feature Locked
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Enroll in an internship program to unlock access to premium projects, verified certificates, AI tools, and professional resume templates.
          </p>
          
          <button 
            onClick={() => router.push("/internships")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Sparkles className="w-5 h-5" />
            Explore Internships
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-collapse sidebar on smaller desktop screens
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />
      
      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        )}
      >
        <TopBar setIsMobileOpen={setIsMobileSidebarOpen} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
          <div className="max-w-7xl mx-auto h-full relative">
            <PremiumLockOverlay>
              {children}
            </PremiumLockOverlay>
          </div>
        </main>
      </div>
    </div>
  );
}
