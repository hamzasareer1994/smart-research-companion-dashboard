import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero"
import { FeaturesStrip } from "@/components/landing/strip"
import { ProblemSection } from "@/components/landing/problem"
import { FeaturesSection } from "@/components/landing/features"
import { PipelineSection } from "@/components/landing/pipeline"
import { ProFeaturesSection } from "@/components/landing/pro-features"
import { PricingSection } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-paper selection:bg-gold-light/30">
        <Navbar />
        <main className="flex-1">
            <HeroSection />
            <FeaturesStrip />
            <ProblemSection />
            <FeaturesSection />
            <PipelineSection />
            <ProFeaturesSection />
            <PricingSection />
        </main>
        <Footer />
    </div>
  );
}
