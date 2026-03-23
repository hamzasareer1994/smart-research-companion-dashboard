"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface UsageBarProps {
    usage: number // Percentage 0 - 100
    label?: string
    showPercentage?: boolean
    className?: string
}

const getColor = (usage: number) => {
    if (usage <= 25) return "bg-green-500"
    if (usage <= 50) return "bg-lime-500"
    if (usage <= 75) return "bg-orange-400"
    if (usage <= 90) return "bg-rose-700" // Maroon/Deep Rose
    return "bg-red-600"
}

export function UsageBar({ usage, label, showPercentage = true, className }: UsageBarProps) {
    const clampedUsage = Math.min(100, Math.max(0, usage))
    const colorClass = getColor(clampedUsage)

    return (
        <div className={cn("space-y-1.5 w-full", className)}>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider opacity-70">
                <span>{label || "Token Usage"}</span>
                {showPercentage && <span>{clampedUsage}%</span>}
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-muted-foreground/5 p-[1px]">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]",
                        colorClass
                    )}
                    style={{ width: `${clampedUsage}%` }}
                />
            </div>
        </div>
    )
}
