import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default async function AIToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const toolTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-500/30">
            <Sparkles className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{toolTitle}</h1>
          <p className="text-xl text-slate-400 mb-10">
            This advanced AI tool is exclusively available to enrolled InterNexa students. Log in to your dashboard to access powerful AI features designed to accelerate your career growth.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sign-in" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold flex items-center gap-2">
              Log in to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/ai-tools" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold">
              Back to Tools
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
