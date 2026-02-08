"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useTokenRefresh } from "@/hooks/use-token-refresh"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Auto-refresh tokens to prevent session expiration
    useTokenRefresh()
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:block w-64 fixed h-full" />

            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
