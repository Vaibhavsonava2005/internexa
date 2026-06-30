import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-900 dark:text-white mb-6">Help & Support</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
            We are committed to providing a seamless experience. Find the resources you need to troubleshoot issues, learn about new features, or get in touch with our dedicated support team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50">
              <h2 className="text-2xl font-semibold text-brand-900 dark:text-white mb-4">Knowledge Base</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Browse our comprehensive guides and tutorials to learn how to make the most of the InterNexa Labs platform.
              </p>
              <button className="text-brand-500 font-medium hover:text-brand-600 transition-colors">Browse Articles &rarr;</button>
            </div>
            
            <div className="p-8 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50">
              <h2 className="text-2xl font-semibold text-brand-900 dark:text-white mb-4">Technical Support</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Experiencing a bug or technical issue? Submit a ticket and our engineering team will investigate promptly.
              </p>
              <button className="text-brand-500 font-medium hover:text-brand-600 transition-colors">Submit Ticket &rarr;</button>
            </div>
            
            <div className="p-8 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50">
              <h2 className="text-2xl font-semibold text-brand-900 dark:text-white mb-4">Community Forums</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Connect with other students and mentors. Ask questions, share tips, and build your professional network.
              </p>
              <button className="text-brand-500 font-medium hover:text-brand-600 transition-colors">Join Discussion &rarr;</button>
            </div>
          </div>
          
          <div className="bg-brand-500 rounded-3xl p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Still need help?</h2>
            <p className="text-brand-50 text-lg mb-8 max-w-2xl mx-auto">
              Our support team is available Monday through Friday to assist you with any questions or concerns you might have.
            </p>
            <button className="px-8 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              Contact Support Team
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
