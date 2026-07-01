import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Users, Code, MessageSquare, Briefcase } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0a0a] to-[#0a0a0a]"></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">InterNexa Community</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Connect with thousands of students, industry experts, and alumni across India. Discuss AI, software engineering, and career growth.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/sign-up" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/25">
                Join Discord Server
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Users, title: "Peer Networking", desc: "Connect with students from IITs, NITs, and top colleges across India." },
                { icon: Code, title: "Tech Discussions", desc: "Collaborate on open-source projects, DSA, and System Design." },
                { icon: MessageSquare, title: "Mentorship", desc: "Get your doubts resolved by industry experts and seniors." },
                { icon: Briefcase, title: "Career Opportunities", desc: "Exclusive internship and job referrals posted weekly." }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <item.icon className="w-12 h-12 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
