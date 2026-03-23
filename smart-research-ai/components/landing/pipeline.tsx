"use client"

import { motion } from "framer-motion"

export function PipelineSection() {
    return (
        <section id="pipeline" className="bg-paper-mid px-[5%] py-24">
            <div className="max-w-[1200px] mx-auto text-center">
                <div className="max-w-[560px] mx-auto mb-14">
                    <p className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-gold mb-3">How it works</p>
                    <h2 className="text-4xl md:text-[3.25rem] font-serif font-normal leading-[1.15] tracking-[-0.02em] text-ink">
                        From paper to <em className="italic text-accent-bright">insight</em> in minutes
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative mt-14">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[1.5rem] left-[12.5%] right-[12.5%] h-[1px] bg-paper-border z-0" />
                    
                    {[
                        { num: 1, title: "Search & Import", desc: "Find papers from 5 academic databases or upload your own PDFs directly." },
                        { num: 2, title: "Process & Embed", desc: "AI extracts text, chunks it, generates embeddings, and stores in Milvus vector DB." },
                        { num: 3, title: "Organize & Analyze", desc: "Use Kanban boards, AI insights, contradiction finders, and literature maps." },
                        { num: 4, title: "Write & Export", desc: "Generate sections, simulate peer review, and export to Word or LaTeX." }
                    ].map((step, i) => (
                        <div key={i} className="relative z-10 px-6">
                            <div className="w-12 h-12 rounded-full bg-white border-[1.5px] border-paper-border flex items-center justify-center font-serif text-lg text-accent mx-auto mb-5 shadow-sm">
                                {step.num}
                            </div>
                            <h3 className="text-base font-medium text-ink mb-1.5">{step.title}</h3>
                            <p className="text-[0.8rem] text-ink-muted leading-[1.55]">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
