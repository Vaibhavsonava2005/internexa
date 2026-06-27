"use client";

import { motion } from "framer-motion";
import { Bot, Users, Briefcase, Award, TrendingUp, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Bot,
    title: "AI-Powered Learning",
    description: "Get instant code reviews, personalized roadmaps, and 24/7 doubt resolution from our advanced AI assistant.",
    className: "md:col-span-2 lg:col-span-3 bg-brand-50 dark:bg-brand-900/50",
  },
  {
    icon: Users,
    title: "Industry Mentors",
    description: "Learn directly from professionals working at top tech companies.",
    className: "md:col-span-1 lg:col-span-2 bg-white dark:bg-[#0a0a0a]",
  },
  {
    icon: Briefcase,
    title: "Real-World Projects",
    description: "Build a production-grade portfolio. Don't just watch tutorials—build real apps.",
    className: "md:col-span-1 lg:col-span-3 bg-white dark:bg-[#0a0a0a]",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    description: "Earn industry-recognized certificates with unique QR verification.",
    className: "md:col-span-2 lg:col-span-2 bg-brand-50 dark:bg-brand-900/50",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Sticky Left Column (Typography) */}
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-brand-900 dark:text-white tracking-tight mb-4 leading-tight">
                Why 50,000+ Students Choose InterNexa
              </h2>
              <p className="text-lg text-brand-600 dark:text-brand-400">
                We bridge the gap between academic learning and industry requirements with a curriculum built for the real world.
              </p>
            </motion.div>
          </div>

          {/* Bento Grid Right Column */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={cn(
                    "group p-8 rounded-2xl border border-brand-200 dark:border-brand-800 transition-all duration-300 hover:border-brand-300 dark:hover:border-brand-700 flex flex-col justify-between",
                    feature.className
                  )}
                >
                  <div className="mb-8">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-white mb-6">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-brand-600 dark:text-brand-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
