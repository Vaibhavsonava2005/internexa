import { Navbar } from "@/components/marketing/Navbar";
import { HeroSection } from "@/components/marketing/HeroSection";
import { PartnersMarquee } from "@/components/marketing/PartnersMarquee";
import { CategoriesSection } from "@/components/marketing/CategoriesSection";
import { FeaturedInternships } from "@/components/marketing/FeaturedInternships";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { StatsSection } from "@/components/marketing/StatsSection";
import { ProcessSection } from "@/components/marketing/ProcessSection";
import { MentorsSection } from "@/components/marketing/MentorsSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <PartnersMarquee />
      <CategoriesSection />
      <FeaturedInternships />
      <WhyChooseUs />
      <TestimonialsSection />
      <StatsSection />
      <ProcessSection />
      <MentorsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
