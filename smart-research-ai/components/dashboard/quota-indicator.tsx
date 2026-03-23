"use client"

import { useEffect } from "react"
import { useUserStore } from "@/lib/store"
import { CreditCard, TrendingDown } from "lucide-react"
import { userService } from "@/services/user"
import Link from "next/link"

export function QuotaIndicator() {
    const { user, updateCredits } = useUserStore()

    useEffect(() => {
        if (!user?.access_token) return

        const fetchBalance = async () => {
            try {
                const data = await userService.getQuotas(user.access_token)
                if (data.credit_balance_cents !== undefined) {
                    updateCredits(data.credit_balance_cents)
                }
            } catch (error) {
                console.error("Failed to fetch credit balance", error)
            }
        }

        fetchBalance()
        const interval = setInterval(fetchBalance, 30000) // refresh every 30s
        return () => clearInterval(interval)
    }, [user?.access_token, updateCredits])

    const balanceCents = user?.credit_balance_cents ?? 0
    const balanceDollars = balanceCents / 100
    const totalDollars = 20
    const percentage = Math.min(100, (balanceDollars / totalDollars) * 100)
    const isPro = user?.tier === "pro"

    const barColor =
        percentage > 50 ? "bg-teal" :
        percentage > 20 ? "bg-yellow-500" :
        "bg-red"

    if (isPro) {
        return (
            <div className="px-4 py-3 flex items-center gap-2 text-[0.75rem] text-ink3">
                <CreditCard size={14} className="text-gold shrink-0" />
                <span className="font-medium text-gold">Pro — Unlimited</span>
            </div>
        )
    }

    return (
        <div className="px-4 py-3 space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-ink4">
                    <CreditCard size={12} />
                    Credits
                </div>
                <span className="text-[0.75rem] font-bold text-ink">${balanceDollars.toFixed(2)}</span>
            </div>
            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-[0.65rem] text-ink4">${balanceDollars.toFixed(2)} / $20.00</span>
                {balanceDollars < 5 && (
                    <Link href="/dashboard/billing" className="text-[0.65rem] text-red font-medium flex items-center gap-0.5 hover:underline">
                        <TrendingDown size={10} /> Low
                    </Link>
                )}
            </div>
        </div>
    )
}
