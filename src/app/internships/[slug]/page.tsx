"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, BookOpen, Users, CheckCircle, PlayCircle, FileText, Share2, Heart, Award, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Badge, Button } from "@/components/shared";
import { getDifficultyColor, cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import { getUserApplications } from "@/actions/application.actions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

const TABS = ["Overview", "Curriculum", "Projects", "Mentor", "Reviews"];

export default function InternshipDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("Overview");
  const [internship, setInternship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    async function fetchInternship() {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error || !data) {
        // Handle error or redirect
        router.push('/internships');
        return;
      }

      try {
        const userAppsRes = await getUserApplications();
        if (userAppsRes.success && userAppsRes.data) {
          const applied = userAppsRes.data.some((app: any) => app.internship_id === data.id);
          setHasApplied(applied);
        }
      } catch (e) {
        // Not logged in or error, ignore
      }
      
      // Inject dummy details if DB fields are empty
      const fullData = {
        ...data,
        overview: data.description,
        learningOutcomes: data.outcomes || [],
        requirements: data.requirements || [],
        curriculum: data.modules || [],
        projects: data.projects || [],
        mentor: {
          name: "Industry Expert",
          title: "Senior Engineer",
          company: "Top Tech Firm",
          bio: "Experienced professional mentoring students to excel in their careers.",
        },
        reviews: [],
      };
      
      setInternship(fullData);
      setLoading(false);
    }
    fetchInternship();
  }, [slug, router]);

  if (loading || !internship) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-50 dark:bg-[#0a0a0a]">
        <Navbar />
        <main className="flex-1 pt-24 pb-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-50 dark:bg-[#0a0a0a]">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        
        {/* Breadcrumb / Back button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link href="/internships" className="inline-flex items-center text-sm font-medium text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Internships
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant={internship.isLive ? "success" : "default"} className="font-medium">
                  {internship.category}
                </Badge>
                {internship.isLive && (
                  <Badge variant="success" className="font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> LIVE
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-brand-900 dark:text-white mb-6 leading-tight tracking-tight">
                {internship.title}
              </h1>
              
              <p className="text-lg text-brand-600 dark:text-brand-400 mb-8 leading-relaxed max-w-2xl">
                {internship.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-brand-600 dark:text-brand-300">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                  <span className="font-semibold text-brand-900 dark:text-white">{internship.rating}</span>
                  <span>({internship.totalRatings} ratings)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" />
                  <span>{internship.totalEnrolled?.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-400" />
                  <span>Verified Certificate</span>
                </div>
              </div>
            </div>

            {/* Sticky Enrollment Panel */}
            <div className="hidden lg:block lg:col-span-4 relative">
              <div className="sticky top-24 w-full bg-white dark:bg-brand-950 rounded-2xl shadow-lg border border-brand-200 dark:border-brand-800 p-6 overflow-hidden">
                {hasApplied ? (
                  <Button size="lg" className="w-full mb-6 bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/dashboard/internships">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Already Applied - View Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="w-full mb-6" asChild>
                    <Link href={`/apply/${internship.slug}`}>Apply Now</Link>
                  </Button>
                )}

                <div className="space-y-4">
                  <h4 className="font-semibold text-brand-900 dark:text-white text-sm uppercase tracking-wider">This internship includes:</h4>
                  <ul className="space-y-3 text-sm text-brand-600 dark:text-brand-300">
                    <li className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-accent-500" />
                      <span>{internship.duration} duration</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-accent-500" />
                      <span className={getDifficultyColor(internship.difficulty || "")}>{internship.difficulty} Level</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-accent-500" />
                      <span>{internship.projects.length} Real-world Projects</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-accent-500" />
                      <span>1-on-1 Mentorship</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 pt-6 border-t border-brand-200 dark:border-brand-800 flex items-center justify-between">
                   <button className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-white transition-colors">
                     <Share2 className="w-4 h-4" /> Share
                   </button>
                   <button className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-white transition-colors">
                     <Heart className="w-4 h-4" /> Save
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              {/* Tabs Navigation */}
              <div className="flex items-center gap-8 border-b border-brand-200 dark:border-brand-800 mb-8 overflow-x-auto custom-scrollbar">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "pb-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                      activeTab === tab
                        ? "border-accent-500 text-brand-900 dark:text-white"
                        : "border-transparent text-brand-500 hover:text-brand-900 dark:hover:text-white"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  
                  {activeTab === "Overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-12"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-4">About this Internship</h3>
                        <p className="text-brand-600 dark:text-brand-400 leading-relaxed">
                          {internship.overview}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-bold text-brand-900 dark:text-white mb-4">What you'll learn</h3>
                          <ul className="space-y-3">
                            {internship.learningOutcomes.map((outcome: string, i: number) => (
                              <li key={i} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                                <span className="text-brand-600 dark:text-brand-400 text-sm leading-relaxed">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-brand-900 dark:text-white mb-4">Requirements</h3>
                          <ul className="space-y-3">
                            {internship.requirements.map((req: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 text-brand-600 dark:text-brand-400 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-2" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "Curriculum" && (
                    <motion.div
                      key="curriculum"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-6">Course Timeline</h3>
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-200 dark:before:via-brand-800 before:to-transparent">
                        {internship.curriculum.map((module: any, i: number) => (
                          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-brand-950 bg-brand-100 dark:bg-brand-900 text-brand-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                               {i + 1}
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-950 shadow-sm">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-brand-900 dark:text-white">{module.title}</h4>
                              </div>
                              <span className="text-xs font-semibold text-accent-600 dark:text-accent-500 mb-3 block">{module.duration}</span>
                              <ul className="space-y-2">
                                {module.lessons.map((lesson: string, idx: number) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400">
                                    <div className="w-1 h-1 rounded-full bg-brand-300 dark:bg-brand-700" />
                                    {lesson}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "Projects" && (
                    <motion.div
                      key="projects"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {internship.projects.map((project: any, i: number) => (
                        <div key={i} className="p-6 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-950">
                          <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900 flex items-center justify-center mb-4 text-accent-500">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-brand-900 dark:text-white mb-2">{project.title}</h4>
                          <p className="text-sm text-brand-600 dark:text-brand-400 leading-relaxed">{project.desc}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "Mentor" && (
                    <motion.div
                      key="mentor"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-950 items-start">
                        <div className="w-24 h-24 rounded-full bg-brand-200 dark:bg-brand-800 shrink-0 flex items-center justify-center text-xl font-bold text-brand-500">
                          {internship.mentor.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-brand-900 dark:text-white">{internship.mentor.name}</h4>
                          <p className="text-brand-500 font-medium text-sm mb-4">{internship.mentor.title} at {internship.mentor.company}</p>
                          <p className="text-brand-600 dark:text-brand-400 leading-relaxed text-sm max-w-2xl">{internship.mentor.bio}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "Reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {internship.reviews.map((review: any) => (
                        <div key={review.id} className="p-6 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-950">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center font-bold text-brand-700 dark:text-brand-300">
                                {review.user.charAt(0)}
                              </div>
                              <div>
                                <h5 className="font-bold text-brand-900 dark:text-white text-sm">{review.user}</h5>
                                <p className="text-xs text-brand-500">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={cn("w-4 h-4", i < review.rating ? "text-amber-400 fill-amber-400" : "text-brand-200 dark:text-brand-800")} />
                              ))}
                            </div>
                          </div>
                          <p className="text-brand-600 dark:text-brand-400 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
