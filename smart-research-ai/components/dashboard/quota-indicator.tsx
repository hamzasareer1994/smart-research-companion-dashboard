"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/lib/store"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Zap, Info } from "lucide-react"
import { userService } from "@/services/user"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function QuotaIndicator() {
    const { user, updateCredits } = useUserStore()
    const [quotas, setQuotas] = useState<any>(null)
    const [timeLeft, setTimeLeft] = useState("")

    useEffect(() => {
        if (!user?.access_token) return

        const fetchQuotas = async () => {
            try {
                const data = await userService.getQuotas(user.access_token)
                setQuotas(data)

                // Also update credits in store if different
                // Assuming data_search is the main one we show here if we want but 
                // user requested "AI Credits" (Abstracts/Insights)
            } catch (error) {
                console.error("Failed to fetch quotas", error)
            }
        }

        fetchQuotas()
        const interval = setInterval(fetchQuotas, 60000) // Refresh every minute

        return () => clearInterval(interval)
    }, [user?.access_token])

    // Countdown Timer logic (until end of day or 24h cycle)
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            const tomorrow = new Date()
            tomorrow.setHours(24, 0, 0, 0)
            const diff = tomorrow.getTime() - now.getTime()

            const h = Math.floor(diff / (1000 * 60 * 60))
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const s = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeLeft(`${h}h ${m}m ${s}s`)
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Calculate aggregate usage for "AI Credits" (Abstracts + Insights)
    const abstractUsed = quotas?.abstract?.used ?? 0
    const abstractLimit = quotas?.abstract?.limit ?? 3
    const insightsUsed = quotas?.insights?.used ?? 0
    const insightsLimit = quotas?.insights?.limit ?? 5

    const totalUsed = abstractUsed + insightsUsed
    const totalLimit = abstractLimit + insightsLimit

    // Remaining % for the bar (100% means full bucket)
    const remaining = Math.max(0, totalLimit - totalUsed)
    const percentage = (remaining / totalLimit) * 100

    const getStatusColor = (pct: number) => {
        if (pct > 50) return "bg-primary"
        if (pct > 20) return "bg-yellow-500"
        return "bg-destructive"
    }

    return (
        <div className="px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Usage Highlights
                    </span>
                </div>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-lg font-mono font-bold leading-none cursor-help">
                                        {remaining} / {totalLimit}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="max-w-[200px]">
                                    <div className="space-y-1 text-xs">
                                        <p className="font-semibold">Daily AI Operations Limit</p>
                                        <div className="space-y-0.5 text-muted-foreground">
                                            <p>Abstracts: {abstractUsed}/{abstractLimit}</p>
                                            <p>Insights: {insightsUsed}/{insightsLimit}</p>
                                            <p className="font-medium text-foreground pt-1">Total: {totalUsed}/{totalLimit}</p>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <span className="text-[9px] text-muted-foreground font-medium mt-1">
                            Daily Limits • {totalLimit} Assigned ({user?.tier})
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-primary">
                        {percentage.toFixed(0)}% Left
                    </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${getStatusColor(percentage)}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            <p className="text-[9px] text-muted-foreground leading-tight italic">
                Daily limits resets in <span className="text-foreground font-medium tabular-nums">{timeLeft}</span>
            </p>
        </div>
    )
}
