import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { BrainCircuit, Briefcase, FileText, Target, Search, Users, Activity } from "lucide-react";
import Link from "next/link";

export default function AIToolsPage() {
  const tools = [
    {
      id: "resume-analyzer",
      title: "AI Resume Analyzer",
      description: "Upload your resume and get instant, actionable feedback based on industry standards to improve your screening rates.",
      icon: <FileText className="w-10 h-10 text-indigo-500" />,
      color: "bg-indigo-50",
      btnColor: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      id: "interview-assistant",
      title: "Interview Assistant",
      description: "Real-time AI companion that provides hints, rephrases questions, and analyzes your tone during practice interviews.",
      icon: <Users className="w-10 h-10 text-emerald-500" />,
      color: "bg-emerald-50",
      btnColor: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      id: "career-roadmap",
      title: "Career Roadmap Generator",
      description: "Generate a personalized step-by-step roadmap for your dream role, including what to learn and when.",
      icon: <Target className="w-10 h-10 text-blue-500" />,
      color: "bg-blue-50",
      btnColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      id: "ats-checker",
      title: "ATS Compatibility Checker",
      description: "See how your resume parses in an Applicant Tracking System. Discover missing keywords and formatting errors.",
      icon: <Search className="w-10 h-10 text-orange-500" />,
      color: "bg-orange-50",
      btnColor: "bg-orange-600 hover:bg-orange-700"
    },
    {
      id: "mock-interview",
      title: "AI Mock Interviews",
      description: "Conduct video or text-based mock interviews with our AI persona tailored to specific companies and roles.",
      icon: <BrainCircuit className="w-10 h-10 text-purple-500" />,
      color: "bg-purple-50",
      btnColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      id: "skill-gap",
      title: "Skill Gap Analysis",
      description: "Compare your current skills with job market demands and receive a tailored curriculum to bridge the gap.",
      icon: <Activity className="w-10 h-10 text-rose-500" />,
      color: "bg-rose-50",
      btnColor: "bg-rose-600 hover:bg-rose-700"
    },
    {
      id: "career-predictor",
      title: "Career Trajectory Predictor",
      description: "Leverage predictive models to foresee potential career paths, expected salary growth, and industry shifts.",
      icon: <Briefcase className="w-10 h-10 text-teal-500" />,
      color: "bg-teal-50",
      btnColor: "bg-teal-600 hover:bg-teal-700"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-4">
            <BrainCircuit className="w-4 h-4" />
            <span>Next-Generation Career Tools</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Supercharge Your Career with AI
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage our advanced artificial intelligence tools to optimize your resume, ace your interviews, and chart a clear path to success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
              <div className={`${tool.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6`}>
                {tool.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{tool.title}</h3>
              <p className="text-gray-600 mb-8 flex-grow leading-relaxed">{tool.description}</p>
              
              <Link 
                href={`/ai-tools/${tool.id}`}
                className={`mt-auto inline-flex items-center justify-center w-full px-5 py-3 text-sm font-semibold text-white rounded-xl transition-colors ${tool.btnColor}`}
              >
                Try {tool.title}
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
