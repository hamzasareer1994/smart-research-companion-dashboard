"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
    Briefcase, 
    FileText, 
    Zap, 
    CreditCard, 
    MoreHorizontal, 
    ArrowUpRight, 
    Plus, 
    Search, 
    MessageSquare, 
    Library,
    Clock,
    Sparkles
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/store"
import { projectService, ProjectResponse } from "@/services/project"
import { userService } from "@/services/user"
import { cn } from "@/lib/utils"

export default function DashboardOverview() {
    const { user } = useUserStore()
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        projects: 0,
        papers: 0,
        actions: 0
    })
    const [projects, setProjects] = useState<ProjectResponse[]>([])

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.access_token) return
            try {
                const [projectData, quotaData] = await Promise.all([
                    projectService.getProjects(),
                    userService.getQuotas(user.access_token)
                ])

                setProjects(projectData)
                if (quotaData.credit_balance_cents !== undefined) {
                    useUserStore.getState().updateCredits(quotaData.credit_balance_cents)
                }
                setStats({
                    projects: projectData.length,
                    papers: projectData.reduce((acc: number, p: any) => acc + (p.paper_count || 0), 0),
                    actions: (quotaData.abstract?.used || 0) + (quotaData.insights?.used || 0)
                })
            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDashboardData()
    }, [user?.access_token])

    const creditBalance = (user?.credit_balance_cents || 0) / 100
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const metrics = [
        { label: "Active Projects", value: stats.projects, icon: Briefcase, color: "text-accent", bg: "bg-accent-light" },
        { label: "Papers Analyzed", value: stats.papers, icon: FileText, color: "text-teal", bg: "bg-teal-bg" },
        { label: "AI Actions", value: stats.actions, icon: Zap, color: "text-purple", bg: "bg-purple-bg" },
        { label: "Credits Balance", value: `$${creditBalance.toFixed(2)}`, icon: CreditCard, color: "text-gold", bg: "bg-gold-bg" },
    ]

    return (
        <div className="p-6 md:p-10 space-y-10 animate-fade-up">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif text-ink mb-1">
                        Good morning, <em className="italic">{user?.full_name?.split(' ')[0] || "Researcher"}</em>
                    </h1>
                    <p className="text-ink3 text-[0.9rem] flex items-center gap-2">
                        <Clock size={14} /> {today}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full border-border bg-surface text-ink hover:bg-bg2 transition-all h-10 px-5" asChild>
                        <Link href="/dashboard/projects">View All Projects</Link>
                    </Button>
                    <Button className="rounded-full bg-accent text-white hover:opacity-90 transition-all h-10 px-5 flex items-center gap-2 shadow-lg shadow-accent/20" asChild>
                        <Link href="/dashboard/upload">
                            <Plus size={18} /> New Paper
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, idx) => (
                    <div key={idx} className="metric-card bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-accent/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", m.bg, m.color)}>
                                <m.icon size={20} />
                            </div>
                            <button className="text-ink4 hover:text-ink transition-colors">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                        <div className="text-[0.8rem] font-bold uppercase tracking-wider text-ink4 mb-1">{m.label}</div>
                        <div className="text-2xl font-bold text-ink">{m.value}</div>
                    </div>
                ))}
            </div>

            {/* Main content sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-serif text-ink">Recent Research Activity</h2>
                        <Link href="/dashboard/activity" className="text-[0.8rem] text-gold font-medium hover:underline flex items-center gap-1">
                            View History <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    
                    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                        {isLoading ? (
                            <div className="p-10 text-center space-y-4">
                                <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" />
                                <p className="text-ink4 text-[0.85rem]">Retreiving your latest activity...</p>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="p-10 text-center space-y-4">
                                <div className="w-16 h-16 bg-bg2 rounded-full flex items-center justify-center mx-auto text-ink4">
                                    <Sparkles size={32} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-ink">No activity yet</h3>
                                    <p className="text-ink3 text-[0.85rem] mt-1">Start your research journey by creating your first project.</p>
                                </div>
                                <Button className="bg-gold text-white rounded-full px-6" asChild>
                                    <Link href="/dashboard/projects">Create Project</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {projects.slice(0, 5).map((p, idx) => (
                                    <div key={p.id} className="activity-item p-5 flex items-center gap-4 hover:bg-bg2/50 transition-colors cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full bg-accent-light text-accent flex items-center justify-center shrink-0">
                                            <Briefcase size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[0.85rem] font-bold text-ink truncate group-hover:text-accent transition-colors">{p.name}</span>
                                                <Badge variant="outline" className="text-[0.65rem] border-border text-ink4 bg-bg2">Project</Badge>
                                            </div>
                                            <p className="text-[0.75rem] text-ink4 truncate">
                                                {p.paper_count || 0} papers • Created on {new Date(p.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <ArrowUpRight size={18} className="text-ink4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                ))}
                            </div>
                        )}
                        {projects.length > 5 && (
                            <div className="p-4 bg-bg2/30 text-center border-t border-border">
                                <Link href="/dashboard/projects" className="text-[0.8rem] text-ink3 hover:text-ink transition-colors font-medium">Show {projects.length - 5} more projects</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h2 className="text-xl font-serif text-ink">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <Link href="/dashboard/chat" className="action-btn bg-surface border border-border rounded-xl p-4 flex items-center gap-4 hover:border-gold hover:shadow-md transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-gold-bg text-gold flex items-center justify-center transition-transform group-hover:scale-110">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <div className="text-[0.85rem] font-bold text-ink">Ask AI Assistant</div>
                                <div className="text-[0.7rem] text-ink4">Instant research insights</div>
                            </div>
                        </Link>

                        <Link href="/dashboard/search" className="action-btn bg-surface border border-border rounded-xl p-4 flex items-center gap-4 hover:border-teal hover:shadow-md transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-teal-bg text-teal flex items-center justify-center transition-transform group-hover:scale-110">
                                <Search size={20} />
                            </div>
                            <div>
                                <div className="text-[0.85rem] font-bold text-ink">Search Literature</div>
                                <div className="text-[0.7rem] text-ink4">Find papers in real-time</div>
                            </div>
                        </Link>

                        <Link href="/dashboard/library" className="action-btn bg-surface border border-border rounded-xl p-4 flex items-center gap-4 hover:border-purple hover:shadow-md transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-purple-bg text-purple flex items-center justify-center transition-transform group-hover:scale-110">
                                <Library size={20} />
                            </div>
                            <div>
                                <div className="text-[0.85rem] font-bold text-ink">Paper Library</div>
                                <div className="text-[0.7rem] text-ink4">Organize your readings</div>
                            </div>
                        </Link>

                        {/* Upgrade Promo */}
                        <div className="upgrade-promo bg-gradient-to-br from-accent to-[#2E6EAD] rounded-2xl p-6 text-white overflow-hidden relative group mt-4">
                            <div className="relative z-10">
                                <Badge className="bg-white/20 text-white border-white/30 mb-4 hover:bg-white/30">Pro Account</Badge>
                                <h3 className="text-lg font-bold mb-2 leading-tight">Unlock the SLR Engine™</h3>
                                <p className="text-white/80 text-[0.75rem] mb-5 leading-relaxed">
                                    Automate your Systematic Literature Review with our most powerful AI tools.
                                </p>
                                <Button className="w-full bg-gold hover:bg-gold/90 text-white border-none rounded-xl font-bold py-6 shadow-xl" asChild>
                                    <Link href="/dashboard/billing">Upgrade Now</Link>
                                </Button>
                            </div>
                            {/* Decorative background circle */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
