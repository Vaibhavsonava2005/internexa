"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, ChevronRight, Code, Database, Sparkles, CheckCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { STATS } from "@/lib/constants";
import { Button, Badge } from "@/components/shared";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-brand-50 dark:bg-brand-950 pt-24 lg:pt-32 pb-16 lg:pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-500/10 via-transparent to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content (7 columns) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/internships" className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-800 shadow-sm hover:shadow-md transition-all text-sm font-medium text-brand-700 dark:text-brand-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-500/20 text-accent-600 dark:text-accent-400">
                  <Sparkles className="w-3 h-3" />
                </span>
                Introducing AI-Powered Mentorship
                <ChevronRight className="w-4 h-4 text-brand-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-900 dark:text-brand-50 tracking-tight leading-[1.1]"
            >
              Bridge the gap between <br className="hidden sm:block" />
              <span className="text-accent-600 dark:text-accent-500">learning</span> and <span className="text-brand-400 dark:text-brand-600">leading.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-brand-600 dark:text-brand-400 max-w-xl leading-relaxed"
            >
              The premium platform for ambitious students. Master industry-standard skills through 200+ virtual internships across 35+ domains. Build real projects, get certified, and get hired.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto"
            >
              <Button size="lg" className="w-full sm:w-auto group" asChild>
                <Link href="/internships">
                  Explore Internships
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Curriculum
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pt-8 flex items-center gap-6 text-sm text-brand-500 dark:text-brand-400"
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                <span className="font-semibold text-brand-900 dark:text-brand-200">4.9/5</span>
                <span>rating</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-brand-300 dark:bg-brand-700" />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-brand-900 dark:text-brand-200">{formatNumber(STATS.totalStudents)}+</span>
                <span>graduates</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Abstract UI Composition (5 columns) */}
          <div className="lg:col-span-5 relative hidden lg:block perspective-1000">
            <motion.div
              initial={{ opacity: 0, rotateY: 10, x: 20 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative w-full aspect-[4/5] bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Fake UI Header */}
              <div className="h-12 border-b border-brand-100 dark:border-brand-800 flex items-center px-4 gap-2 bg-brand-50/50 dark:bg-brand-950/50 backdrop-blur-sm">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              </div>
              
              {/* Fake UI Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <Badge variant="premium">Machine Learning</Badge>
                  <h3 className="text-xl font-bold text-brand-900 dark:text-brand-50">Predictive Analytics Engine</h3>
                  <p className="text-sm text-brand-500 dark:text-brand-400 line-clamp-2">Build a neural network that predicts market trends using historical financial data and sentiment analysis.</p>
                </div>

                <div className="space-y-3">
                  <div className="h-2 w-full bg-brand-100 dark:bg-brand-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1.5, delay: 1, ease: "circOut" }}
                      className="h-full bg-accent-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs font-medium text-brand-500">
                    <span>Task Progress</span>
                    <span>75% Complete</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950 border border-brand-100 dark:border-brand-800">
                    <Database className="w-5 h-5 text-accent-500 mb-2" />
                    <div className="text-sm font-semibold dark:text-brand-200">Data Cleaned</div>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950 border border-brand-100 dark:border-brand-800">
                    <Code className="w-5 h-5 text-accent-500 mb-2" />
                    <div className="text-sm font-semibold dark:text-brand-200">Model Trained</div>
                  </div>
                </div>
              </div>

              {/* Floating Element over UI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute -right-6 -bottom-6 w-48 p-4 bg-white dark:bg-brand-800 border border-brand-200 dark:border-brand-700 rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold dark:text-white">Review Passed</div>
                    <div className="text-xs text-brand-500">Mentor approved</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
