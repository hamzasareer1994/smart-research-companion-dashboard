"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Network, MessageSquareText, FileSearch, PenTool } from "lucide-react"

const features = [
    {
        title: "Literature Search",
        description: "Visualize connections between papers with our semantic graph engine.",
        icon: Network,
        className: "md:col-span-2",
    },
    {
        title: "Chat with Papers",
        description: "Context-aware answers cited directly from your PDF.",
        icon: MessageSquareText,
        className: "md:col-span-1",
    },
    {
        title: "Insight Extraction",
        description: "Automatically extract tables, figures, and key findings.",
        icon: FileSearch,
        className: "md:col-span-1",
    },
    {
        title: "Writing Assistant",
        description: "Draft literature reviews with AI-powered suggestions.",
        icon: PenTool,
        className: "md:col-span-2",
    },
]

export function FeaturesSection() {
    return (
        <section id="features" className="container py-24 space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <Badge variant="outline" className="rounded-full">Workflow</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    The Modern Academic Workflow
                </h2>
                <p className="text-muted-foreground text-lg">
                    Replace scattered tools with one cohesive research engine.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={feature.className}
                    >
                        <Card className="h-full bg-card/50 backdrop-blur-sm border-muted/40 hover:bg-muted/40 transition-colors">
                            <CardHeader>
                                <feature.icon className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Visual Placeholder */}
                                <div className="h-32 rounded-lg bg-muted/20 border border-muted-foreground/10 w-full" />
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
