"use client"

import { useUserStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, FlaskConical, CheckCircle2, Network, Mic, BarChart2, Users, BookOpen, Lightbulb } from "lucide-react"
import Link from "next/link"

const PRO_FEATURES = [
    {
        icon: BookOpen,
        title: "Auto Systematic Literature Review (SLR)",
        desc: "Fetches 300+ papers, AI-screens abstracts for relevance, classifies include/exclude with reasons, builds a PRISMA flow diagram, and synthesizes findings into a structured literature review.",
        badge: "Most powerful",
        color: "text-accent",
        bg: "bg-accent-light",
    },
    {
        icon: CheckCircle2,
        title: "Citation Integrity Scanner",
        desc: "Paste your manuscript draft and the AI verifies every citation claim against your actual paper library. Each claim is marked verified ✅, misinterpreted ❌, or partially correct ⚠️.",
        badge: "Peer review ready",
        color: "text-teal",
        bg: "bg-teal-bg",
    },
    {
        icon: Lightbulb,
        title: "Hypothesis Generator",
        desc: "Analyzes your entire project library to surface novel research questions. Each hypothesis includes supporting evidence (cited papers), the gap identified, and suggested experiments.",
        badge: "Novel insights",
        color: "text-gold",
        bg: "bg-gold-bg",
    },
    {
        icon: Network,
        title: "Knowledge Graph of Papers",
        desc: "Builds an interactive force-directed graph from your papers. Nodes are papers and concepts; edges represent citations, supports, or contradictions. Filter by year, concept, or citation count.",
        badge: "Visual intelligence",
        color: "text-purple",
        bg: "bg-purple-bg",
    },
    {
        icon: Mic,
        title: "Qualitative Interview Analysis",
        desc: "Upload interview transcripts (text or PDF). AI extracts themes, codes categories, performs thematic coding with MISTRAL Heavy, and outputs a full code book with supporting quotes.",
        badge: "Qualitative research",
        color: "text-accent",
        bg: "bg-accent-light",
    },
    {
        icon: BarChart2,
        title: "Statistical Testing Engine",
        desc: "Input your study design, sample size, variables, and test type. AI validates methodology, checks statistical power and sample size adequacy, flags confounding variables, and suggests correct tests.",
        badge: "Methodology",
        color: "text-teal",
        bg: "bg-teal-bg",
    },
    {
        icon: Users,
        title: "Reviewer Simulator",
        desc: "Takes your manuscript text and simulates 2–3 peer reviewers with distinct expert personas (methodological, theoretical, domain expert). Each reviewer gives strengths, weaknesses, questions, and recommendation.",
        badge: "Pre-submission",
        color: "text-gold",
        bg: "bg-gold-bg",
    },
]

export default function ProPage() {
    const { user } = useUserStore()
    const isPro = user?.tier === "pro"

    return (
        <div className="p-6 md:p-10 space-y-10 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-5 w-5 text-gold" />
                        <Badge className="bg-gold text-white border-0">Pro Exclusive</Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif text-ink">
                        Pro Benefits
                    </h1>
                    <p className="text-ink3 mt-2">
                        7 advanced AI features exclusively for Pro subscribers. $35/month — unlimited usage.
                    </p>
                </div>
                {!isPro && (
                    <Button className="bg-accent text-white hover:opacity-90 rounded-full px-6 shrink-0" disabled>
                        Upgrade to Pro — Coming Soon
                    </Button>
                )}
            </div>

            {isPro && (
                <div className="bg-teal-bg border border-teal/20 rounded-2xl p-4 flex items-center gap-3">
                    <FlaskConical className="h-5 w-5 text-teal shrink-0" />
                    <p className="text-sm text-teal-text font-medium">You are on Pro — all features below are available to you.</p>
                </div>
            )}

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PRO_FEATURES.map((feat) => {
                    const Icon = feat.icon
                    return (
                        <div
                            key={feat.title}
                            className="bg-surface border border-border rounded-2xl p-6 space-y-3 hover:shadow-md hover:border-accent/20 transition-all"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${feat.bg} ${feat.color}`}>
                                    <Icon size={20} />
                                </div>
                                <Badge variant="outline" className="text-[0.65rem] shrink-0">{feat.badge}</Badge>
                            </div>
                            <h3 className="font-semibold text-ink text-[0.95rem] leading-snug">{feat.title}</h3>
                            <p className="text-sm text-ink3 leading-relaxed">{feat.desc}</p>
                            {isPro ? (
                                <Badge className="bg-teal-bg text-teal-text border-0 text-xs">Available on your plan</Badge>
                            ) : (
                                <Badge variant="secondary" className="text-xs">Requires Pro</Badge>
                            )}
                        </div>
                    )
                })}
            </div>

            {!isPro && (
                <div className="bg-gradient-to-br from-accent to-[#2E6EAD] rounded-2xl p-8 text-white text-center space-y-4">
                    <Crown className="h-10 w-10 text-gold mx-auto" />
                    <h2 className="text-2xl font-serif">Unlock all 7 Pro features</h2>
                    <p className="text-white/70 max-w-md mx-auto text-sm leading-relaxed">
                        Get unlimited access to every AI feature — no credit tracking, no limits — plus the 7 exclusive Pro tools above.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <Button className="bg-gold text-white hover:opacity-90 rounded-full px-8" disabled>
                            Upgrade to Pro — $35/month (Coming Soon)
                        </Button>
                        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full" asChild>
                            <Link href="/dashboard/billing">View Billing</Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
