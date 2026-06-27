"use client";

import { Construction } from "lucide-react";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-brand-500" />
      </div>
      <h2 className="text-3xl font-bold text-brand-900 dark:text-white mb-3">
        {title}
      </h2>
      <p className="text-brand-600 dark:text-brand-400 max-w-md mx-auto">
        We're working hard to bring you this feature. Check back soon for updates!
      </p>
    </div>
  );
}
