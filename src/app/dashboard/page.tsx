"use client";

import { useSearchParams } from "next/navigation";
import { ProjectsList } from "./ProjectsList";
import { NewProjectForm } from "./NewProjectForm";
import { RecentActivity } from "./RecentActivity";
import { UploadZone } from "./UploadZone";
import { ChatInterface } from "./ChatInterface";
import { AccountSettings } from "./AccountSettings";
import {
    Box,
    Button,
    Card,
    Flex,
    Grid,
    Heading,
    Text,
    Badge
} from "@radix-ui/themes";
import { MagicWandIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";

export default function DashboardPage() {
    return (
        <Suspense fallback={<Flex align="center" justify="center" p="9"><Text>Loading Content...</Text></Flex>}>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardContent() {
    const searchParams = useSearchParams();
    const view = searchParams.get("view") || "overview";

    return (
        <Box>
            {renderView(view)}
        </Box>
    );
}

function renderView(view: string) {
    switch (view) {
        case "overview":
            return <DashboardOverview />;
        case "projects":
            return <ProjectsList />;
        case "projects_new":
            return <NewProjectForm />;
        case "recent":
            return <RecentActivity />;
        case "upload":
            return <UploadZone />;
        case "chat":
            return <ChatInterface />;
        case "settings":
            return <AccountSettings />;
        default:
            return <DashboardOverview />;
    }
}

function DashboardOverview() {
    return (
        <Flex direction="column" gap="8">
            <Box>
                <Heading size="8" mb="1">Welcome back, Researcher</Heading>
                <Text color="gray" size="3">Here is what is happening with your research projects today.</Text>
            </Box>

            <Grid columns={{ initial: "1", md: "2", lg: "4" }} gap="6">
                <StatCard title="Total Papers" value="12" change="+2 this week" />
                <StatCard title="AI Analysis" value="48" change="+12 this week" />
                <StatCard title="Projects" value="4" change="0 this week" />
                <StatCard title="Credits Left" value="840" change="of 1,000" />
            </Grid>

            <Card size="4" variant="classic" style={{
                background: "linear-gradient(to bottom right, var(--accent-9), var(--accent-10))",
                color: "var(--accent-contrast)",
                position: "relative",
                overflow: "hidden"
            }}>
                <Flex direction={{ initial: "column", md: "row" }} align="center" justify="between" gap="6">
                    <Flex direction="column" gap="4" maxWidth="600px" align={{ initial: "center", md: "start" }} style={{ position: "relative", zIndex: 1 }}>
                        <Flex align="center" gap="2" justify={{ initial: "center", md: "start" }}>
                            <Badge size="2" variant="soft" highContrast>
                                <MagicWandIcon /> NEW FEATURE
                            </Badge>
                        </Flex>
                        <Heading size="7" weight="bold" align={{ initial: "center", md: "left" }}>Try the Knowledge Graph</Heading>
                        <Text size="4" style={{ opacity: 0.9 }} align={{ initial: "center", md: "left" }}>
                            Visualize connections between your uploaded papers using our new semantic mapping engine.
                        </Text>
                        <Flex justify={{ initial: "center", md: "start" }}>
                            <Button variant="solid" highContrast size="3" radius="large" style={{ cursor: "pointer", color: "var(--accent-9)", backgroundColor: "var(--accent-contrast)" }}>
                                Explore Graph <ArrowRightIcon />
                            </Button>
                        </Flex>
                    </Flex>
                    <Box className="hidden md:block" style={{ opacity: 0.2, position: "relative", zIndex: 1 }}>
                        <MagicWandIcon width="160" height="160" />
                    </Box>
                </Flex>
                {/* Decorative gradients */}
                <Box style={{
                    position: "absolute",
                    top: "-100px",
                    right: "-100px",
                    width: "300px",
                    height: "300px",
                    filter: "blur(80px)",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "100%"
                }} />
                <Box style={{
                    position: "absolute",
                    bottom: "-50px",
                    left: "-50px",
                    width: "200px",
                    height: "200px",
                    filter: "blur(60px)",
                    background: "rgba(0,0,0,0.1)",
                    borderRadius: "100%"
                }} />
            </Card>
        </Flex>
    );
}

function StatCard({ title, value, change }: { title: string, value: string, change: string }) {
    return (
        <Card size="3">
            <Flex direction="column" gap="1">
                <Text size="2" color="gray" weight="medium">{title}</Text>
                <Box>
                    <Text size="7" weight="bold">{value}</Text>
                </Box>
                <Text size="1" weight="medium" style={{ color: "var(--accent-11)" }}>{change}</Text>
            </Flex>
        </Card>
    );
}
