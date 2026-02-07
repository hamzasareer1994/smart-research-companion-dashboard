"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import {
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Text,
    TextField,
    TextArea,
    IconButton,
    Spinner,
    Grid,
    Link,
    Callout
} from "@radix-ui/themes";
import {
    ArrowLeftIcon,
    RocketIcon,
    DashboardIcon,
    GlobeIcon,
    ExclamationTriangleIcon
} from "@radix-ui/react-icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";

export function NewProjectForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Failed to create project");
            }

            const data = await response.json();
            router.push(`/dashboard?view=projects&id=${data.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setLoading(false);
        }
    }

    return (
        <Flex direction="column" gap="8" maxWidth="700px" mx="auto">
            <Flex align="center" gap="4">
                <NextLink href="/dashboard?view=projects">
                    <IconButton variant="ghost" size="2" radius="full">
                        <ArrowLeftIcon width="20" height="20" />
                    </IconButton>
                </NextLink>
                <Box>
                    <Heading size="6" weight="bold">Create New Project</Heading>
                    <Text color="gray" size="2">Set up a new workspace for your research phase.</Text>
                </Box>
            </Flex>

            {error && (
                <Callout.Root color="red" variant="soft">
                    <Callout.Icon>
                        <ExclamationTriangleIcon />
                    </Callout.Icon>
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}

            <Card size="4">
                <form onSubmit={handleSubmit}>
                    <Flex direction="column" gap="6">
                        <Box>
                            <Text as="label" size="2" weight="bold" mb="2" style={{ display: "block" }}>Project Name</Text>
                            <TextField.Root
                                placeholder="e.g., Quantum Computing Research"
                                size="3"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <Text size="1" color="gray" mt="1">Keep it descriptive and concise.</Text>
                        </Box>

                        <Box>
                            <Text as="label" size="2" weight="bold" mb="2" style={{ display: "block" }}>Description (Optional)</Text>
                            <TextArea
                                placeholder="Briefly describe what this project is about..."
                                size="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ minHeight: "120px" }}
                            />
                        </Box>

                        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                            <Card size="2" variant="surface" style={{ cursor: "pointer", border: "1px dashed var(--gray-5)" }} className="hover-lift group">
                                <Flex direction="column" align="center" gap="2">
                                    <DashboardIcon width="32" height="32" style={{ color: "var(--tomato-9)" }} className="group-hover:scale-110 transition-transform" />
                                    <Text size="2" weight="bold" align="center">Standard Workspace</Text>
                                    <Text size="1" color="gray" align="center">Clean slate for your organization.</Text>
                                </Flex>
                            </Card>
                            <Card size="2" variant="surface" style={{ opacity: 0.5, cursor: "not-allowed" }}>
                                <Flex direction="column" align="center" gap="2">
                                    <GlobeIcon width="32" height="32" style={{ color: "var(--blue-9)" }} />
                                    <Text size="2" weight="bold" align="center">Shared Project</Text>
                                    <Box>
                                        <Text size="1" color="gray" align="center" style={{ display: "block" }}>Collaborate with peers.</Text>
                                        <Text size="1" weight="bold" align="center" style={{ display: "block", color: "var(--blue-9)" }}>Coming Soon</Text>
                                    </Box>
                                </Flex>
                            </Card>
                        </Grid>

                        <Flex justify="end" align="center" gap="3" pt="4" style={{ borderTop: "1px solid var(--gray-5)" }}>
                            <NextLink href="/dashboard?view=projects" passHref legacyBehavior>
                                <Button variant="ghost" type="button" asChild style={{ cursor: 'pointer' }}>
                                    <Link style={{ textDecoration: 'none', color: 'inherit' }}>Cancel</Link>
                                </Button>
                            </NextLink>
                            <Button
                                type="submit"
                                size="3"
                                disabled={loading || !name}
                            >
                                {loading && <Spinner />}
                                <RocketIcon /> Start Project
                            </Button>
                        </Flex>
                    </Flex>
                </form>
            </Card>
        </Flex>
    );
}
