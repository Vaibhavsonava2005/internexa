"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Clock, ArrowRight, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { FEATURED_INTERNSHIPS } from "@/lib/constants";
import { Badge, Button } from "@/components/shared";
import { formatCurrency, getDifficultyColor } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export function FeaturedInternships() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInternships() {
      const { data } = await supabase
        .from('internships')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(6);
      setInternships(data || []);
      setLoading(false);
    }
    fetchInternships();
  }, []);
  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-900 dark:text-white tracking-tight mb-4">
              Featured Programs
            </h2>
            <p className="text-brand-600 dark:text-brand-400">
              Industry-aligned curriculums designed to elevate your career.
            </p>
          </div>
          <Button variant="ghost" className="group" asChild>
            <Link href="/internships">
              Browse All
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
            </div>
          ) : internships.map((internship, index) => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group flex flex-col bg-white dark:bg-brand-950 rounded-xl overflow-hidden border border-brand-200 dark:border-brand-800 hover:border-brand-300 dark:hover:border-brand-700 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="p-6 flex flex-col flex-grow">
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

                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-brand-500">
                    <span>{internship.seatsAvailable} seats remaining</span>
                  </div>
                  <div className="w-full h-1 bg-brand-100 dark:bg-brand-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-500 rounded-full"
                      style={{ width: `${((internship.totalSeats! - internship.seatsAvailable!) / internship.totalSeats!) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-brand-100 dark:border-brand-800">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-brand-900 dark:text-white leading-none">
                      {formatCurrency(internship.price || 0, internship.currency)}
                    </span>
                    {internship.originalPrice && (
                      <span className="text-xs text-brand-400 line-through mt-1">
                        {formatCurrency(internship.originalPrice, internship.currency)}
                      </span>
                    )}
                  </div>
                  <Button variant="secondary" asChild>
                    <Link href={`/internships/${internship.slug}`}>
                      View Details
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
