import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Quote, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuccessStoriesPage() {
  const stories = [
    {
      id: "s1",
      name: "Daniela Ruston",
      previousRole: "Customer Support",
      currentRole: "Frontend Engineer",
      company: "Spotify",
      quote: "The personalized curriculum and the mock interviews completely transformed my confidence. I went from being rejected at screening to landing multiple offers.",
      salaryIncrease: "150%",
      imageUrl: "https://i.pravatar.cc/150?img=49"
    },
    {
      id: "s2",
      name: "Marcus Johnson",
      previousRole: "Recent Graduate",
      currentRole: "Data Analyst",
      company: "Amazon",
      quote: "The ATS resume checker highlighted exactly why I wasn't getting callbacks. Once I optimized it and used the career roadmap, I got an interview at Amazon within 3 weeks.",
      salaryIncrease: "Entry Level",
      imageUrl: "https://i.pravatar.cc/150?img=12"
    },
    {
      id: "s3",
      name: "Priya Sharma",
      previousRole: "QA Tester",
      currentRole: "Backend Developer",
      company: "Microsoft",
      quote: "The system design mentorship was a game changer. My mentor walked me through distributed systems concepts that I never would have learned on my own.",
      salaryIncrease: "110%",
      imageUrl: "https://i.pravatar.cc/150?img=32"
    },
    {
      id: "s4",
      name: "Kevin Wu",
      previousRole: "Non-Tech Background",
      currentRole: "UX Researcher",
      company: "Airbnb",
      quote: "I thought my background in psychology wouldn't translate. The skills gap analysis helped me realize I had transferable skills, and just needed to learn Figma and design thinking.",
      salaryIncrease: "85%",
      imageUrl: "https://i.pravatar.cc/150?img=53"
    },
    {
      id: "s5",
      name: "Aisha Patel",
      previousRole: "Junior Developer",
      currentRole: "Senior Software Engineer",
      company: "Stripe",
      quote: "I was stuck at the junior level for 3 years. The interview assistant helped me articulate my impact better, allowing me to finally break into a senior role.",
      salaryIncrease: "60%",
      imageUrl: "https://i.pravatar.cc/150?img=21"
    },
    {
      id: "s6",
      name: "Carlos Mendoza",
      previousRole: "Bootcamp Grad",
      currentRole: "Full Stack Engineer",
      company: "Netflix",
      quote: "Getting an internship seemed impossible. The community, the AI resume builder, and the live workshops gave me the edge I needed to stand out from thousands of applicants.",
      salaryIncrease: "First Role",
      imageUrl: "https://i.pravatar.cc/150?img=68"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-4">
            <Quote className="w-4 h-4" />
            <span>Real Results</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Success Stories
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how thousands of students and professionals have transformed their careers using our platform and expert mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden flex flex-col">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-gray-50 opacity-50" />
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <img src={story.imageUrl} alt={story.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{story.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">Now at <span className="text-gray-900 font-semibold">{story.company}</span></p>
                </div>
              </div>
              
              <p className="text-gray-700 italic mb-8 relative z-10 flex-grow leading-relaxed">
                "{story.quote}"
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3 relative z-10 mt-auto border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Career Shift</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <span className="text-gray-500 font-normal">{story.previousRole}</span>
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                    <span>{story.currentRole}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <span className="text-sm text-gray-500">Salary Impact</span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    +{story.salaryIncrease}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-700 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to write your own success story?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Join our platform today and get access to industry-leading mentors, AI-powered career tools, and a thriving community.
            </p>
            <Link href="/apply" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl">
              Start Your Journey
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
