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
    Avatar,
    IconButton,
    Grid,
    Callout
} from "@radix-ui/themes";
import {
    LockClosedIcon,
    IdCardIcon,
    InfoCircledIcon
} from "@radix-ui/react-icons";

export function AccountSettings() {
    const [activeTab, setActiveTab] = useState("account");

    return (
        <Flex direction="column" gap="8" maxWidth="1000px" mx="auto">
            <Box>
                <Heading size="8" mb="2" weight="bold">Settings</Heading>
                <Text color="gray" size="3">Manage your account, preferences, and security.</Text>
            </Box>

            <Flex direction="column" gap="6">
                <Flex gap="6" pb="1" style={{ borderBottom: "1px solid var(--gray-5)" }}>
                    <Button
                        variant="ghost"
                        color={activeTab === "account" ? "indigo" : "gray"}
                        onClick={() => setActiveTab("account")}
                        style={{ borderBottom: activeTab === "account" ? "2px solid var(--accent-9)" : "none", borderRadius: 0 }}
                    >
                        Account
                    </Button>
                    <Button
                        variant="ghost"
                        color={activeTab === "billing" ? "indigo" : "gray"}
                        onClick={() => setActiveTab("billing")}
                        style={{ borderBottom: activeTab === "billing" ? "2px solid var(--accent-9)" : "none", borderRadius: 0 }}
                    >
                        Billing
                    </Button>
                    <Button
                        variant="ghost"
                        color={activeTab === "security" ? "indigo" : "gray"}
                        onClick={() => setActiveTab("security")}
                        style={{ borderBottom: activeTab === "security" ? "2px solid var(--accent-9)" : "none", borderRadius: 0 }}
                    >
                        Security
                    </Button>
                </Flex>

                <Box pt="2">
                    {activeTab === "account" && (
                        <Card size="4">
                            <Flex direction="column" gap="6">
                                <Flex align="center" gap="6">
                                    <Avatar
                                        size="8"
                                        fallback="H"
                                        color="indigo"
                                        variant="solid"
                                        radius="full"
                                    />
                                    <Box>
                                        <Heading size="5">Hamza Researcher</Heading>
                                        <Text size="2" color="gray">PhD Candidate @ University</Text>
                                        <Flex mt="2">
                                            <Button variant="outline" size="1">Change Avatar</Button>
                                        </Flex>
                                    </Box>
                                </Flex>

                                <Grid columns={{ initial: "1", sm: "2" }} gap="6">
                                    <Box>
                                        <Text as="label" size="2" weight="bold" mb="2" style={{ display: "block" }}>Full Name</Text>
                                        <TextField.Root defaultValue="Hamza Researcher" size="3" />
                                    </Box>
                                    <Box>
                                        <Text as="label" size="2" weight="bold" mb="2" style={{ display: "block" }}>Email Address</Text>
                                        <TextField.Root defaultValue="hamza@university.edu" size="3" />
                                    </Box>
                                </Grid>

                                <Flex justify="end">
                                    <Button size="3">Save Profile Changes</Button>
                                </Flex>
                            </Flex>
                        </Card>
                    )}

                    {activeTab === "security" && (
                        <Flex direction="column" gap="6">
                            <Card size="3">
                                <Flex align="start" gap="4">
                                    <IconButton variant="soft" color="orange" size="3" radius="medium">
                                        <LockClosedIcon width="24" height="24" />
                                    </IconButton>
                                    <Box style={{ flexGrow: 1 }}>
                                        <Heading size="4">Password Management</Heading>
                                        <Text size="2" color="gray">Keep your account secure with a strong password.</Text>
                                        <Flex mt="4" pt="4" style={{ borderTop: "1px solid var(--gray-5)" }}>
                                            <Button variant="outline">Update Password</Button>
                                        </Flex>
                                    </Box>
                                </Flex>
                            </Card>
                        </Flex>
                    )}

                    {activeTab === "billing" && (
                        <Flex direction="column" gap="6">
                            <Callout.Root color="blue" variant="soft">
                                <Callout.Icon>
                                    <InfoCircledIcon />
                                </Callout.Icon>
                                <Callout.Text>
                                    You are currently on the Free Tier. Upgrade to Academic Pro to unlock automated literature reviews.
                                </Callout.Text>
                            </Callout.Root>

                            <Card size="4">
                                <Flex direction="column" align="center" justify="center" p="9" gap="4">
                                    <IconButton size="4" variant="ghost" disabled>
                                        <IdCardIcon width="48" height="48" style={{ opacity: 0.2 }} />
                                    </IconButton>
                                    <Heading size="6" align="center">No active subscription</Heading>
                                    <Box maxWidth="400px">
                                        <Text color="gray" size="2" align="center" style={{ display: "block" }}>
                                            Upgrade to Academic Pro to unlock unlimited PDF processing and knowledge graph generation.
                                        </Text>
                                    </Box>
                                    <Button size="3" radius="full" mt="4">
                                        View Pricing Plans
                                    </Button>
                                </Flex>
                            </Card>
                        </Flex>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
}
