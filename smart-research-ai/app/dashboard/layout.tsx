"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useTokenRefresh } from "@/hooks/use-token-refresh"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    
    // Auto-refresh tokens to prevent session expiration
    useTokenRefresh()
    
    return (
        <div className="app bg-bg overflow-hidden flex h-screen w-full font-sans">
            <Sidebar 
                isCollapsed={isCollapsed} 
                toggleCollapse={() => setIsCollapsed(!isCollapsed)} 
            />
            
            <div className="main flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
                <DashboardHeader />
                <main className="content flex-1 overflow-y-auto min-h-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
