"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, FileText, Settings, LogOut, Users, User } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
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
import { Badge } from "@/components/ui/badge"
import { useUserStore } from "@/lib/store"

export function DashboardHeader() {
    const { user } = useUserStore()

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-6">
            <MobileSidebar />
            <div className="w-full flex-1">
                {/* Breadcrumb or Search Bar could go here */}
            </div>
            <div className="flex items-center gap-2">
                {user?.tier && (
                    <Badge variant="outline" className="capitalize">
                        {user.tier}
                    </Badge>
                )}
                <ModeToggle />
                <UserNav />
            </div>
        </header>
    )
}

function UserNav() {
    const { user, clearUser } = useUserStore()
    const router = useRouter()

    const handleLogout = () => {
        clearUser()
        router.push("/login") // or /auth/login, check routes
    }

    const initials = user?.email
        ? user.email.substring(0, 2).toUpperCase()
        : "SC"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt="@user" />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user?.full_name || user?.email?.split('@')[0] || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || "guest@example.com"}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile">
                            <Users className="mr-2 h-4 w-4" />
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
                <DropdownMenuItem
                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
