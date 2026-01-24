import EmpathySection from "@/components/landing/EmpathySection";
import Hero from "@/components/landing/Hero";
import HeroSupport from "@/components/landing/HeroSupport";
import HowItWorks from "@/components/landing/HowItWorks";
import HowItWorksExtended from "@/components/landing/HowItWorksExtended";
import ScoringLogicSection from "@/components/landing/ScoringLogicSection";
import TrustSection from "@/components/landing/TrustSection";
import ValueSection from "@/components/landing/ValueSection";
import WhyThisPlatform from "@/components/landing/WhyThisPlatform";

export default function Home() {
  return (
    <div className="min-h-screen bg-white" id="home-v2">
      <main>
        <Hero />
        <HowItWorks />
        <ScoringLogicSection />
        <HeroSupport />
        <ValueSection />
        <HowItWorksExtended />
        <EmpathySection />
        <WhyThisPlatform />
        <TrustSection />
      </main>
    </div>
  );
}
