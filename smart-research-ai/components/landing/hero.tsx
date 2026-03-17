"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-[5%] pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_800px_600px_at_50%_0%,rgba(44,110,173,0.06)_0%,transparent_70%),radial-gradient(ellipse_600px_400px_at_10%_80%,rgba(196,132,42,0.05)_0%,transparent_60%),radial-gradient(ellipse_500px_400px_at_90%_60%,rgba(29,140,114,0.04)_0%,transparent_60%)]" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-paper-border bg-paper-mid text-[0.8rem] font-medium text-ink-muted mb-10"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                Now in Public Beta — Join 1,200+ researchers
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-6xl md:text-[6.5rem] font-serif font-normal leading-[1.05] tracking-[-0.02em] text-ink max-w-[900px]"
            >
                Your entire research workflow,<br /><em className="italic text-accent-bright">supercharged by AI</em>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg md:text-xl font-light leading-[1.7] text-ink-muted max-w-[560px] mt-7"
            >
                Upload papers, chat with your library, find contradictions, generate hypotheses, and write faster — all in one platform built for serious researchers.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap justify-center items-center gap-4 mt-10"
            >
                <Link href="/signup" className="inline-flex items-center justify-center px-8 py-3 rounded-full text-base font-medium transition-all no-underline border-[1.5px] border-transparent bg-accent text-white hover:bg-[#0F2840]">
                    Start for free →
                </Link>
                <Link href="#" className="inline-flex items-center justify-center px-8 py-3 rounded-full text-base font-medium transition-all no-underline border-[1.5px] border-paper-border bg-transparent text-ink-muted hover:border-ink-muted hover:text-ink">
                    See a demo
                </Link>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex items-center gap-4 mt-16"
            >
                <div className="flex">
                    {['PK', 'SR', 'AN', 'MB', '+'].map((initial, i) => (
                        <span 
                            key={i} 
                            className={cn(
                                "w-8 h-8 rounded-full bg-paper-mid border-2 border-paper flex items-center justify-center text-[0.65rem] font-medium text-ink-muted -ml-2 first:ml-0",
                                i === 4 && "bg-paper-border"
                            )}
                        >
                            {initial}
                        </span>
                    ))}
                </div>
                <p className="text-[0.8rem] text-ink-muted">
                    <strong className="font-medium text-ink">1,200+ researchers</strong> from 40+ universities trust ResearchAI
                </p>
            </motion.div>
        </section>
    )
}
