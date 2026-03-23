"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/store"
import { projectService, ProjectResponse } from "@/services/project"
import { useEffect, useState } from "react"
import {
    LayoutGrid,
    Briefcase,
    MessageSquare,
    Search as SearchIcon,
    Network,
    PenTool,
    Zap,
    FileText,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    Menu,
    BookOpen,
    Crown,
    Receipt,
    Upload,
    FlaskConical,
    TrendingUp,
    Database,
    GitCompare,
    CalendarDays,
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

interface SidebarProps {
    isCollapsed: boolean
    toggleCollapse: () => void
    className?: string
}

export function Sidebar({ isCollapsed, toggleCollapse, className }: SidebarProps) {
    const pathname = usePathname()
    const { user } = useUserStore()
    const [projects, setProjects] = useState<ProjectResponse[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const fetchProjects = async () => {
            try {
                const data = await projectService.getProjects()
                setProjects(data)
            } catch (error) {
                console.error("Failed to fetch projects")
            }
        }
        fetchProjects()
    }, [])

    const navItems = [
        { label: "Workspace", type: "label" },
        { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
        { icon: Briefcase, label: "Projects", href: "/dashboard/projects", badge: projects.length || null },
        { icon: MessageSquare, label: "AI Chat", href: "/dashboard/chat" },
        { icon: SearchIcon, label: "Search Papers", href: "/dashboard/search" },
        { icon: Upload, label: "Upload PDFs", href: "/dashboard/upload" },

        { label: "PAYG Tools", type: "label" },
        { icon: Network, label: "Literature Map", href: "/dashboard/lit-map" },
        { icon: FlaskConical, label: "Experiment Planner", href: "/dashboard/experiment" },
        { icon: TrendingUp, label: "Trend Predictor", href: "/dashboard/trends" },
        { icon: Database, label: "Dataset Discovery", href: "/dashboard/datasets" },
        { icon: GitCompare, label: "Contradiction Finder", href: "/dashboard/contradictions" },
        { icon: PenTool, label: "Writing Assistant", href: "/dashboard/writing" },
        { icon: FileText, label: "Grant Proposals", href: "/dashboard/grants" },
        { icon: BookOpen, label: "Smart Reader", href: "/dashboard/reader" },
        { icon: CalendarDays, label: "Timeline Planner", href: "/dashboard/timeline" },

        { label: "Pro Tools", type: "label" },
        { icon: Zap, label: "SLR Engine", href: "/dashboard/slr", premium: true },
        { icon: Crown, label: "Pro Benefits", href: "/dashboard/pro" },

        { label: "Account", type: "label" },
        { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
        { icon: Receipt, label: "Activity Logs", href: "/dashboard/logs" },
    ]

    const creditBalanceCents = user?.credit_balance_cents ?? 0
    const creditBalance = creditBalanceCents / 100
    const totalCents = 2000 // $20 = 2000 cents
    const creditPercentage = Math.min(100, (creditBalanceCents / totalCents) * 100)

    return (
        <aside className={cn(
            "sidebar group/sidebar bg-surface border-r border-border h-screen flex flex-col transition-all duration-300 z-50 overflow-hidden",
            isCollapsed ? "w-[56px]" : "w-[240px]",
            className
        )}>
            {/* Zone 1: Top & Project Picker */}
            <div className="sidebar-top flex items-center h-[58px] px-3 gap-2 border-b border-border transition-all">
                <Link href="/dashboard" className="logo flex items-center gap-2 flex-1 min-w-0">
                    <span className="logo-dot w-[7px] h-[7px] rounded-full bg-gold shrink-0" />
                    {!isCollapsed && (
                        <span className="logo-text font-serif text-[1.1rem] text-accent-text whitespace-nowrap overflow-hidden">
                            Research<em className="italic">AI</em>
                        </span>
                    )}
                </Link>
                <button 
                    onClick={toggleCollapse}
                    className="collapse-btn w-7 h-7 rounded-md border border-border bg-transparent text-ink3 hover:bg-bg2 hover:text-ink flex items-center justify-center shrink-0 transition-all"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {!isCollapsed && mounted && (
                <div className="project-picker p-3 border-b border-border">
                    <Select>
                        <SelectTrigger className="w-full h-8 bg-bg2 border-border text-[0.8rem] rounded-md px-2.5">
                            <SelectValue placeholder="Select Project" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border shadow-2xl">
                            {projects.map(p => (
                                <SelectItem key={p.id} value={p.id} className="text-[0.8rem]">
                                    {p.name}
                                </SelectItem>
                            ))}
                            <SelectItem value="new" className="text-[0.8rem] font-medium text-gold">
                                + New Project
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Zone 2: Navigation */}
            <nav className="sidebar-nav flex-1 py-2 px-3 overflow-y-auto custom-scrollbar">
                {navItems.map((item, idx) => {
                    if (item.label && item.type === "label") {
                        return !isCollapsed ? (
                            <div key={idx} className="nav-section-label text-[0.65rem] font-bold uppercase tracking-wider text-ink4 px-2 mt-4 mb-1">
                                {item.label}
                            </div>
                        ) : <div key={idx} className="h-4" />;
                    }

                    const Icon = item.icon!
                    const isActive = pathname === item.href

                    return (
                        <Link 
                            key={idx}
                            href={item.href || "#"}
                            className={cn(
                                "nav-item flex items-center gap-2.5 p-2 rounded-md transition-all text-ink3 hover:bg-bg2 hover:text-ink min-h-[36px]",
                                isActive && "bg-accent-light text-accent-text font-medium",
                                isCollapsed && "justify-center px-0"
                            )}
                        >
                            <Icon size={16} className={cn("shrink-0", isActive ? "opacity-100" : "opacity-70")} />
                            {!isCollapsed && (
                                <>
                                    <span className="text-[0.82rem]">{item.label}</span>
                                    {item.badge && <span className="ml-auto bg-teal-bg text-teal-text text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                                    {item.premium && <span className="ml-auto bg-gold-bg text-gold-text text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">Pro</span>}
                                </>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Zone 3: Credits Card */}
            {!isCollapsed && (
                <div className="sidebar-footer p-3 border-t border-border">
                    <div className="credits-card bg-bg2 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[0.7rem] font-medium text-ink3">Credits Remaining</span>
                            <span className="text-[0.8rem] font-bold text-ink">${creditBalance.toFixed(2)}</span>
                        </div>
                        <div className="credits-track h-1 bg-border rounded-full overflow-hidden mb-2">
                            <div 
                                className="credits-fill h-full bg-gradient-to-r from-teal to-[#2DB892] transition-all" 
                                style={{ width: `${creditPercentage}%` }}
                            />
                        </div>
                        <div className="text-[0.68rem] text-ink4">
                            ${creditBalance.toFixed(2)} of $20.00 remaining
                        </div>
                        <Link href="/dashboard/billing" className="credits-upgrade block mt-2 text-center bg-gold text-white p-1.5 rounded-md text-[0.75rem] font-medium hover:opacity-90 transition-opacity">
                            Upgrade to Pro →
                        </Link>
                    </div>
                </div>
            )}
        </aside>
    )
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false)
    
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-none w-[240px]">
                <Sidebar isCollapsed={false} toggleCollapse={() => setOpen(false)} className="w-full" />
            </SheetContent>
        </Sheet>
    )
}
