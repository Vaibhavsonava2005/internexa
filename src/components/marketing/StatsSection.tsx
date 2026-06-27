"use client";

import { motion } from "framer-motion";
import { STATS } from "@/lib/constants";
import { useCountUp } from "@/hooks";

function StatItem({ end, label, suffix = "", prefix = "" }: { end: number; label: string; suffix?: string; prefix?: string }) {
  const count = useCountUp(end, 2000);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-4xl md:text-5xl font-bold text-white font-heading mb-2">
        {prefix}{count}{suffix}
      </div>
      <div className="text-indigo-100 font-medium text-lg">
        {label}
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-indigo-600">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700 opacity-90" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <StatItem end={50000} label="Students Enrolled" suffix="+" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <StatItem end={200} label="Internship Programs" suffix="+" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <StatItem end={94} label="Placement Rate" suffix="%" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <StatItem end={500} label="Hiring Partners" suffix="+" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
