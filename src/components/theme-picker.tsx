"use client";

import * as React from "react";
import { Check, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const themes = [
    // Light Themes
    { id: "academic", name: "Academic Sky", color: "bg-sky-500", mode: "light" },
    { id: "emerald", name: "Emerald Paper", color: "bg-emerald-500", mode: "light" },
    // Dark Themes
    { id: "midnight", name: "Midnight Research", color: "bg-blue-600", mode: "dark" },
    { id: "ametrine", name: "Ametrine Scholar", color: "bg-purple-600", mode: "dark" },
];

export function ThemePicker() {
    const { theme: currentMode, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [currentSubTheme, setCurrentSubTheme] = React.useState("academic");

    React.useEffect(() => {
        setMounted(true);
        const savedSubTheme = localStorage.getItem("sub-theme") || "academic";
        setCurrentSubTheme(savedSubTheme);
    }, []);

    if (!mounted) return null;

    const handleThemeChange = (id: string, mode: string) => {
        setTheme(mode);
        setCurrentSubTheme(id);
        document.documentElement.setAttribute("data-color-theme", id);
        localStorage.setItem("sub-theme", id);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                    <Palette className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
                    <span className="sr-only">Change theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Light Themes
                </div>
                {themes.filter(t => t.mode === "light").map((t) => (
                    <DropdownMenuItem
                        key={t.id}
                        className="flex items-center justify-between cursor-pointer rounded-lg py-2"
                        onClick={() => handleThemeChange(t.id, "light")}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn("w-4 h-4 rounded-full", t.color)} />
                            <span>{t.name}</span>
                        </div>
                        {currentSubTheme === t.id && currentMode === "light" && <Check className="w-4 h-4 text-primary" />}
                    </DropdownMenuItem>
                ))}

                <div className="px-2 py-1.5 mt-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Dark Themes
                </div>
                {themes.filter(t => t.mode === "dark").map((t) => (
                    <DropdownMenuItem
                        key={t.id}
                        className="flex items-center justify-between cursor-pointer rounded-lg py-2"
                        onClick={() => handleThemeChange(t.id, "dark")}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn("w-4 h-4 rounded-full", t.color)} />
                            <span>{t.name}</span>
                        </div>
                        {currentSubTheme === t.id && currentMode === "dark" && <Check className="w-4 h-4 text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
