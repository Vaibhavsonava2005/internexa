import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Clock, User, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      id: "system-design-interviews",
      title: "How to Ace System Design Interviews in 2026",
      excerpt: "A comprehensive guide to structuring your answers, estimating resources, and discussing trade-offs when designing large-scale distributed systems.",
      category: "System Design",
      author: "Alex Johnson",
      date: "Jun 24, 2026",
      readTime: "8 min read",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
      id: "ai-resume-hacks",
      title: "5 AI Resume Hacks to Beat the ATS",
      excerpt: "Learn how modern Applicant Tracking Systems work and discover practical strategies to ensure your resume lands in front of a human recruiter.",
      category: "Resume",
      author: "Samantha Lee",
      date: "Jun 20, 2026",
      readTime: "5 min read",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
      id: "dsa-patterns",
      title: "Mastering the Top 10 DSA Patterns",
      excerpt: "Stop memorizing LeetCode solutions. Learn these 10 underlying patterns to solve 80% of coding interview questions with confidence.",
      category: "DSA",
      author: "Rahul Patel",
      date: "Jun 15, 2026",
      readTime: "12 min read",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
      id: "ml-engineering-roadmap",
      title: "The Ultimate Machine Learning Engineering Roadmap",
      excerpt: "From basic statistics and Python to deploying LLMs in production. Here is your step-by-step guide to becoming an ML Engineer.",
      category: "AI / ML",
      author: "Dr. Emily Chen",
      date: "Jun 10, 2026",
      readTime: "10 min read",
      imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
      id: "python-asyncio",
      title: "Demystifying Python Asyncio",
      excerpt: "Struggling with asynchronous programming in Python? This article breaks down event loops, coroutines, and tasks with real-world examples.",
      category: "Python",
      author: "Marcus Doe",
      date: "Jun 5, 2026",
      readTime: "7 min read",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
      id: "behavioral-interviews",
      title: "Using the STAR Method for Behavioral Interviews",
      excerpt: "Behavioral questions make or break your final round. Here is how to structure your stories perfectly using Situation, Task, Action, and Result.",
      category: "Interview Preparation",
      author: "Jessica Wong",
      date: "May 28, 2026",
      readTime: "6 min read",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Insights & Career Advice
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Expert articles, tutorials, and guides to help you master new skills and accelerate your tech career.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["All", "System Design", "DSA", "AI / ML", "Interview Preparation", "Resume", "Python"].map((cat) => (
              <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${cat === "All" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
              <div className="aspect-[2/1] w-full relative overflow-hidden">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{post.date}</span>
                  <Link href={`/blog/${post.id}`} className="inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700">
                    Read More <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
