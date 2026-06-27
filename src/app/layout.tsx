import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "InterNexa — Bridge the Gap Between Learning and Leading",
  description:
    "InterNexa is a premium AI-powered EdTech platform offering 200+ industry-relevant virtual internships across 35+ domains. Get certified, build projects, and launch your career with expert mentorship.",
  keywords: [
    "internship",
    "online internship",
    "virtual internship",
    "AI internship",
    "machine learning",
    "web development",
    "data science",
    "certification",
    "edtech",
    "InterNexa",
    "learn coding",
    "career development",
  ],
  authors: [{ name: "InterNexa" }],
  openGraph: {
    title: "InterNexa — Bridge the Gap Between Learning and Leading",
    description:
      "Premium AI-powered internship platform with 200+ programs, expert mentors, and industry-recognized certificates.",
    type: "website",
    locale: "en_IN",
    siteName: "InterNexa",
  },
  twitter: {
    card: "summary_large_image",
    title: "InterNexa — AI-Powered Internship Platform",
    description:
      "200+ internships, 35+ domains, expert mentors. Start your career journey today.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { AntiInspect } from "@/components/security/AntiInspect";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <AntiInspect />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
