"use client";

import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";
import { MENTORS } from "@/lib/constants";
import { Avatar, Badge } from "@/components/shared";
import Link from "next/link";

export function MentorsSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">
              Learn from Industry Experts
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Our mentors are top professionals from leading tech companies, ready to guide your career journey.
            </p>
          </div>
          <Link
            href="/mentors"
            className="inline-flex items-center gap-2 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            View All Mentors
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MENTORS.slice(0, 4).map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-slate-50 dark:bg-slate-950 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <Avatar name={mentor.name} src={mentor.avatar} size="xl" className="ring-4 ring-white dark:ring-slate-900" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-md border border-slate-100 dark:border-slate-700 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{mentor.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-1">
                  {mentor.name}
                </h3>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                  {mentor.title}
                </p>
                <p className="text-xs text-slate-500 mb-6">
                  at <span className="font-semibold text-slate-700 dark:text-slate-300">{mentor.company}</span>
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {mentor.expertise.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="default" size="sm">
                      {skill}
                    </Badge>
                  ))}
                  {mentor.expertise.length > 2 && (
                    <Badge variant="default" size="sm">+{mentor.expertise.length - 2}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 w-full justify-center">
                  <Link href={mentor.linkedin} className="text-slate-400 hover:text-[#0A66C2] transition-colors">
                    <LinkedinIcon className="w-5 h-5" />
                  </Link>
                  <Link href={mentor.github} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <GithubIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
