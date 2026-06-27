"use client";

import { motion } from "framer-motion";

const COMPANY_LOGOS = [
  { name: "Google", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity"><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/></svg> },
  { name: "Microsoft", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/></svg> },
  { name: "Amazon", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity"><path d="M15.45 15.6c-.6.6-1.5 1.05-2.55 1.35-1.05.3-2.1.45-3.3.45-1.5 0-2.85-.3-4.05-.9-1.2-.6-2.1-1.35-2.7-2.4-.6-1.05-.9-2.25-.9-3.75 0-1.35.3-2.55.9-3.6.6-1.05 1.35-1.8 2.4-2.4C6.3 3.75 7.65 3.45 9.15 3.45c1.35 0 2.55.3 3.6.9 1.05.6 1.8 1.5 2.4 2.55.6 1.05.9 2.4.9 3.9 0 1.5-.3 2.85-.9 3.9-.6 1.05-1.35 1.95-2.4 2.55-.9.45-1.8.75-2.7.9zm-6.3-10.2c-1.05 0-1.8.45-2.4 1.2-.6.75-.9 1.8-.9 3.3s.3 2.55.9 3.3c.6.75 1.35 1.2 2.4 1.2s1.8-.45 2.4-1.2c.6-.75.9-1.8.9-3.3s-.3-2.55-.9-3.3c-.6-.75-1.35-1.2-2.4-1.2zM24 20.85c-.9.75-2.1 1.35-3.45 1.8-1.35.45-2.85.75-4.5.75-1.65 0-3.3-.3-4.8-.75-1.5-.45-3-1.05-4.2-1.8-1.2-.75-2.25-1.65-3.15-2.55.15-.3.45-.45.9-.6.45-.15.9-.3 1.35-.3.45 0 .75.15 1.05.3.75.75 1.65 1.35 2.55 1.8.9.45 2.1.75 3.3 1.05 1.2.3 2.4.45 3.6.45 1.2 0 2.4-.15 3.45-.45 1.05-.3 2.1-.75 2.85-1.2.45-.3.9-.45 1.35-.45.45 0 .9.15 1.2.45.3.3.45.6.45.9 0 .3-.15.6-.45.75z"/></svg> },
  { name: "Apple", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"/></svg> },
  { name: "Meta", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 14h-1.6v-2.8H12v2.8h-1.6V8.8H12v2.4h2.2V8.8h1.6v7.2zM12 7.2c-.66 0-1.2-.54-1.2-1.2s.54-1.2 1.2-1.2 1.2.54 1.2 1.2-.54 1.2-1.2 1.2z"/></svg> },
  { name: "Netflix", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity"><path d="M5.398 22.396v-20.8h2.8l7.6 15.6v-15.6h2.8v20.8h-2.8l-7.6-15.6v15.6h-2.8z"/></svg> },
  { name: "Adobe", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity"><path d="M15.1 2H22v20L15.1 2zM8.9 2H2v20L8.9 2zM12 9.4l4.5 12.6h-2.6l-1.9-5.4H8l-1.9 5.4H3.5L12 9.4z"/></svg> },
  { name: "Tesla", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity"><path d="M12 2.1c-5.5 0-9.9 4.4-9.9 9.9s4.4 9.9 9.9 9.9 9.9-4.4 9.9-9.9-4.4-9.9-9.9-9.9zM12 20.2c-4.5 0-8.1-3.6-8.1-8.1s3.6-8.1 8.1-8.1 8.1 3.6 8.1 8.1-3.6 8.1-8.1 8.1zM11.1 5.9h1.8v10.2h-1.8V5.9z"/></svg> },
  { name: "Stripe", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity"><path d="M11.988 23.959c-6.617 0-11.977-5.36-11.977-11.977 0-6.618 5.36-11.98 11.977-11.98 6.618 0 11.978 5.362 11.978 11.98 0 6.617-5.36 11.977-11.978 11.977zm0-22.395c-5.743 0-10.418 4.675-10.418 10.418s4.675 10.418 10.418 10.418 10.419-4.675 10.419-10.418S17.73 1.564 11.988 1.564z"/></svg> },
  { name: "PayPal", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity"><path d="M19.16 7.64c-1.12-3.1-4.78-3.92-7.85-3.92h-4.88c-.62 0-1.16.46-1.28 1.07l-2.45 15.5c-.06.39.24.73.64.73h3.58c.55 0 1.02-.41 1.13-.95l.84-5.33c.1-.64.65-1.11 1.31-1.11h1.36c3.48 0 6.54-1.4 7.37-5.5.21-1.04.14-2.14-.77-3.04-.54-.53-1.3-.87-2.13-1.05zM16.48 10.84c-.45 2.87-2.67 2.87-4.76 2.87h-1.62c-.28 0-.52.21-.57.48l-.51 3.25h-2.31l1.1-7.01c.05-.33.34-.58.68-.58h2.8c1.39 0 3.3.11 3.84 1.34.34.78.18 1.76-.11 2.6z"/></svg> }
];

export function PartnersMarquee() {
  // We duplicate the array to ensure continuous scrolling
  const marqueeItems = [...COMPANY_LOGOS, ...COMPANY_LOGOS, ...COMPANY_LOGOS];

  return (
    <section className="py-12 border-y border-brand-200 dark:border-brand-900 bg-brand-50/50 dark:bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-center text-xs font-bold text-brand-400 tracking-widest uppercase">
          Trusted by Top Companies Worldwide
        </p>
      </div>

      <div className="relative flex overflow-hidden group">
        {/* Left Gradient Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brand-50/50 dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        
        {/* Right Gradient Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-brand-50/50 dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        {/* Marquee Content */}
        <motion.div 
          className="flex whitespace-nowrap w-max gap-16 pr-16 items-center"
          animate={{ x: "-33.33%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20
          }}
        >
          {marqueeItems.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="flex items-center gap-3 text-brand-300 dark:text-brand-800 hover:text-brand-900 dark:hover:text-white transition-colors duration-300 cursor-default"
            >
              {company.svg}
              <span className="text-2xl font-bold">{company.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
