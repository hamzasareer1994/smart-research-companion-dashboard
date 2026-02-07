"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Box,
    Flex,
    Text,
    IconButton,
    Heading,
    ScrollArea,
    Button,
    Card
} from "@radix-ui/themes";
import {
    DashboardIcon,
    FileTextIcon,
    ChatBubbleIcon,
    MagnifyingGlassIcon,
    GearIcon,
    UploadIcon,
    RocketIcon
} from "@radix-ui/react-icons";

export function Sidebar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentView = searchParams.get("view") || "overview";

    const navItems = [
        { label: "Overview", icon: <DashboardIcon />, view: "overview" },
        { label: "Research Search", icon: <MagnifyingGlassIcon />, view: "search" },
        { label: "My Projects", icon: <RocketIcon />, view: "projects" },
        { label: "Upload Source", icon: <UploadIcon />, view: "upload" },
        { label: "Chat Assistant", icon: <ChatBubbleIcon />, view: "chat" },
        { label: "Recent Logs", icon: <FileTextIcon />, view: "recent" },
        { label: "Settings", icon: <GearIcon />, view: "settings" },
    ];

    return (
        <Box
            width="260px"
            height="100vh"
            style={{
                backgroundColor: "var(--color-background)",
                borderRight: "1px solid var(--gray-5)",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 50
            }}
            className="hidden md:block"
        >
            <Flex direction="column" height="100%">
                {/* Logo Section */}
                <Flex align="center" gap="3" p="6" mb="2">
                    <IconButton size="3" variant="solid" radius="medium">
                        <FileTextIcon width="20" height="20" />
                    </IconButton>
                    <Heading size="4" weight="bold" highContrast>Research AI</Heading>
                </Flex>

                {/* Navigation Items */}
                <ScrollArea scrollbars="vertical" style={{ flexGrow: 1 }}>
                    <Flex direction="column" gap="1" px="4">
                        {navItems.map((item) => (
                            <Button
                                key={item.view}
                                variant={currentView === item.view ? "soft" : "ghost"}
                                color={currentView === item.view ? undefined : "gray"}
                                size="3"
                                style={{
                                    justifyContent: "flex-start",
                                    height: "44px",
                                    position: "relative"
                                }}
                                onClick={() => router.push(`/dashboard?view=${item.view}`)}
                            >
                                <Flex align="center" gap="3" width="100%">
                                    {item.icon}
                                    <Text size="2" weight={currentView === item.view ? "bold" : "medium"}>
                                        {item.label}
                                    </Text>
                                    {currentView === item.view && (
                                        <Box
                                            style={{
                                                position: "absolute",
                                                left: "-16px",
                                                width: "4px",
                                                height: "20px",
                                                backgroundColor: "var(--accent-9)",
                                                borderRadius: "0 4px 4px 0"
                                            }}
                                        />
                                    )}
                                </Flex>
                            </Button>
                        ))}
                    </Flex>
                </ScrollArea>

                {/* Bottom Card */}
                <Box p="4">
                    <Card size="2" variant="surface" style={{ backgroundColor: "var(--accent-2)" }}>
                        <Flex direction="column" gap="2">
                            <Text size="1" weight="bold">Pro Plan Active</Text>
                            <Text size="1" color="gray">You have 1.2M credits remaining this month.</Text>
                            <Button size="1" variant="ghost" mt="1">Manage Billing</Button>
                        </Flex>
                    </Card>
                </Box>
            </Flex>
        </Box>
    );
}
