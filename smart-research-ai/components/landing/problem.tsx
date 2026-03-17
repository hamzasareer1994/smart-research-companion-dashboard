"use client"

import { motion } from "framer-motion"

export function ProblemSection() {
    return (
        <section className="bg-ink text-paper px-[5%] py-24">
            <div className="max-w-[1200px] mx-auto">
                <p className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-gold-light mb-3">The problem</p>
                <h2 className="text-4xl md:text-[3.25rem] font-serif font-normal leading-[1.15] tracking-[-0.02em] text-paper mb-4">
                    Research is broken.<br /><em className="italic text-gold-light">It doesn't have to be.</em>
                </h2>
                <p className="text-[1.05rem] font-light leading-[1.7] text-paper/60 max-w-[520px]">
                    Academics waste 60% of their time on logistics — not discovery. We fix that.
                </p>

                <div className="grid grid-cols-1 min-[260px]:grid-cols-2 lg:grid-cols-4 gap-[1.5px] bg-white/10 border-[1.5px] border-white/10 rounded-[18px] overflow-hidden mt-14">
                    {[
                        { icon: "📚", title: "Drowning in papers", desc: "The average PhD student manages 200+ papers manually. No system, no structure, just folders and despair." },
                        { icon: "🔍", title: "Search that doesn't search", desc: "Keyword search misses semantic meaning. You find what you type, not what you mean." },
                        { icon: "✍️", title: "Writing from scratch", desc: "Literature reviews, grant sections, introductions — all written manually from 50 open browser tabs." },
                        { icon: "⚠️", title: "Missed contradictions", desc: "Two papers in your library contradict each other. You'll find out from a peer reviewer, not yourself." }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#181C24] p-8">
                            <span className="text-2xl mb-4 block">{item.icon}</span>
                            <h3 className="text-xl font-serif font-normal text-paper mb-2">{item.title}</h3>
                            <p className="text-[0.875rem] text-paper/55 leading-[1.65]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
