"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";

// We use an empty key or public key for frontend listening if row level security is properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""; 
const getSupabase = () => {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
};

export function useNotifications() {
  const { userId } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    
    const supabase = getSupabase();
    if (!supabase) return;

    // Fetch initial count
    const fetchCount = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('clerk_id', userId)
        .eq('is_read', false);
      
      setUnreadCount(count || 0);
    };

    fetchCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('notifications_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `clerk_id=eq.${userId}`
        },
        () => {
          setUnreadCount((prev) => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `clerk_id=eq.${userId}`
        },
        () => {
          // Simplistic re-fetch on any update (e.g. marking read)
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [userId]);

  return { unreadCount };
}
