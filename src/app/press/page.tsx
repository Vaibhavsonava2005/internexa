import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function PressPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-900 dark:text-white mb-6">Press & Media</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
            Get the latest news, announcements, and media resources about InterNexa Labs. We're always excited to share how we're changing the landscape of education and early career development.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <h2 className="text-2xl font-bold text-brand-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">Latest News</h2>
              
              <div className="space-y-4">
                <span className="text-sm text-brand-500 font-semibold tracking-wider uppercase">June 15, 2026</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">InterNexa Labs Secures $15M Series A to Expand AI Mentorship Platform</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We are thrilled to announce our Series A funding round led by EdTech Ventures, which will accelerate the development of our predictive career matching algorithms.
                </p>
                <button className="text-brand-500 font-medium hover:underline">Read Release &rarr;</button>
              </div>

              <div className="space-y-4">
                <span className="text-sm text-brand-500 font-semibold tracking-wider uppercase">May 02, 2026</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">InterNexa Labs Partners with Top 50 Global Universities</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our platform is now officially integrated into the career development curriculum of fifty leading universities worldwide, reaching over 500,000 active students.
                </p>
                <button className="text-brand-500 font-medium hover:underline">Read Release &rarr;</button>
              </div>
            </div>

            <div className="bg-brand-50 dark:bg-brand-900/20 p-8 rounded-2xl border border-brand-100 dark:border-brand-800/50 h-fit">
              <h2 className="text-xl font-bold text-brand-900 dark:text-white mb-4">Media Inquiries</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                For press inquiries, interview requests, or high-resolution brand assets, please contact our media team.
              </p>
              <p className="text-gray-900 dark:text-white font-medium mb-1">Press Contact:</p>
              <a href="mailto:info.internexa@gmail.com" className="text-brand-500 hover:underline">info.internexa@gmail.com</a>
              
              <div className="mt-8 pt-8 border-t border-brand-200 dark:border-brand-800/50">
                <h3 className="text-lg font-bold text-brand-900 dark:text-white mb-4">Brand Kit</h3>
                <button className="w-full py-3 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  Download Assets (ZIP)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
