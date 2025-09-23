import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TemplatesSection } from "@/components/sections/TemplatesSection";
import { NavHeader } from "@/components/layout/NavHeader";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TemplatesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;