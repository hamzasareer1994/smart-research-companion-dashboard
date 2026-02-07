"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32">
            {/* Background Gradients */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-30 bg-gradient-radial from-primary/50 to-transparent blur-3xl" />
            </div>

            <div className="container flex flex-col items-center text-center gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm">
                        <Sparkles className="mr-2 h-3.5 w-3.5" />
                        Now with Knowledge Graphs
                    </Badge>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="max-w-4xl"
                >
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-7xl">
                        Research at the <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                            Speed of Thought
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-2xl text-muted-foreground text-lg sm:text-xl"
                >
                    <p>
                        The AI research assistant designed for elite academics.
                        From deep literature review to semantic knowledge graphs,
                        all in one seamless interface.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link href="/signup">
                        <Button size="lg" className="gap-2 text-md h-12 px-8 rounded-full shadow-lg shadow-primary/20">
                            Get Started for Free <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="outline" size="lg" className="text-md h-12 px-8 rounded-full">
                            Learn More
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-xs text-muted-foreground mt-4"
                >
                    No credit card required · Free tier available
                </motion.div>
            </div>
        </section>
    )
}
