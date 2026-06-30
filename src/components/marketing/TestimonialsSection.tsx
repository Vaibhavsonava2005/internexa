"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { Avatar, StarRating } from "@/components/shared";

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">
            Student Success Stories
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Don't just take our word for it. Hear from students who launched their careers with InterNexa Labs.
          </p>
        </div>

        {/* Masonry-style grid for testimonials */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="break-inside-avoid bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-4 mb-6">
                <Avatar name={testimonial.name} src={testimonial.avatar} size="lg" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-slate-500">{testimonial.college}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <StarRating rating={testimonial.rating} showValue={false} size="sm" />
              </div>

              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-indigo-500/10 rotate-180" />
                <p className="text-slate-600 dark:text-slate-300 relative z-10 leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Completed Program
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-400 font-medium mt-1">
                  {testimonial.internship}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
