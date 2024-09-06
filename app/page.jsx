import AgentCreationSteps from "@/components/layout/sections/benefits";
import Faq from "@/components/layout/sections/faq";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import PricingSection from "@/components/layout/sections/pricing";
import { ServicesSection } from "@/components/layout/sections/services";

import Navbar from "@/components/layout/navbar";


export default function Home() {
  return (
    <>
      
     <Navbar />
      <HeroSection />
      <AgentCreationSteps />
     <FeaturesSection />
      <ServicesSection />
     
      <PricingSection />
      <Faq />
      <FooterSection />
    </>
  );
}