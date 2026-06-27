import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-brand-900 dark:text-white mb-4">Terms of Service</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10">Last Updated: June 2026</p>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the InterNexa platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Description of Service</h2>
            <p>
              InterNexa provides an AI-driven platform connecting students with internship opportunities, educational resources, and mentorship. We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. User Conduct</h2>
            <p>
              You agree to use the platform only for lawful purposes. You must not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide false or misleading information on your profile.</li>
              <li>Attempt to manipulate our AI matching systems.</li>
              <li>Harass, abuse, or harm other users or mentors.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Intellectual Property</h2>
            <p>
              All content on the InterNexa platform, including logos, text, graphics, and underlying AI models, is the property of InterNexa and is protected by intellectual property laws. You may not reproduce or distribute this content without explicit permission.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Limitation of Liability</h2>
            <p>
              InterNexa is not responsible for the ultimate success of your internship placements or career outcomes. We provide tools to facilitate connections, but employment decisions remain strictly between the student and the employer.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
