import LandingNavbar from "./LandingNavbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import SecuritySection from "./SecuritySection";
import CTASection from "./CTASection";
import LandingFooter from "./LandingFooter";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <SecuritySection />
      <CTASection />
      <LandingFooter />
    </main>
  );
}