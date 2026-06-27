import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-brand-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10">Last Updated: June 2026</p>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Introduction</h2>
            <p>
              At InterNexa, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our AI-powered educational and career development platform.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, build a profile, complete learning assessments, or communicate with our support team. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Name, email address, and contact information.</li>
              <li>Academic history, resume details, and skill assessments.</li>
              <li>Usage data and interactions with our AI matching algorithms.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. How We Use Your Data</h2>
            <p>
              The core functionality of InterNexa relies on data to provide accurate internship matching. We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Power our AI recommendations for jobs and learning modules.</li>
              <li>Connect you with potential employers and mentors.</li>
              <li>Improve and optimize our platform's algorithms.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data from unauthorized access. However, no digital platform can guarantee 100% security. We encourage you to use strong passwords and enable two-factor authentication.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
