"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUserStore, UserTier } from "@/lib/store"
import {
    LayoutDashboard,
    Search,
    FolderOpen,
    Upload,
    MessageSquare,
    History,
    Settings,
    Crown,
    Menu
} from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { QuotaIndicator } from "./quota-indicator"

interface SidebarItem {
    icon: any
    label: string
    href: string
    minTier?: UserTier
}

const TIER_LEVELS: Record<UserTier, number> = {
    student: 1,
    professor: 2,
    researcher: 3,
}

const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Search, label: "Search", href: "/dashboard/search" },
    { icon: FolderOpen, label: "Projects", href: "/dashboard/projects" },
    { icon: Upload, label: "Upload", href: "/dashboard/upload" },
    { icon: MessageSquare, label: "Chat", href: "/dashboard/chat" },
    { icon: History, label: "Logs", href: "/dashboard/logs", minTier: "professor" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const { user } = useUserStore()

    // Tier Check Logic
    const userTier = user?.tier || "student"
    const userLevel = TIER_LEVELS[userTier]

    const filteredItems = sidebarItems.filter(item => {
        if (!item.minTier) return true
        return userLevel >= TIER_LEVELS[item.minTier]
    })

    // Credit Logic
    const maxCredits = userTier === "student" ? 128000 : userTier === "professor" ? 500000 : 1000000
    const currentCredits = user?.credits || 0
    const progress = Math.min((currentCredits / maxCredits) * 100, 100)

    // Reverse progress for "consumption" visual (stars with 100%, goes down)
    // Or "usage" visual (starts with 0%, goes up)?
    // Usually credits mean "balance". So 100% balance is good. 0% is bad.
    // Progress bar usually fills up. So let's show % of credits REMAINING.

    return (
        <div className={cn("pb-12 h-full border-r bg-sidebar flex flex-col", className)}>
            <div className="space-y-4 py-4 flex-1">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-sidebar-foreground">
                        Smart Research
                    </h2>
                    <div className="space-y-1">
                        {filteredItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Credit Status / Plan Badge */}
            <div className="mt-auto border-t bg-muted/10">
                <div className="px-4 py-3 flex items-center gap-2 border-b bg-muted/5">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">{userTier} Plan</span>
                </div>
                <QuotaIndicator />
            </div>
        </div>
    )
}

export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" suppressHydrationWarning>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 text-sidebar-foreground bg-sidebar">
                <Sidebar className="border-none" />
            </SheetContent>
        </Sheet>
    )
}
