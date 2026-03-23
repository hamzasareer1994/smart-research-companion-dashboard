"use client";

import { ThemePicker } from "@/components/theme-picker";
import { UserNav } from "./UserNav";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

export function DashboardHeader() {
    const pathname = usePathname();
    const pageName = pathname.split("/").pop() || "Overview";
    const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

    return (
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
            <div className="flex items-center gap-8 flex-1">
                <h2 className="font-bold text-lg hidden md:block capitalize">{formattedPageName}</h2>
                <div className="relative max-w-sm w-full hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Global research search..."
                        className="pl-10 h-9 bg-muted/40 border-none focus-visible:ring-1"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border-r border-border/50 pr-4 mr-2">
                    <ThemePicker />
                    <button className="p-2 hover:bg-accent hover:text-accent-foreground rounded-full relative transition-all duration-200 hover-lift active:scale-95">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background shadow-sm" />
                    </button>
                </div>
                <UserNav />
            </div>
        </header>
    );
}
