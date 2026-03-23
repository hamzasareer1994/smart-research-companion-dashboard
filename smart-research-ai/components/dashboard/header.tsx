"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Search, Bell, Moon, Sun, ChevronRight, User, Settings, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { MobileSidebar } from "@/components/dashboard/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import Cookies from "js-cookie"

export function DashboardHeader() {
    const { user, clearUser } = useUserStore()
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const handleLogout = () => {
        // Clear cookie
        Cookies.remove("auth-token")
        
        clearUser()
        router.push("/")
    }

    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = segments.map((s, i) => ({
        label: s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' '),
        href: '/' + segments.slice(0, i + 1).join('/')
    }))

    const initials = user?.email
        ? user.email.substring(0, 2).toUpperCase()
        : "SC"

    return (
        <header className="top-bar flex items-center h-[58px] px-6 gap-6 border-b border-border bg-surface sticky top-0 z-40 transition-all">
            <MobileSidebar />
            
            {/* Breadcrumbs */}
            <nav className="breadcrumbs flex items-center gap-2 text-[0.82rem] min-w-0 hidden sm:flex">
                <Link href="/dashboard" className="text-ink4 hover:text-ink transition-colors shrink-0">Dashboard</Link>
                {breadcrumbs.slice(1).map((b, i) => (
                    <React.Fragment key={i}>
                        <ChevronRight size={12} className="text-ink4 shrink-0" />
                        <Link 
                            href={b.href} 
                            className={cn(
                                "transition-colors truncate max-w-[150px]",
                                i === breadcrumbs.length - 2 ? "text-ink font-medium" : "text-ink4 hover:text-ink"
                            )}
                        >
                            {b.label}
                        </Link>
                    </React.Fragment>
                ))}
            </nav>

            {/* Search */}
            <div className="search-box relative flex-1 max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4" size={16} />
                <input 
                    type="text" 
                    placeholder="Search anything (Cmd+K)" 
                    className="w-full h-9 bg-bg2 border border-border rounded-full pl-10 pr-4 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-3 ml-auto">
                {/* Theme Toggle */}
                <button 
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink4 hover:bg-bg2 hover:text-ink transition-all relative"
                >
                    <Sun size={18} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon size={18} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </button>

                {/* Notifications */}
                <button
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink4 hover:bg-bg2 hover:text-ink transition-all relative"
                    title="Notifications coming soon"
                    disabled
                    style={{ opacity: 0.5, cursor: 'default' }}
                >
                    <Bell size={18} />
                </button>

                {/* User Nav */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 pl-4 border-l border-border h-8 transition-all hover:opacity-80">
                            <Avatar className="h-8 w-8 ring-2 ring-border">
                                <AvatarFallback className="bg-accent-light text-accent-text text-[0.7rem] font-bold">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="text-left hidden lg:block">
                                <div className="text-[0.8rem] font-bold text-ink leading-tight">{user?.full_name || "Research Master"}</div>
                                <div className="text-[0.65rem] text-ink3 leading-tight capitalize">{user?.tier || "Student"} Tier</div>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.full_name || "User"}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-text focus:bg-red-bg focus:text-red-text cursor-pointer" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
