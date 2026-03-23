"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/lib/store"
import { userService } from "@/services/user"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Zap, CheckCircle, ArrowUpRight, Receipt, Loader2 } from "lucide-react"
import Link from "next/link"

const PRO_FEATURES = [
    "Auto Systematic Literature Review (SLR) + PRISMA",
    "Citation Integrity Scanner",
    "Hypothesis Generator",
    "Knowledge Graph of Papers",
    "Qualitative Interview Analysis",
    "Statistical Testing Engine",
    "Reviewer Simulator (2–3 expert personas)",
    "Unlimited usage — no credit tracking",
    "All 9 PAYG features included",
]

interface Transaction {
    id: string
    action: string
    amount_cents: number
    created_at: string
}

const ACTION_LABELS: Record<string, string> = {
    initial_credit: "Welcome Credit",
    pdf_upload: "PDF Upload",
    ai_abstract: "Abstract Generation",
    ai_insights: "Insight Extraction",
    ai_summary: "Summary Generation",
    research_gaps: "Research Gap Analysis",
    chat_message: "Chat Message",
}

export default function BillingPage() {
    const { user, updateCredits } = useUserStore()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const isPro = user?.tier === "pro"
    const balanceCents = user?.credit_balance_cents ?? 0
    const balanceDollars = (balanceCents / 100).toFixed(2)
    const percentage = Math.min(100, (balanceCents / 2000) * 100)

    useEffect(() => {
        if (!user?.access_token) return
        const fetch = async () => {
            try {
                const [quotaData, txData] = await Promise.all([
                    userService.getQuotas(user.access_token),
                    userService.getTransactions(),
                ])
                if (quotaData.credit_balance_cents !== undefined) {
                    updateCredits(quotaData.credit_balance_cents)
                }
                setTransactions(txData.transactions?.slice(0, 10) || [])
            } catch (e) {
                console.error("Failed to load billing data", e)
            } finally {
                setIsLoading(false)
            }
        }
        fetch()
    }, [user?.access_token, updateCredits])

    return (
        <div className="p-6 md:p-10 space-y-10 animate-fade-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Billing &amp; Plan</h1>
                <p className="text-muted-foreground mt-1">Manage your subscription and credits.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Current Plan */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Current plan card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-accent" />
                                    Current Plan
                                </CardTitle>
                                <Badge variant={isPro ? "default" : "secondary"} className="capitalize">
                                    {isPro ? "Pro" : "Pay As You Go"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isPro ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">You have unlimited access to all features.</p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-teal">
                                        <Zap className="h-4 w-4" />
                                        Unlimited usage active
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Credit Balance</span>
                                        <span className="font-bold text-lg">${balanceDollars}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${percentage > 50 ? "bg-teal" : percentage > 20 ? "bg-yellow-500" : "bg-destructive"}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        ${balanceDollars} of $20.00 remaining. Credits are deducted per AI operation.
                                    </p>
                                    <div className="pt-2 flex gap-3">
                                        <Button variant="outline" size="sm" disabled className="text-xs">
                                            Top Up Credits — Coming Soon
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Transaction history */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Receipt className="h-4 w-4" />
                                Recent Transactions
                            </CardTitle>
                            <CardDescription>Last 10 credit operations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
                                </div>
                            ) : transactions.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No transactions yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                            <div>
                                                <p className="text-sm font-medium">{ACTION_LABELS[tx.action] || tx.action}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`text-sm font-semibold ${tx.amount_cents > 0 ? "text-teal" : "text-destructive"}`}>
                                                {tx.amount_cents > 0 ? "+" : ""}${(tx.amount_cents / 100).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-4">
                                <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                                    <Link href="/dashboard/logs">View All Activity <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Upgrade to Pro */}
                {!isPro && (
                    <div>
                        <Card className="border-2 border-accent/20 bg-gradient-to-b from-accent-light to-surface">
                            <CardHeader>
                                <Badge className="w-fit bg-accent text-white mb-2">Pro Plan</Badge>
                                <CardTitle className="text-2xl">$35 / month</CardTitle>
                                <CardDescription>Unlimited usage + 7 exclusive AI features</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-2">
                                    {PRO_FEATURES.map((f) => (
                                        <li key={f} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-teal shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full bg-accent text-white hover:opacity-90 mt-2" disabled>
                                    Upgrade to Pro — Coming Soon
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    Payment integration in progress. Check back soon.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
