"use client"

import { Construction } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface FeatureComingSoonProps {
    icon: LucideIcon
    title: string
    description: string
    creditCost?: string
    tier?: "payg" | "pro"
}

export function FeatureComingSoon({ icon: Icon, title, description, creditCost, tier = "payg" }: FeatureComingSoonProps) {
    return (
        <div className="p-6 md:p-10 animate-fade-up">
            <div className="max-w-2xl mx-auto text-center space-y-6 pt-16">
                <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mx-auto">
                    <Icon className="h-8 w-8 text-accent" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        <h1 className="text-2xl font-bold text-ink">{title}</h1>
                        {tier === "pro" && (
                            <Badge className="bg-gold text-white border-0">Pro</Badge>
                        )}
                        {creditCost && tier === "payg" && (
                            <Badge variant="outline" className="text-gold border-gold/40 text-xs">{creditCost}</Badge>
                        )}
                    </div>
                    <p className="text-ink3 text-sm leading-relaxed max-w-md mx-auto">{description}</p>
                </div>

                <div className="bg-surface border border-border rounded-2xl p-8 space-y-3">
                    <Construction className="h-8 w-8 text-gold mx-auto" />
                    <p className="font-semibold text-ink">In Development</p>
                    <p className="text-sm text-ink3">
                        This feature is being built as part of Phase 2 & 3. The backend AI pipeline is coming soon.
                    </p>
                </div>
            </div>
        </div>
    )
}
