import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-900 dark:text-white mb-6">About InterNexa</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              At InterNexa, we believe that practical experience should not be a luxury. We are building an AI-powered EdTech platform that bridges the gap between theoretical knowledge and real-world skills by connecting ambitious students with high-impact internships at top tech companies.
            </p>
            <h2 className="text-2xl font-semibold text-brand-900 dark:text-white mt-12 mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our mission is to democratize access to career-accelerating opportunities. Through our advanced AI matching algorithms, personalized mentorship matching, and curated skill-building paths, we empower the next generation of tech leaders to realize their full potential.
            </p>
            <h2 className="text-2xl font-semibold text-brand-900 dark:text-white mt-12 mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Founded in 2026, InterNexa started with a simple observation: the traditional entry-level job market is broken. Recent graduates struggle to find roles because they lack experience, but they can't get experience without a role. We created a dynamic ecosystem where students learn by doing, guided by industry experts and tailored AI learning assistants.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
