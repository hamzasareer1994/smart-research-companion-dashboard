"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[5%] py-4 bg-paper/85 backdrop-blur-xl border-b border-paper-border">
            <Link href="/" className="flex items-center gap-2 text-xl tracking-tight text-accent no-underline font-serif">
                <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                Research<em className="italic">AI</em>
            </Link>
            
            <ul className="hidden md:flex items-center gap-8 list-none">
                <li><Link href="#features" className="text-sm font-normal text-ink-muted no-underline transition-colors hover:text-ink">Features</Link></li>
                <li><Link href="#pipeline" className="text-sm font-normal text-ink-muted no-underline transition-colors hover:text-ink">How it works</Link></li>
                <li><Link href="#pricing" className="text-sm font-normal text-ink-muted no-underline transition-colors hover:text-ink">Pricing</Link></li>
                <li><Link href="#pro" className="text-sm font-normal text-ink-muted no-underline transition-colors hover:text-ink">Pro</Link></li>
            </ul>

            <div className="flex items-center gap-3">
                <Link href="/login" className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium transition-all no-underline border-[1.5px] border-paper-border bg-transparent text-ink-muted hover:border-ink-muted hover:text-ink">
                    Sign in
                </Link>
                <Link href="/signup" className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium transition-all no-underline border-[1.5px] border-transparent bg-accent text-white hover:bg-[#0F2840]">
                    Get started free
                </Link>
            </div>
        </nav>
    )
}
