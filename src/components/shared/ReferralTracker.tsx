"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      // Set a cookie that expires in 30 days
      document.cookie = `internexa_ref=${refCode}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }
  }, [searchParams]);

  return null;
}
