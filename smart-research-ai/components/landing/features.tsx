"use client"

import { motion } from "framer-motion"

export function FeaturesSection() {
    return (
        <section id="features" className="px-[5%] py-24">
            <div className="max-w-[1200px] mx-auto">
                <div className="max-w-[620px] mb-16">
                    <p className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-gold mb-3">What we do</p>
                    <h2 className="text-4xl md:text-[3.25rem] font-serif font-normal leading-[1.15] tracking-[-0.02em] text-ink">
                        Every tool a researcher<br /><em className="italic text-accent-bright">actually needs</em>
                    </h2>
                    <p className="text-[1.05rem] font-light leading-[1.7] text-ink-muted mt-4">
                        9 PAYG features + 7 Pro-exclusive tools. Built for the full research lifecycle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white border border-paper-border rounded-[18px] p-7 transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(13,15,18,0.06)] md:col-span-2 bg-accent text-white border-accent"
                    >
                        <span className="text-[0.7rem] font-medium tracking-[0.08em] uppercase text-white/90 mb-4 block">Core intelligence</span>
                        <h3 className="text-[1.35rem] font-serif font-normal leading-[1.3] text-white/90 mb-2">Chat with your entire paper library</h3>
                        <p className="text-[0.875rem] leading-[1.65] text-white/60">
                            Upload PDFs, and ask anything. Our RAG engine finds the right passages from the right papers instantly — no more ctrl+F across 40 tabs.
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[0.7rem] font-medium mt-4">
                            ⚡ Mistral Light — fast answers
                        </span>
                        
                        <div className="mt-6 bg-white/10 rounded-[10px] h-[100px] flex items-center justify-center text-[0.75rem] text-white/40 overflow-hidden px-4">
                            <div className="w-full">
                                <div className="bg-white/10 rounded-lg p-3 text-left mb-2 text-white/50">You — What do papers #3 and #7 say about transformer attention?</div>
                                <div className="bg-white/20 rounded-lg p-3 text-left text-white/70">AI — Paper #3 (Vaswani et al.) introduces scaled dot-product attention…</div>
                            </div>
                        </div>
                    </motion.div>

                    {[
                        { 
                            tag: "Discovery", 
                            title: "Academic search from 5 sources", 
                            desc: "arXiv, Semantic Scholar, CrossRef, PubMed, and OpenAlex — deduplicated by DOI into one clean result set.", 
                            pill: "Free for all users" 
                        },
                        { 
                            tag: "Analysis", 
                            title: "Literature Mapping Engine", 
                            desc: "Clusters your papers by theme, surfaces contradictions, and maps citation relationships in an interactive graph.", 
                            pill: "40¢ per generation", 
                            pillGold: true 
                        },
                        { 
                            tag: "Writing", 
                            title: "AI Paper Writing Assistant", 
                            desc: "Generate full sections — intro, literature review, methodology, discussion — with proper citations from your own library.", 
                            pill: "50¢ per section", 
                            pillGold: true 
                        },
                        { 
                            tag: "Discovery", 
                            title: "Dataset Discovery Engine", 
                            desc: "Searches Kaggle, HuggingFace, Zenodo, Figshare, and Google Datasets — all in one query.", 
                            pill: "10¢ per search" 
                        },
                        { 
                            tag: "Planning", 
                            title: "Grant Proposal Generator", 
                            desc: "Significance, methodology, budget justification, impact — structured sections built from your research context.", 
                            pill: "50¢ per section", 
                            pillGold: true 
                        }
                    ].map((feat, i) => (
                        <motion.div 
                            key={feat.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-white border border-paper-border rounded-[18px] p-7 transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(13,15,18,0.06)]"
                        >
                            <span className="text-[0.7rem] font-medium tracking-[0.08em] uppercase text-ink-faint mb-4 block">{feat.tag}</span>
                            <h3 className="text-[1.35rem] font-serif font-normal leading-[1.3] text-ink mb-2">{feat.title}</h3>
                            <p className="text-[0.875rem] leading-[1.65] text-ink-muted">{feat.desc}</p>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-medium mt-4 ${feat.pillGold ? 'bg-[#FDF3E0] text-gold' : 'bg-teal-light text-teal'}`}>
                                {feat.pill}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
