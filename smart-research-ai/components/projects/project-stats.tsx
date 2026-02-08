"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, TrendingUp, Award, Clock } from "lucide-react"

interface ProjectStatsProps {
    stats: {
        totalPapers: number
        totalCitations: number
        topAuthor: string
        citationVelocity: number
        avgYear: number
    }
}

export function ProjectStatisticsCard({ stats }: ProjectStatsProps) {
    const items = [
        {
            label: "Total Papers",
            value: stats.totalPapers,
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Total Citations",
            value: stats.totalCitations.toLocaleString(),
            icon: Award,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        },
        {
            label: "Impact Velocity",
            value: `${stats.citationVelocity}/yr`,
            icon: TrendingUp,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            label: "Avg. Publication",
            value: Math.round(stats.avgYear),
            icon: Clock,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
                <Card key={i} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                            {item.label}
                        </CardTitle>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono">{item.value}</div>
                        <div className="mt-2 h-1 w-full bg-muted rounded-full">
                            <div className={`h-full ${item.bg.replace('/10', '')} rounded-full opacity-30`} style={{ width: '60%' }} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
