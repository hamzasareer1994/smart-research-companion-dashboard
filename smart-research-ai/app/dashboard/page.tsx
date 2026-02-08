"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Activity, CreditCard, FileText, Users, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/store"
import { projectService } from "@/services/project"
import { userService } from "@/services/user"

export default function DashboardOverview() {
    const { user } = useUserStore()
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        projects: 0,
        papers: 0,
        actions: 0
    })
    const [quotas, setQuotas] = useState<any>(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.access_token) return
            try {
                const [projects, quotaData] = await Promise.all([
                    projectService.getProjects(),
                    userService.getQuotas(user.access_token)
                ])

                setQuotas(quotaData)
                setStats({
                    projects: projects.length,
                    papers: projects.reduce((acc: number, p: any) => acc + (p.paper_count || 0), 0),
                    actions: (quotaData.abstract?.used || 0) + (quotaData.insights?.used || 0)
                })
                setRecentActivity([])
            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDashboardData()
    }, [user?.access_token])

    const maxCredits = user?.tier === "student" ? 128000 : user?.tier === "professor" ? 500000 : 1000000
    const creditPercentage = Math.min(((user?.credits || 0) / maxCredits) * 100, 100)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                        Refreshed just now
                    </Badge>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Credits
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono">
                            {user?.credits?.toLocaleString() || "128,000"}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000"
                                    style={{ width: `${creditPercentage}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                {creditPercentage.toFixed(0)}%
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Projects
                        </CardTitle>
                        <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.projects}</div>
                        <p className="text-xs text-muted-foreground">
                            On <span className="capitalize">{user?.tier || 'student'}</span> plan
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Papers Analyzed
                        </CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.papers}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all projects
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            AI Actions
                        </CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.actions}</div>
                        <p className="text-xs text-muted-foreground">
                            Summaries & Insights
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your latest research interactions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4 animate-pulse">
                                        <div className="h-10 w-10 rounded-full bg-muted" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-3 bg-muted rounded w-1/3" />
                                            <div className="h-2 bg-muted rounded w-1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {recentActivity.map((i) => (
                                    <div key={i} className="flex items-center group cursor-pointer hover:bg-muted/50 p-2 rounded-xl transition-colors">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                Deep Learning Review_v{i}.pdf
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Uploaded to "Vision AI" • {i * 2}h ago
                                            </p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px]">
                                                +{i * 10} credits
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Activity className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                <h3 className="text-lg font-semibold">No activity yet</h3>
                                <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-2">
                                    Start by creating a project or uploading a research paper.
                                </p>
                                <div className="flex gap-2 mt-6">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/dashboard/upload">Upload Paper</Link>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/dashboard/projects">View Projects</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Research Shortcuts</CardTitle>
                        <CardDescription>
                            Jump back into your work.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-dashed hover:border-primary/50 group" asChild>
                            <Link href="/dashboard/search">
                                <div className="p-1.5 rounded-lg bg-orange-500/10 mr-3 group-hover:bg-orange-500/20 transition-colors">
                                    <Activity className="h-4 w-4 text-orange-600" />
                                </div>
                                <span>Continue latest search</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-dashed hover:border-primary/50 group" asChild>
                            <Link href="/dashboard/chat">
                                <div className="p-1.5 rounded-lg bg-purple-500/10 mr-3 group-hover:bg-purple-500/20 transition-colors">
                                    <Activity className="h-4 w-4 text-purple-600" />
                                </div>
                                <span>Resume AI conversation</span>
                            </Link>
                        </Button>
                        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                            <h4 className="text-sm font-bold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Researcher Tip
                            </h4>
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                You can now sync your papers across devices using the new storage integration.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
