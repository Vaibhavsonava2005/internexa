import type { Metadata } from "next";
import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReferralTracker, FloatingReferButton } from "@/components/shared";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "InterNexa Labs — Bridge the Gap Between Learning and Leading",
  description:
    "InterNexa Labs is a premium AI-powered EdTech platform offering 200+ industry-relevant virtual internships across 35+ domains. Get certified, build projects, and launch your career with expert mentorship.",
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
    "InterNexa Labs",
    "learn coding",
    "career development",
  ],
  authors: [{ name: "InterNexa Labs" }],
  openGraph: {
    title: "InterNexa Labs | Launch Your Career in AI & Tech",
    description:
      "Join 50,000+ students on InterNexa Labs. Premium AI-powered internships with up to ₹15,000 stipend, guaranteed Letter of Recommendation (LoR), and industry-recognized certificates. Start today!",
    type: "website",
    locale: "en_IN",
    siteName: "InterNexa Labs",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "InterNexa Labs - Launch Your Career",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InterNexa Labs | Premium AI-Powered Internships",
    description:
      "Get up to ₹15,000 stipend, guaranteed LoR, and verified certificates. 200+ programs across 35+ domains. Apply now!",
    images: ["/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "InterNexa Labs",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: import("next").Viewport = {
  themeColor: "#4f46e5",
  width: 1280,
  initialScale: 0.2,
  maximumScale: 5,
  userScalable: true
};

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
            <Suspense fallback={null}>
              <ReferralTracker />
            </Suspense>
            <FloatingReferButton />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
