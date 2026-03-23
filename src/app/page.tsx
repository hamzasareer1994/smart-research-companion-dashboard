import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, FileText, MessageSquare, BarChart3, Quote, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">Smart Research</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="#features" className="hover:text-zinc-900 dark:hover:text-white transition">Features</Link>
            <Link href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition">Pricing</Link>
            <Link href="#about" className="hover:text-zinc-900 dark:hover:text-white transition">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Powered by AI
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Research at the{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Speed of Thought
            </span>
          </h1>

          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
            The AI ecosystem designed for elite researchers. From literature review to knowledge graphs,
            all in one seamless interface.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8">
                Get Started for Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for the Modern Academic Workflow</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Six features to supercharge your research
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Search className="w-5 h-5" />}
              title="Literature Search"
              description="Search millions of papers across PubMed and arXiv in real-time."
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Knowledge Graphs"
              description="Visualize connections between papers, authors, and concepts."
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5" />}
              title="Data Extraction"
              description="Extract tables, figures, and key findings automatically."
            />
            <FeatureCard
              icon={<MessageSquare className="w-5 h-5" />}
              title="Chat with Papers"
              description="Ask questions about your papers and get cited answers."
            />
            <FeatureCard
              icon={<Quote className="w-5 h-5" />}
              title="Citation Engine"
              description="Generate citations in APA, MLA, Chicago, and more."
            />
            <FeatureCard
              icon={<Users className="w-5 h-5" />}
              title="Writing Assistant"
              description="Draft literature reviews with AI-powered suggestions."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Invest in Your Intelligence</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Simple, transparent pricing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Student"
              price="$0"
              period="/month"
              description="Perfect for getting started"
              features={["100k credits/month", "5 paper uploads", "Basic search", "Community support"]}
              cta="Get Started"
              variant="outline"
            />
            <PricingCard
              title="Academic Pro"
              price="$24"
              period="/month"
              description="For serious researchers"
              features={["1.5M credits/month", "Unlimited uploads", "Advanced search", "Priority support", "Team collaboration"]}
              cta="Upgrade Now"
              variant="primary"
              popular
            />
            <PricingCard
              title="Research Lab"
              price="$89"
              period="/month"
              description="For research teams"
              features={["Unlimited credits", "API access", "Custom integrations", "Dedicated support", "HIPAA compliance"]}
              cta="Contact Sales"
              variant="outline"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium">Smart Research Companion</span>
          </div>
          <p className="text-sm text-zinc-500">© 2026 Smart Research. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  period,
  description,
  features,
  cta,
  variant,
  popular
}: {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  variant: "outline" | "primary";
  popular?: boolean;
}) {
  return (
    <div className={`relative p-6 rounded-xl border ${popular ? "border-blue-500 shadow-lg shadow-blue-500/10" : "border-zinc-200 dark:border-zinc-700"} bg-white dark:bg-zinc-800`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">
          Most Popular
        </div>
      )}
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 mb-4">{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-zinc-500">{period}</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Button
        className={`w-full ${variant === "primary" ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" : ""}`}
        variant={variant === "primary" ? "default" : "outline"}
      >
        {cta}
      </Button>
    </div>
  );
}
