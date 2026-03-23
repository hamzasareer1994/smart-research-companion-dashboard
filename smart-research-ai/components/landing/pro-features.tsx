"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const PRO_FEATURES = [
    {
        icon: "🔬",
        title: "Auto Systematic Literature Review (SLR)",
        desc: "Fetches 300+ papers, AI-screens for relevance, generates PRISMA diagram, synthesizes findings.",
    },
    {
        icon: "✅",
        title: "Citation Integrity Scanner",
        desc: "Paste your manuscript draft — AI verifies every citation claim against your actual papers.",
    },
    {
        icon: "💡",
        title: "Hypothesis Generator",
        desc: "Surfaces novel research questions by connecting disparate findings across your project library.",
    },
    {
        icon: "🕸️",
        title: "Knowledge Graph of Papers",
        desc: "Visualize your entire research field as an interactive web — citations, supports, contradictions.",
    },
    {
        icon: "🎙️",
        title: "Qualitative Interview Analysis",
        desc: "Upload transcripts — AI performs thematic coding, builds code books and theme hierarchies.",
    },
    {
        icon: "📊",
        title: "Statistical Testing Engine",
        desc: "Validates your methodology and suggests the correct statistical tests for your dataset.",
    },
    {
        icon: "🧑‍⚖️",
        title: "Reviewer Simulator",
        desc: "Simulate 2–3 peer reviewers on your manuscript draft, each with distinct expert personas.",
    },
]

export function ProFeaturesSection() {
    return (
        <section id="pro" className="bg-paper px-[5%] py-24">
            <div className="max-w-[1200px] mx-auto">
                <div className="mb-14">
                    <p className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-gold mb-3">Pro plan — $35/month</p>
                    <h2 className="text-4xl md:text-[3.25rem] font-serif font-normal leading-[1.15] tracking-[-0.02em] text-ink">
                        For researchers who need<br /><em className="italic text-accent-bright">every advantage</em>
                    </h2>
                    <p className="text-[1.05rem] font-light leading-[1.7] text-ink-muted mt-4 max-w-[520px]">
                        7 exclusive AI features only available on Pro. Unlimited usage — no credit tracking.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                    {PRO_FEATURES.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.07 }}
                            className={`bg-white border border-paper-border rounded-[16px] p-6 transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(13,15,18,0.06)] ${i === 3 ? "md:col-span-2 lg:col-span-1" : ""}`}
                        >
                            <div className="w-10 h-10 rounded-[10px] bg-paper-mid flex items-center justify-center text-xl mb-4">
                                {item.icon}
                            </div>
                            <h4 className="text-[0.95rem] font-medium text-ink mb-2 leading-[1.4]">{item.title}</h4>
                            <p className="text-[0.82rem] text-ink-muted leading-[1.6]">{item.desc}</p>
                            <span className="inline-flex items-center gap-1 mt-4 px-2.5 py-1 rounded-full bg-[#1A3A5C]/8 text-[#1A3A5C] dark:bg-accent-light dark:text-accent-text text-[0.68rem] font-medium border border-paper-border">
                                Pro exclusive
                            </span>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                        href="/signup"
                        className="inline-flex items-center justify-center px-8 py-3 rounded-full text-base font-medium border-[1.5px] border-transparent bg-accent text-white hover:opacity-90 transition-all"
                    >
                        Get Pro — $35/month
                    </Link>
                    <Link
                        href="#pricing"
                        className="inline-flex items-center justify-center px-8 py-3 rounded-full text-base font-medium border-[1.5px] border-paper-border text-ink-muted hover:text-ink hover:border-ink-muted transition-all"
                    >
                        Compare plans
                    </Link>
                </div>
            </div>
        </section>
    )
}
