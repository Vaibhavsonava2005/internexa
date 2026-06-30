import { Metadata } from "next";
import { InviteClient } from "./InviteClient";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://internexalabs.online";

  return {
    title: "🚀 Join InterNexa Labs - Premium AI Internships",
    description: "You've been invited! Get instant access to 35+ domains, ISO-verified certificates, real-world projects, and expert 1-on-1 mentorship.",
    openGraph: {
      title: "🚀 Join InterNexa Labs - Premium AI Internships",
      description: "You've been invited! Get instant access to 35+ domains, ISO-verified certificates, real-world projects, and expert 1-on-1 mentorship.",
      url: `${baseUrl}/invite/${code}`,
      siteName: "InterNexa Labs",
      images: [
        {
          url: `${baseUrl}/referral_og_banner.png`, // Must match the image we generated
          width: 1200,
          height: 630,
          alt: "Join InterNexa Labs",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "🚀 Join InterNexa Labs - Premium AI Internships",
      description: "You've been invited! Get instant access to 35+ domains, ISO-verified certificates, real-world projects, and expert 1-on-1 mentorship.",
      images: [`${baseUrl}/referral_og_banner.png`],
    },
  };
}

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <InviteClient code={code} />;
}
