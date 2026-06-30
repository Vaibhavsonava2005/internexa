import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-900 dark:text-white mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
            Have questions about our platform, partnership opportunities, or need technical assistance? Our team is here to help you navigate your InterNexa Labs experience.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-brand-50 dark:bg-brand-900/20 p-8 rounded-2xl border border-brand-100 dark:border-brand-800/50">
              <h2 className="text-2xl font-semibold text-brand-900 dark:text-white mb-6">Get in Touch</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Message</label>
                  <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="How can we help you?"></textarea>
                </div>
                <button type="button" className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors">
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-brand-900 dark:text-white mb-3">Headquarters</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  22 B Navi Mumbai<br />
                  Maharashtra, 400614<br />
                  India
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brand-900 dark:text-white mb-3">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  General Inquiries: info.internexa@gmail.com<br />
                  Support: info.internexa@gmail.com
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brand-900 dark:text-white mb-3">Working Hours</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monday - Friday: 9:00 AM - 6:00 PM (PST)<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
