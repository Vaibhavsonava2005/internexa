"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { PROCESS_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ProcessSection() {
  return (
    <section className="py-24 bg-brand-50 dark:bg-brand-950/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-900 dark:text-white mb-4 tracking-tight">
            The Path to Placement
          </h2>
          <p className="text-lg text-brand-600 dark:text-brand-400">
            A structured, proven curriculum designed to take you from beginner to hired.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Connecting Line */}
          <div className="absolute top-4 bottom-4 left-8 md:left-1/2 md:-ml-px w-0.5 bg-brand-200 dark:bg-brand-800 hidden sm:block" />

          <div className="space-y-12">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = (LucideIcons as any)[step.icon] || LucideIcons.CheckCircle;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    "relative flex flex-col sm:flex-row items-start gap-8",
                    isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                  )}
                >
                  {/* Content */}
                  <div className={cn(
                    "flex-1 w-full sm:w-1/2 pt-2",
                    isEven ? "sm:text-right sm:pr-12" : "sm:text-left sm:pl-12"
                  )}>
                    <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-brand-600 dark:text-brand-400 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>

                  {/* Center Node */}
                  <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-full bg-white dark:bg-brand-900 border-4 border-brand-50 dark:border-brand-950 shadow-md items-center justify-center relative z-10">
                    <Icon className="w-6 h-6 text-accent-500" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-900 dark:bg-white text-white dark:text-brand-900 text-xs font-bold flex items-center justify-center shadow-sm">
                      {step.step}
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden sm:block flex-1 w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
