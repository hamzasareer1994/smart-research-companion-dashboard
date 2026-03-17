"use client"

import { motion } from "framer-motion"

export function ProFeaturesSection() {
    return (
        <section id="pro" className="bg-paper px-[5%] py-24">
            <div className="max-w-[1200px] mx-auto">
                <div className="mb-12">
                    <p className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-gold mb-3">Pro plan — $35/month</p>
                    <h2 className="text-4xl md:text-[3.25rem] font-serif font-normal leading-[1.15] tracking-[-0.02em] text-ink">
                        For researchers who need<br /><em className="italic text-accent-bright">every advantage</em>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <ul className="list-none flex flex-col">
                        {[
                            { icon: "🔬", title: "Auto Systematic Literature Review (SLR)", desc: "Fetches 300+ papers, AI-screens for relevance, generates PRISMA diagram, synthesizes findings." },
                            { icon: "✅", title: "Citation Integrity Scanner", desc: "Paste your manuscript draft — AI verifies every citation claim against your actual papers." },
                            { icon: "💡", title: "Hypothesis Generator", desc: "Surfaces novel research questions by connecting disparate findings across your project library." },
                            { icon: "📊", title: "Statistical Testing Engine", desc: "Validates your methodology and suggests the correct statistical tests for your dataset." }
                        ].map((item, i) => (
                            <li key={i} className="flex gap-4 items-start py-5 border-b border-paper-border last:border-0">
                                <div className="w-9 h-9 rounded-[10px] bg-paper-mid flex-shrink-0 flex items-center justify-center text-lg">{item.icon}</div>
                                <div>
                                    <h4 className="text-[0.9rem] font-medium text-ink mb-1">{item.title}</h4>
                                    <p className="text-[0.8rem] text-ink-muted leading-[1.55]">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="bg-ink rounded-[18px] p-10 text-paper">
                        <p className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-gold-light mb-4">Pro exclusive</p>
                        <h3 className="text-[2rem] font-serif font-normal leading-tight text-paper mb-3">Knowledge Graph of Papers</h3>
                        <p className="text-[0.875rem] text-paper/55 leading-[1.65] mb-8">
                            Visualize your entire research field as an interactive web. edges represent citations, supports, or contradictions.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {['Force-directed D3.js', 'Theme Clustering', 'Contradiction Highlight', 'Timeline Filter'].map(tag => (
                                <span key={tag} className="bg-white/10 border border-white/10 rounded-full px-3 py-1 text-[0.75rem] text-paper/70">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="h-[120px] rounded-[10px] bg-white/5 flex items-center justify-center text-[0.75rem] text-white/20 border border-white/10">
                            Graph Visualization UI
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
