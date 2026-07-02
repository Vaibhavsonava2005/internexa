"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, Medal, Crown, Loader2 } from "lucide-react";
import { PageHeader, Avatar, Badge } from "@/components/shared";
import { cn } from "@/lib/utils";
import { getGlobalLeaderboard, getMyPeersLeaderboard } from "@/actions/leaderboard.actions";
import { getUserApplications } from "@/actions/application.actions";
import { Lock } from "lucide-react";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      
      // Check if user is enrolled (verified payment)
      const appsRes = await getUserApplications();
      const hasActiveApp = appsRes.success && appsRes.data?.some((app: any) => 
        ["Active", "Enrolled", "Completed"].includes(app.status)
      );

      if (!hasActiveApp) {
        setIsLocked(true);
        setLoading(false);
        return;
      }

      const res = await getGlobalLeaderboard(); 
        
      if (res.success && res.data) {
        // Add index as rank for rendering
        const ranked = res.data.map((u: any, i: number) => ({ ...u, rank: i + 1 }));
        setLeaderboard(ranked);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="space-y-8">
        <PageHeader title="Leaderboard" description="Compete with peers and climb the ranks by earning XP." />
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Leaderboard Locked</h2>
          <p className="text-slate-500 dark:text-slate-400 px-8">
            You need to be fully enrolled and verified in an internship program to participate in the global ranking. Please complete your onboarding and fee payment to unlock this feature.
          </p>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader title="Leaderboard" description="Compete with peers and climb the ranks by earning XP." />
        <div className="text-center py-20 bg-slate-900 rounded-3xl border border-slate-800">
          <Trophy className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">No data yet</h2>
          <p className="text-slate-400">Complete internships to earn XP and appear on the leaderboard!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Global Leaderboard" 
        description="Compete with students across India and climb the ranks by earning XP."
      />

      {/* Podium (Top 3) */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-16 pt-10">
        
        {/* Rank 2 (Silver) */}
        {leaderboard[1] && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="order-2 md:order-1 flex flex-col items-center w-full md:w-48">
          <div className="relative mb-4">
            <Avatar src={leaderboard[1].avatar} name={leaderboard[1].name} size="xl" className="border-4 border-slate-300" />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-300 rounded-full border-2 border-white flex items-center justify-center font-bold text-slate-700 shadow-lg">2</div>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-full">{leaderboard[1].name}</h3>
          <p className="text-slate-500 font-medium mb-4">{leaderboard[1].xp.toLocaleString()} XP</p>
          <div className="w-full h-32 bg-gradient-to-t from-slate-200 dark:from-slate-800 to-slate-100 dark:to-slate-900 rounded-t-2xl border-t border-x border-slate-300 dark:border-slate-700 flex justify-center pt-4">
            <Medal className="w-8 h-8 text-slate-400" />
          </div>
        </motion.div>
        )}

        {/* Rank 1 (Gold) */}
        {leaderboard[0] && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="order-1 md:order-2 flex flex-col items-center w-full md:w-56 z-10 -mx-4 md:mx-0">
          <div className="relative mb-4">
            <Crown className="w-10 h-10 text-yellow-500 absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-md" />
            <Avatar src={leaderboard[0].avatar} name={leaderboard[0].name} size="xl" className="border-4 border-yellow-400 w-24 h-24 text-4xl shadow-yellow-500/50 shadow-xl" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full border-2 border-white flex items-center justify-center font-bold text-yellow-900 shadow-lg">1</div>
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate max-w-full">{leaderboard[0].name}</h3>
          <p className="text-yellow-600 dark:text-yellow-500 font-bold mb-4 text-lg">{leaderboard[0].xp.toLocaleString()} XP</p>
          <div className="w-full h-40 bg-gradient-to-t from-yellow-200/50 dark:from-yellow-900/30 to-yellow-100/50 dark:to-yellow-900/10 rounded-t-2xl border-t border-x border-yellow-300 dark:border-yellow-700/50 flex justify-center pt-4">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
        </motion.div>
        )}

        {/* Rank 3 (Bronze) */}
        {leaderboard[2] && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="order-3 flex flex-col items-center w-full md:w-48">
          <div className="relative mb-4">
            <Avatar src={leaderboard[2].avatar} name={leaderboard[2].name} size="xl" className="border-4 border-amber-600" />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-600 rounded-full border-2 border-white flex items-center justify-center font-bold text-white shadow-lg">3</div>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-full">{leaderboard[2].name}</h3>
          <p className="text-slate-500 font-medium mb-4">{leaderboard[2].xp.toLocaleString()} XP</p>
          <div className="w-full h-24 bg-gradient-to-t from-amber-100 dark:from-amber-900/20 to-amber-50 dark:from-amber-900/10 rounded-t-2xl border-t border-x border-amber-200 dark:border-amber-800 flex justify-center pt-4">
            <Medal className="w-8 h-8 text-amber-700 dark:text-amber-600" />
          </div>
        </motion.div>
        )}
      </div>

      {/* List (Rank 4+) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-slate-500 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">Student</div>
          <div className="col-span-2 text-center">XP</div>
          <div className="col-span-2 text-center">Streak</div>
          <div className="col-span-3 text-center">Level</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {leaderboard.slice(3).map((user, i) => (
            <div key={user.clerk_id || user.rank} className={cn("grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center transition-colors", user.isCurrentUser ? "bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500" : "hover:bg-slate-50 dark:hover:bg-slate-800/50")}>
              <div className={cn("col-span-1 text-center font-bold", user.isCurrentUser ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")}>
                #{user.rank}
              </div>
              <div className="col-span-4 flex items-center gap-3">
                <Avatar src={user.avatar} name={user.name} size="sm" className={user.isCurrentUser ? "ring-2 ring-indigo-500 ring-offset-2" : ""} />
                <span className="font-bold text-slate-900 dark:text-white truncate">
                  {user.name} {user.isCurrentUser && <span className="text-xs text-indigo-500 ml-1">(You)</span>}
                </span>
              </div>
              <div className="col-span-2 text-center font-bold text-indigo-600 dark:text-indigo-400">
                {user.xp.toLocaleString()}
              </div>
              <div className="col-span-2 flex items-center justify-center gap-1 font-bold text-orange-500">
                <Flame className="w-4 h-4" /> {user.streak || 0}
              </div>
              <div className="col-span-3 flex justify-center">
                <Badge variant="outline" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400">
                  Lv {user.level}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
