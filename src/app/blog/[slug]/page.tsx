import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import Link from "next/link";
import { FileText, ArrowLeft, Calendar } from "lucide-react";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const postTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <div className="max-w-3xl mx-auto py-10">
          <Link href="/blog" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-2 mb-8 w-fit">
            <ArrowLeft className="w-5 h-5" /> Back to Blog
          </Link>
          
          <div className="flex items-center gap-4 text-slate-400 mb-6 font-medium">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> June 2026</span>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
              Engineering
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{postTitle}</h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Explore the latest insights, strategies, and best practices for mastering this topic and accelerating your career in the tech industry.
            </p>
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
              <FileText className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Full Article Coming Soon</h3>
              <p className="text-slate-400">
                Our editorial team is currently putting the finishing touches on this comprehensive guide. Check back shortly for expert strategies, deep dives, and exclusive content tailored for InterNexa students.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
