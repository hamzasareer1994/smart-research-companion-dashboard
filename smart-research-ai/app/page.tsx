import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero"
import { FeaturesSection } from "@/components/landing/features"
import { PricingSection } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
