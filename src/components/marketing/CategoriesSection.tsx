"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export function CategoriesSection() {
  const displayCategories = CATEGORIES.slice(0, 12);
  const [internships, setInternships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInternships() {
      try {
        const { data } = await supabase.from("internships").select("id, title, category");
        if (data) {
          setInternships(data);
        }
      } catch (error) {
        console.error("Error fetching internships:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInternships();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-900 dark:text-white mb-4 tracking-tight leading-tight">
              Explore 35+ Internship Domains
            </h2>
            <p className="text-lg text-brand-600 dark:text-brand-400">
              Find the perfect internship program to launch your career. From AI to Design, we have it all.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 font-semibold text-brand-900 dark:text-white hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayCategories.map((category, index) => {
            const Icon = (LucideIcons as any)[category.icon] || LucideIcons.Code;
            const match = internships.find((i) => i.category === category.name);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="h-full"
              >
                <Link
                  href={`/internships?category=${category.slug}`}
                  className="group flex flex-col h-full p-6 rounded-2xl bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:shadow-md hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${category.gradient} opacity-5 blur-2xl rounded-full group-hover:opacity-10 transition-opacity`}></div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-white dark:bg-[#111] shadow-sm flex items-center justify-center ${category.color} transition-colors relative z-10`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111] flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 relative z-10">
                      <ArrowRight className="w-4 h-4 text-brand-900 dark:text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-2 leading-tight relative z-10">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-brand-600 dark:text-brand-400 mb-6 flex-grow relative z-10 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-brand-200 dark:border-brand-800/50 relative z-10">
                    {!isLoading ? (
                      match ? (
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs font-medium text-brand-700 dark:text-brand-300 leading-snug">
                            Featured Internship: {match.title}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 dark:bg-brand-600 animate-pulse"></div>
                          <span className="text-xs font-medium text-brand-500 dark:text-brand-400">
                            Coming Soon
                          </span>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-brand-300 dark:border-brand-700 border-t-transparent animate-spin"></div>
                        <span className="text-xs font-medium text-brand-500 dark:text-brand-400">
                          Loading...
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
