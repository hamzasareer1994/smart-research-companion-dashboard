"use client"

import { useUserStore, UserTier } from "@/lib/store"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const TIER_LEVELS: Record<UserTier, number> = {
    payg: 1,
    pro: 2,
}

interface FeatureGateProps {
    children: React.ReactNode
    minTier: UserTier
    fallback?: React.ReactNode
    showLock?: boolean
}

export function FeatureGate({
    children,
    minTier,
    fallback,
    showLock = true,
}: FeatureGateProps) {
    const user = useUserStore((state) => state.user)

    const userTier = user?.tier || "payg"
    const currentLevel = TIER_LEVELS[userTier]
    const requiredLevel = TIER_LEVELS[minTier]

    if (currentLevel >= requiredLevel) {
        return <>{children}</>
    }

    if (fallback) {
        return <>{fallback}</>
    }

    if (showLock) {
        return (
            <div className="relative group overflow-hidden rounded-md border border-dashed border-muted-foreground/30 p-6 flex flex-col items-center justify-center text-center space-y-4 bg-muted/10">
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] group-hover:backdrop-blur-[2px] transition-all" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="p-3 bg-muted rounded-full">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">Feature Locked</h3>
                    <p className="text-sm text-muted-foreground max-w-[250px]">
                        This feature requires the <span className="capitalize font-medium text-foreground">{minTier}</span> plan.
                    </p>
                    <Button asChild variant="default" size="sm" className="mt-2">
                        <Link href="/pricing">Upgrade Plan</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return null
}
