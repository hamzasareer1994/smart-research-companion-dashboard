"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings as SettingsIcon, Shield } from "lucide-react";

// Assuming API_URL is needed for /me call if we were doing it here
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";

export function UserNav() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const email = localStorage.getItem("user_email");
        setUserEmail(email);

        // Optional: Fetch fresh user data from /me
        const token = localStorage.getItem("access_token");
        if (token) {
            fetch(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.email) {
                        setUserEmail(data.email);
                        localStorage.setItem("user_email", data.email);
                    }
                })
                .catch(() => { });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_email");
        router.push("/login");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/10 hover:ring-primary/20 transition-all p-0 overflow-hidden hover-lift">
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-inner uppercase">
                        {userEmail ? userEmail[0] : <User className="w-4 h-4" />}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2 rounded-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Researcher</p>
                        <p className="text-xs leading-none text-muted-foreground truncate max-w-[180px]">
                            {userEmail || "loading..."}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2 py-2" onClick={() => router.push("/dashboard?view=settings")}>
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2 py-2 text-red-600 focus:text-red-600" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
