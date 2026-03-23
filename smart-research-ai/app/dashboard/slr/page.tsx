"use client"

import { useUserStore } from "@/lib/store"
import { FeatureComingSoon } from "@/components/dashboard/feature-coming-soon"
import { BookOpen, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SLRPage() {
    const { user } = useUserStore()
    const isPro = user?.tier === "pro"

    if (!isPro) {
        return (
            <div className="p-6 md:p-10 animate-fade-up">
                <div className="max-w-xl mx-auto text-center space-y-6 pt-16">
                    <div className="w-16 h-16 rounded-2xl bg-gold-bg flex items-center justify-center mx-auto">
                        <Crown className="h-8 w-8 text-gold" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-ink mb-2">SLR Engine — Pro Feature</h1>
                        <p className="text-ink3 text-sm leading-relaxed">
                            The Auto Systematic Literature Review engine fetches 300+ papers, AI-screens for relevance, generates a PRISMA diagram, and synthesizes a full literature review.
                        </p>
                    </div>
                    <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                        <p className="text-sm font-medium text-ink">This feature requires a Pro subscription ($35/month).</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button className="bg-accent text-white hover:opacity-90 rounded-full" disabled>
                                Upgrade to Pro — Coming Soon
                            </Button>
                            <Button variant="outline" className="rounded-full" asChild>
                                <Link href="/dashboard/pro">View Pro Benefits</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <FeatureComingSoon
            icon={BookOpen}
            title="Auto SLR Engine"
            description="Fetches 300+ papers, AI-screens for relevance, generates a PRISMA diagram, and synthesizes a full systematic literature review."
            tier="pro"
        />
    )
}
