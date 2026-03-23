"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FolderKanban,
    Upload,
    MessageSquare,
    Clock,
    Settings,
    ChevronLeft,
    ChevronRight,
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
    { label: "Overview", icon: LayoutDashboard, view: "overview" },
    { label: "Projects", icon: FolderKanban, view: "projects" },
    { label: "Activity", icon: Clock, view: "recent" },
    { label: "Upload", icon: Upload, view: "upload" },
    { label: "AI Chat", icon: MessageSquare, view: "chat" },
    { label: "Settings", icon: Settings, view: "settings" },
];

export function Sidebar() {
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view") || "overview";
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-full bg-card border-r border-border/50 text-card-foreground transition-all duration-300 z-50 overflow-hidden flex flex-col shadow-xl",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                </div>
                {!collapsed && (
                    <span className="font-bold text-lg tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        Smart Research
                    </span>
                )}
            </div>

            <nav className="flex-1 px-3 space-y-1.5 py-4">
                {navItems.map((item) => {
                    const isActive = currentView === item.view;
                    return (
                        <Link key={item.view} href={`/dashboard?view=${item.view}`}>
                            <div
                                className={cn(
                                    "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group relative cursor-pointer hover-lift",
                                    isActive
                                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-foreground")} />
                                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                                {isActive && (
                                    <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-primary rounded-r-full shadow-[2px_0_8px_var(--ring)]" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <Button
                    variant="ghost"
                    className="w-full justify-center rounded-xl"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
            </div>
        </aside>
    );
}
