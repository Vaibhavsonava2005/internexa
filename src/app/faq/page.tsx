import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is InterNexa Labs?",
      a: "InterNexa Labs is an AI-driven EdTech platform that connects students with high-quality internships and provides tailored learning paths to ensure they are job-ready."
    },
    {
      q: "How does the AI matching work?",
      a: "Our AI analyzes your skills, coursework, and career goals to match you with internship opportunities where you have the highest likelihood of success and growth. It also identifies skill gaps and recommends targeted learning modules."
    },
    {
      q: "Is InterNexa Labs free for students?",
      a: "Yes! Core features of InterNexa Labs, including profile creation, AI matching, and basic learning paths, are completely free for students. We offer premium features for advanced mentorship and specialized certifications."
    },
    {
      q: "Can companies post internships directly?",
      a: "Absolutely. Our employer portal allows companies to post openings, set required skill parameters, and let our AI handle the initial screening to provide a shortlist of highly qualified candidates."
    },
    {
      q: "How long does the matching process take?",
      a: "Once your profile is complete, our AI immediately begins evaluating opportunities. Most students receive their first highly-curated internship match within 48 hours."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-900 dark:text-white mb-6 text-center">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center">
            Everything you need to know about the InterNexa Labs platform and how it accelerates your career.
          </p>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-brand-50 dark:bg-brand-900/10 p-6 rounded-2xl border border-brand-100 dark:border-brand-800/30">
                <h3 className="text-xl font-semibold text-brand-900 dark:text-white mb-3">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
