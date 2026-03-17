"use client"

import Link from "next/link"

const plans = [
    {
        title: "Pay As You Go",
        price: "20",
        currency: "$",
        period: "one-time credit",
        description: "Full access to all 9 PAYG features. Top up as you need.",
        features: [
            "Literature Mapping Engine",
            "Experiment Planner",
            "Research Trend Predictor",
            "Dataset Discovery Engine",
            "Cross-Paper Contradiction Finder",
            "AI Paper Writing Assistant",
            "Grant Proposal Generator",
            "Smart Reading Mode",
            "Research Timeline Planner",
        ],
        cta: "Get started for free",
        featured: false
    },
    {
        title: "Pro",
        price: "35",
        currency: "$",
        period: "per month",
        description: "Ultimate power for solo researchers and labs.",
        features: [
            "Everything in PAYG",
            "Auto Systematic Literature Review (SLR)",
            "Citation Integrity Scanner",
            "Hypothesis Generator",
            "Knowledge Graph of Papers",
            "Qualitative Interview Analysis",
            "Statistical Testing Engine",
            "Reviewer Simulator",
        ],
        cta: "Go Pro now",
        featured: true
    }
]

export function PricingSection() {
    return (
        <section id="pricing" className="px-[5%] py-24 bg-paper-mid">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center max-w-[560px] mx-auto mb-16">
                    <p className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-gold mb-3">Pricing</p>
                    <h2 className="text-4xl md:text-[3.25rem] font-serif font-normal leading-[1.15] tracking-[-0.02em] text-ink">
                        Invest in your <em className="italic text-accent-bright">intelligence</em>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[860px] mx-auto">
                    {plans.map((plan) => (
                        <div 
                            key={plan.title}
                            className={`rounded-[18px] p-10 border-[1.5px] ${plan.featured ? 'bg-accent border-accent text-white' : 'bg-white border-paper-border text-ink'}`}
                        >
                            <p className={`text-[0.7rem] font-medium tracking-[0.1em] uppercase mb-6 ${plan.featured ? 'text-white/50' : 'text-ink-faint'}`}>
                                {plan.title}
                            </p>
                            
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className={`text-xl font-light ${plan.featured ? 'text-white/60' : 'text-ink-muted'}`}>{plan.currency}</span>
                                <span className={`text-[3.5rem] font-serif leading-none ${plan.featured ? 'text-white' : 'text-ink'}`}>{plan.price}</span>
                            </div>
                            <p className={`text-[0.8rem] mb-8 ${plan.featured ? 'text-white/50' : 'text-ink-faint'}`}>
                                {plan.period}
                            </p>

                            <div className={`h-[1px] mb-6 ${plan.featured ? 'bg-white/10' : 'bg-paper-border'}`} />

                            <ul className="list-none space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className={`flex items-start gap-2 text-[0.85rem] ${plan.featured ? 'text-white/75' : 'text-ink-muted'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${plan.featured ? 'bg-gold' : 'bg-teal'}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link 
                                href="/signup" 
                                className={`block w-full text-center py-3.5 rounded-full text-[0.9rem] font-medium transition-all no-underline border-[1.5px] ${plan.featured ? 'bg-gold border-gold text-white hover:bg-[#A86B1E] hover:border-[#A86B1E]' : 'bg-transparent border-paper-border text-ink hover:border-ink'}`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
