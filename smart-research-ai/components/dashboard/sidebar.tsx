"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Search,
    FolderOpen,
    Upload,
    MessageSquare,
    History,
    Settings,
    Menu
} from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Search, label: "Search", href: "/dashboard/search" },
    { icon: FolderOpen, label: "Projects", href: "/dashboard/projects" },
    { icon: Upload, label: "Upload", href: "/dashboard/upload" },
    { icon: MessageSquare, label: "Chat", href: "/dashboard/chat" },
    { icon: History, label: "Logs", href: "/dashboard/logs" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 h-full border-r bg-sidebar", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-sidebar-foreground">
                        Smart Research
                    </h2>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
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
        </div>
    )
}

export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
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
