import Link from "next/link";
import { Heart } from "lucide-react";
import { TwitterIcon, LinkedinIcon, InstagramIcon, GithubIcon } from "@/components/shared/icons";

export function Footer() {
  return (
    <footer className="bg-brand-50 dark:bg-[#0a0a0a] border-t border-brand-200 dark:border-brand-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded bg-brand-900 dark:bg-white flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white dark:text-brand-900 font-bold text-lg leading-none">I</span>
              </div>
              <span className="font-bold text-2xl text-brand-900 dark:text-white tracking-tight">
                Inter<span className="text-brand-500 dark:text-brand-400">Nexa</span> Labs
              </span>
            </Link>
            <p className="text-brand-500 dark:text-brand-400 mb-8 max-w-sm">
              Bridge the Gap Between Learning and Leading. Premium AI-powered virtual internships designed to get you hired.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com/InterNexa Labs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-brand-900 flex items-center justify-center text-brand-500 hover:text-accent-600 dark:hover:text-accent-400 border border-brand-200 dark:border-brand-800 transition-colors">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/InterNexa Labs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-brand-900 flex items-center justify-center text-brand-500 hover:text-accent-600 dark:hover:text-accent-400 border border-brand-200 dark:border-brand-800 transition-colors">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/InterNexa Labs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-brand-900 flex items-center justify-center text-brand-500 hover:text-accent-600 dark:hover:text-accent-400 border border-brand-200 dark:border-brand-800 transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://github.com/InterNexa Labs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-brand-900 flex items-center justify-center text-brand-500 hover:text-accent-600 dark:hover:text-accent-400 border border-brand-200 dark:border-brand-800 transition-colors">
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-brand-900 dark:text-white mb-6">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/internships" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">All Internships</Link></li>
              <li><Link href="/categories" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/ai-tools" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">AI Tools</Link></li>
              <li><Link href="/mentors" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Mentors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-900 dark:text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/blog" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/events" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Events & Webinars</Link></li>
              <li><Link href="/success-stories" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link href="/faq" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="mailto:info@internexa.ai" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Support</Link></li>
              <li><Link href="/careers" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Press</Link></li>
              <li><Link href="/community" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Community</Link></li>
              <li><Link href="/privacy" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-brand-500 hover:text-brand-900 dark:hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-200 dark:border-brand-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-brand-500 text-sm">
            © {new Date().getFullYear()} InterNexa Labs. All rights reserved.
          </p>
          <p className="text-brand-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent-500 fill-accent-500 mx-1" /> for the students
          </p>
        </div>
      </div>
    </footer>
  );
}
