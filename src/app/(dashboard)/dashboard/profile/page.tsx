"use client";

import { useUser } from "@clerk/nextjs";
import { PageHeader, Avatar, Badge, ProgressBar } from "@/components/shared";
import { MapPin, Mail, Calendar, Edit, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { getOrCreateUserProfile } from "@/actions/user.actions";

export default function ProfilePage() {
  const { user } = useUser();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [nextLevelXp, setNextLevelXp] = useState(500);

  useEffect(() => {
    async function loadData() {
      const res = await getOrCreateUserProfile();
      if (res.success && res.data) {
        setXp(res.data.xp || 0);
        setLevel(res.data.level || 1);
        setNextLevelXp((res.data.level || 1) * 1000);
      }
    }
    loadData();
  }, []);

  if (!user) return null;

  const joinDate = new Date(user.createdAt!).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  return (
    <div className="space-y-8">
      <PageHeader 
        title="My Profile" 
        description="Manage your public profile and accomplishments."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Profile Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-indigo-500 to-violet-600" />
            
            <div className="relative pt-12 mb-4">
              <div className="inline-block p-1 bg-white dark:bg-slate-900 rounded-full">
                <Avatar src={user.imageUrl} name={user.fullName || ""} size="xl" className="w-24 h-24" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              {user.fullName}
            </h2>
            <p className="text-slate-500 mb-6">Student</p>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-6">
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{user.primaryEmailAddress?.emailAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Joined {joinDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>Role: Basic User</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Learning Journey</h3>
            
            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 dark:text-white">Level {level} Scholar</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{xp.toLocaleString()} XP</span>
              </div>
              <ProgressBar value={Math.round((xp / nextLevelXp) * 100)} />
              <p className="text-xs text-slate-500 mt-2 text-right">{nextLevelXp - xp} XP to Level {level + 1}</p>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {["React", "TypeScript", "Node.js", "Tailwind CSS", "Next.js", "MongoDB"].map(skill => (
                <Badge key={skill} variant="default">{skill}</Badge>
              ))}
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">About Me</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl">
              I'm an aspiring software engineer passionate about building impactful web applications. 
              Currently exploring the world of full-stack development and completing internships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
