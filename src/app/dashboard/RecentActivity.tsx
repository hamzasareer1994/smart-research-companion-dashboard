"use client";

import { useState } from "react";
import {
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Text,
    TextField,
    IconButton,
    Badge,
    Callout
} from "@radix-ui/themes";
import {
    ClockIcon,
    FileTextIcon,
    ChatBubbleIcon,
    MagnifyingGlassIcon,
    ArrowRightIcon,
    InfoCircledIcon
} from "@radix-ui/react-icons";
import NextLink from "next/link";

// Mock data for UI/UX
const MOCK_ACTIVITY = [
    {
        id: "1",
        type: "upload",
        title: "Deep Learning Foundations.pdf",
        timestamp: "2 hours ago",
        project: "Machine Learning Concepts"
    },
    {
        id: "2",
        type: "chat",
        title: "Briefing document for Quantum Erasing",
        timestamp: "5 hours ago",
        project: "Physics Paper Review"
    },
    {
        id: "3",
        type: "search",
        title: "Recent advances in NLP transformers",
        timestamp: "Yesterday",
        project: "NLP Master Thesis"
    }
];

export function RecentActivity() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <Flex direction="column" gap="6">
            <Box>
                <Heading size="6" weight="bold">Recent Activity</Heading>
                <Text color="gray" size="2">Keep track of your latest research steps and discussions.</Text>
            </Box>

            <Callout.Root color="indigo" variant="soft">
                <Callout.Icon>
                    <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>
                    This is a consolidated view of all activities across your research projects.
                </Callout.Text>
            </Callout.Root>

            <Box>
                <TextField.Root
                    placeholder="Search activity logs..."
                    size="3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                >
                    <TextField.Slot>
                        <MagnifyingGlassIcon />
                    </TextField.Slot>
                </TextField.Root>
            </Box>

            <Flex direction="column" gap="4">
                {MOCK_ACTIVITY.map((activity) => (
                    <Card key={activity.id} size="2" className="hover-lift">
                        <Flex align="center" gap="4">
                            <ActivityIcon type={activity.type} />
                            <Box style={{ flexGrow: 1 }}>
                                <Flex justify="between" align="center" gap="2">
                                    <Heading size="3" className="truncate hover:text-accent-11 transition-colors">
                                        {activity.title}
                                    </Heading>
                                    <Text size="1" color="gray" className="whitespace-nowrap">
                                        {activity.timestamp}
                                    </Text>
                                </Flex>
                                <Flex align="center" gap="2" mt="1">
                                    <Badge variant="soft" color="gray" size="1">
                                        {activity.project}
                                    </Badge>
                                    <Text size="1" color="gray">
                                        <ActivityTypeText type={activity.type} />
                                    </Text>
                                </Flex>
                            </Box>
                            <NextLink href="/dashboard" passHref legacyBehavior>
                                <Button variant="ghost" size="2" radius="full" asChild>
                                    <NextLink href="/dashboard">
                                        <ArrowRightIcon />
                                    </NextLink>
                                </Button>
                            </NextLink>
                        </Flex>
                    </Card>
                ))}
            </Flex>

            <Box pt="6" style={{ borderTop: "1px solid var(--gray-5)" }}>
                <Text size="2" color="gray" mb="4" align="center" style={{ display: "block" }}>You&apos;ve reached the end of your recent activity.</Text>
                <Flex justify="center">
                    <NextLink href="/dashboard" passHref legacyBehavior>
                        <Button variant="outline" asChild>
                            <NextLink href="/dashboard">Back to Dashboard Home</NextLink>
                        </Button>
                    </NextLink>
                </Flex>
            </Box>
        </Flex>
    );
}

function ActivityIcon({ type }: { type: string }) {
    switch (type) {
        case "upload":
            return <IconButton variant="soft" color="blue" size="3" radius="medium"><FileTextIcon /></IconButton>;
        case "chat":
            return <IconButton variant="soft" color="green" size="3" radius="medium"><ChatBubbleIcon /></IconButton>;
        case "search":
            return <IconButton variant="soft" color="indigo" size="3" radius="medium"><MagnifyingGlassIcon /></IconButton>;
        default:
            return <IconButton variant="soft" color="gray" size="3" radius="medium"><ClockIcon /></IconButton>;
    }
}

function ActivityTypeText({ type }: { type: string }) {
    switch (type) {
        case "upload": return "Uploaded file";
        case "chat": return "Generated AI briefing";
        case "search": return "Research search";
        default: return "Activity";
    }
}
