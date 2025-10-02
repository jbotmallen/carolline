import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ContactSection } from "@/components/landing/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen pt-16">
      <HeroSection />
      <FeaturesSection />
      <ContactSection />
    </main>
  );
}
