"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "./UserNav";
import { BellIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField, Flex, IconButton, Box, Heading } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";

export function DashboardHeader() {
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view") || "overview";

    const viewTitles: Record<string, string> = {
        overview: "Dashboard Overview",
        projects: "My Projects",
        recent: "Recent Activity",
        upload: "Upload Research",
        chat: "AI Research Assistant",
        settings: "Account Settings",
    };

    return (
        <header className="h-16 border-b sticky top-0 z-40 flex items-center justify-between px-8"
            style={{
                backgroundColor: "var(--color-background)",
                borderColor: "var(--gray-5)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)"
            }}>
            <Flex align="center" gap="8" style={{ flexGrow: 1 }}>
                <Heading size="4" weight="bold" highContrast className="hidden md:block">
                    {viewTitles[currentView] || "Dashboard"}
                </Heading>
                <Box maxWidth="400px" width="100%" className="hidden lg:block">
                    <TextField.Root
                        placeholder="Global research search..."
                        size="2"
                    >
                        <TextField.Slot>
                            <MagnifyingGlassIcon />
                        </TextField.Slot>
                    </TextField.Root>
                </Box>
            </Flex>

            <Flex align="center" gap="4">
                <Flex align="center" gap="2" pr="4" mr="2" style={{ borderRight: "1px solid var(--gray-5)" }}>
                    <ThemeToggle />
                    <IconButton variant="ghost" radius="full" style={{ position: "relative" }}>
                        <BellIcon width="20" height="20" />
                        <Box
                            style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                                width: "8px",
                                height: "8px",
                                backgroundColor: "var(--accent-9)",
                                borderRadius: "var(--radius-full)",
                                border: "2px solid var(--color-background)"
                            }}
                        />
                    </IconButton>
                </Flex>
                <UserNav />
            </Flex>
        </header>
    );
}
