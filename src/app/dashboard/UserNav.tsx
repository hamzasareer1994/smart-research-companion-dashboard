"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Avatar,
    DropdownMenu,
    IconButton,
    Text,
    Flex,
    Box
} from "@radix-ui/themes";
import {
    PersonIcon,
    ExitIcon,
    GearIcon
} from "@radix-ui/react-icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";

export function UserNav() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const email = localStorage.getItem("user_email");
        setUserEmail(email);

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
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton variant="ghost" radius="full" size="2">
                    <Avatar
                        size="2"
                        fallback={userEmail ? userEmail[0].toUpperCase() : "U"}
                        radius="full"
                        color="indigo"
                        variant="soft"
                    />
                </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" variant="soft" size="2">
                <Box px="3" py="2">
                    <Text size="1" weight="bold" highContrast style={{ display: "block" }}>Researcher</Text>
                    <Text size="1" color="gray" className="truncate max-w-[180px]" style={{ display: "block" }}>
                        {userEmail || "loading..."}
                    </Text>
                </Box>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onClick={() => router.push("/dashboard?view=settings")}>
                    <Flex align="center" gap="2">
                        <GearIcon />
                        <Text size="2">Settings</Text>
                    </Flex>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item color="red" onClick={handleLogout}>
                    <Flex align="center" gap="2">
                        <ExitIcon />
                        <Text size="2">Log out</Text>
                    </Flex>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root >
    );
}
