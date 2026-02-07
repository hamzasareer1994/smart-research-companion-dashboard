"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { Box, Flex, Spinner, Container } from "@radix-ui/themes";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/login");
        } else {
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return (
            <Flex align="center" justify="center" minHeight="100vh">
                <Spinner size="3" />
            </Flex>
        );
    }

    return (
        <Box minHeight="100vh" style={{ backgroundColor: "var(--gray-1)" }}>
            <Sidebar />
            <Box className="pl-64 transition-all duration-300">
                <DashboardHeader />
                <Container size="4">
                    <Box p="8">
                        <React.Suspense fallback={
                            <Flex align="center" justify="center" p="9">
                                <Spinner size="3" />
                            </Flex>
                        }>
                            {children}
                        </React.Suspense>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
