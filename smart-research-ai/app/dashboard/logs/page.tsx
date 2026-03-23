"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/lib/store"
import { userService } from "@/services/user"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Receipt } from "lucide-react"

interface Transaction {
    id: string
    action: string
    amount_cents: number
    metadata: Record<string, unknown>
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
    literature_map: "Literature Mapping",
    experiment_plan: "Experiment Planner",
    trends: "Trend Prediction",
    datasets: "Dataset Discovery",
    contradictions: "Contradiction Finder",
    writing_section: "Paper Writing",
    grant_section: "Grant Proposal",
    smart_read: "Smart Reading Mode",
}

export default function LogsPage() {
    const { user } = useUserStore()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!user?.access_token) return
        const fetch = async () => {
            try {
                const data = await userService.getTransactions()
                setTransactions(data.transactions || [])
            } catch (error) {
                console.error("Failed to fetch transactions", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetch()
    }, [user?.access_token])

    return (
        <div className="p-6 md:p-10 space-y-8 animate-fade-up">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
                <p className="text-muted-foreground">
                    Your credit usage history and account activity.
                </p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                </div>
            ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <Receipt className="h-12 w-12 text-muted-foreground opacity-40" />
                    <p className="text-muted-foreground">No transactions yet.</p>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-medium">
                                        {ACTION_LABELS[tx.action] || tx.action}
                                    </TableCell>
                                    <TableCell>
                                        <span className={tx.amount_cents > 0 ? "text-green-600" : "text-red-500"}>
                                            {tx.amount_cents > 0 ? "+" : ""}${(tx.amount_cents / 100).toFixed(2)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={tx.amount_cents > 0 ? "default" : "secondary"}>
                                            {tx.amount_cents > 0 ? "Credit" : "Deduction"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-sm">
                                        {new Date(tx.created_at).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
