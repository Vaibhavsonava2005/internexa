"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Clock, BookOpen, Star, LayoutGrid, List, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { FEATURED_INTERNSHIPS, CATEGORIES } from "@/lib/constants";
import { createClient } from "@supabase/supabase-js";
import { Badge, Button } from "@/components/shared";
import { getDifficultyColor, cn } from "@/lib/utils";
import { getUserApplications } from "@/actions/application.actions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

export default function InternshipsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userApps, setUserApps] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      // 1. Fetch internships
      const { data } = await supabase
        .from('internships')
        .select('*')
        .eq('is_active', true);
      setInternships(data || []);
      
      // 2. Fetch user applications if logged in
      try {
        const res = await getUserApplications();
        if (res.success && res.data) {
          setUserApps(res.data);
        }
      } catch (e) {
        // Not logged in or error
      }
      
      setLoading(false);
    }
    load();
  }, []);

  const filteredInternships = internships.filter(i => 
    (i.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (i.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-brand-50 dark:bg-[#0a0a0a]">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-900 dark:text-white mb-4 tracking-tight leading-tight">
              Explore Programs
            </h1>
            <p className="text-brand-600 dark:text-brand-400 text-lg max-w-3xl">
              Discover programs tailored to your career goals. Filter by domain, duration, and difficulty to find your perfect match.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <div className="flex bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-lg p-1 shadow-sm">
                <button onClick={() => setViewMode("grid")} className={cn("p-1.5 rounded text-sm transition-colors", viewMode === "grid" ? "bg-brand-100 dark:bg-brand-800 text-brand-900 dark:text-white" : "text-brand-500 hover:text-brand-900 dark:hover:text-white")}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={cn("p-1.5 rounded text-sm transition-colors", viewMode === "list" ? "bg-brand-100 dark:bg-brand-800 text-brand-900 dark:text-white" : "text-brand-500 hover:text-brand-900 dark:hover:text-white")}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sidebar Filters */}
            <div className={cn(
              "lg:w-64 shrink-0 space-y-8",
              isMobileFiltersOpen ? "block" : "hidden lg:block"
            )}>
              <div>
                <h3 className="font-semibold text-brand-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                  <input
                    type="text"
                    placeholder="Search programs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-lg text-sm text-brand-900 dark:text-white focus:ring-2 focus:ring-accent-500 outline-none shadow-sm transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-brand-200 dark:border-brand-800">
                <h3 className="font-semibold text-brand-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Categories</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {CATEGORIES.map(cat => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 rounded border border-brand-300 dark:border-brand-700 flex items-center justify-center group-hover:border-accent-500 transition-colors bg-white dark:bg-brand-950">
                        <input type="checkbox" className="opacity-0 absolute" />
                        <div className="w-2 h-2 rounded-sm bg-accent-500 opacity-0 transition-opacity group-has-[:checked]:opacity-100" />
                      </div>
                      <span className="text-sm text-brand-600 dark:text-brand-400 group-hover:text-brand-900 dark:group-hover:text-white transition-colors">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-brand-200 dark:border-brand-800">
                <h3 className="font-semibold text-brand-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Difficulty</h3>
                <div className="space-y-3">
                  {["Beginner", "Intermediate", "Advanced"].map(diff => (
                    <label key={diff} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 rounded border border-brand-300 dark:border-brand-700 flex items-center justify-center group-hover:border-accent-500 transition-colors bg-white dark:bg-brand-950">
                        <input type="checkbox" className="opacity-0 absolute" />
                        <div className="w-2 h-2 rounded-sm bg-accent-500 opacity-0 transition-opacity group-has-[:checked]:opacity-100" />
                      </div>
                      <span className="text-sm text-brand-600 dark:text-brand-400 group-hover:text-brand-900 dark:group-hover:text-white transition-colors">{diff}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-sm text-brand-500">
                  Showing <span className="font-semibold text-brand-900 dark:text-white">{filteredInternships.length}</span> programs
                </p>
                <div className="flex items-center gap-4">
                  <select className="bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-lg text-sm px-3 py-2 outline-none text-brand-900 dark:text-white shadow-sm">
                    <option>Sort by: Popular</option>
                    <option>Newest</option>
                    <option>Rating</option>
                  </select>
                  <div className="flex bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-lg p-1 shadow-sm">
                    <button onClick={() => setViewMode("grid")} className={cn("p-1 rounded text-sm transition-colors", viewMode === "grid" ? "bg-brand-100 dark:bg-brand-800 text-brand-900 dark:text-white" : "text-brand-500 hover:text-brand-900 dark:hover:text-white")}>
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={cn("p-1 rounded text-sm transition-colors", viewMode === "list" ? "bg-brand-100 dark:bg-brand-800 text-brand-900 dark:text-white" : "text-brand-500 hover:text-brand-900 dark:hover:text-white")}>
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid / List */}
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {filteredInternships.map((internship, index) => (
                  <motion.div
                    key={internship.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      "group bg-white dark:bg-brand-950 rounded-xl overflow-hidden border border-brand-200 dark:border-brand-800 hover:border-brand-300 dark:hover:border-brand-700 transition-colors shadow-sm hover:shadow-md flex",
                      viewMode === "grid" ? "flex-col" : "flex-col sm:flex-row h-auto sm:h-56"
                    )}
                  >
                    <div className={cn("p-6 flex flex-col flex-grow", viewMode === "list" && "sm:w-2/3")}>
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant={internship.isLive ? "success" : "default"} className="font-medium">
                          {internship.isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
                          {internship.category}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-sm text-brand-500">
                          <Star className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
                          <span className="font-medium text-brand-700 dark:text-brand-300">{internship.rating}</span>
                        </div>
                      </div>

                      <Link href={`/internships/${internship.slug}`} className="block group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors mb-2">
                        <h3 className="text-xl font-bold text-brand-900 dark:text-white leading-tight">
                          {internship.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-brand-600 dark:text-brand-400 mb-6 line-clamp-2 flex-grow">
                        {internship.shortDescription}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm text-brand-600 dark:text-brand-400 mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-brand-400" />
                          {internship.duration}
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-brand-400" />
                          <span className={getDifficultyColor(internship.difficulty || "")}>
                            {internship.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      {/* Mobile CTA shown only in grid mode */}
                      <div className={cn("flex items-center justify-end pt-5 border-t border-brand-100 dark:border-brand-800", viewMode === "list" && "sm:hidden")}>
                        {userApps.some(app => app.internship_id === internship.id) ? (
                          <Button variant="secondary" className="bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 hover:text-emerald-600" asChild>
                            <Link href="/dashboard/internships">
                              <CheckCircle className="w-4 h-4 mr-2" /> Applied
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="secondary" asChild>
                            <Link href={`/apply/${internship.slug}`}>
                              Apply Now
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* List Mode Right Panel */}
                    {viewMode === "list" && (
                      <div className="hidden sm:flex flex-col sm:w-1/3 bg-brand-50/50 dark:bg-brand-900/20 border-l border-brand-100 dark:border-brand-800 p-6 justify-center">
                         <div className="space-y-4 w-full">
                           <div className="space-y-2">
                             <div className="flex justify-between text-xs font-medium text-brand-500">
                               <span>{internship.seatsAvailable} seats remaining</span>
                             </div>
                             <div className="w-full h-1 bg-brand-200 dark:bg-brand-800 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-accent-500 rounded-full"
                                 style={{ width: `${((internship.totalSeats! - internship.seatsAvailable!) / internship.totalSeats!) * 100}%` }}
                               />
                             </div>
                           </div>
                           {userApps.some(app => app.internship_id === internship.id) ? (
                             <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                               <Link href="/dashboard/internships">
                                 <CheckCircle className="w-4 h-4 mr-2" /> Applied
                               </Link>
                             </Button>
                           ) : (
                             <Button className="w-full" asChild>
                               <Link href={`/apply/${internship.slug}`}>
                                 Apply Now
                               </Link>
                             </Button>
                           )}
                         </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
