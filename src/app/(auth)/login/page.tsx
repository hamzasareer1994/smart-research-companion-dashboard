"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Text,
    TextField,
    Callout,
    Spinner,
    IconButton,
    Link
} from "@radix-ui/themes";
import {
    EyeOpenIcon,
    EyeNoneIcon,
    ExclamationTriangleIcon,
    EnvelopeClosedIcon,
    LockClosedIcon
} from "@radix-ui/react-icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Login failed");
            }

            localStorage.setItem("access_token", data.access_token);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box width="100%" maxWidth="400px" px="4">
            <Card size="4">
                <Flex direction="column" gap="4">
                    <Box mb="4">
                        <Heading size="6" mb="1" align="center">Welcome back</Heading>
                        <Text size="2" color="gray" align="center" style={{ display: "block" }}>Sign in to continue your research</Text>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Flex direction="column" gap="4">
                            <Box>
                                <Text as="label" size="2" weight="bold" mb="2" style={{ display: "block" }}>
                                    Email
                                </Text>
                                <TextField.Root
                                    type="email"
                                    size="3"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@university.edu"
                                    required
                                >
                                    <TextField.Slot>
                                        <EnvelopeClosedIcon />
                                    </TextField.Slot>
                                </TextField.Root>
                            </Box>

                            <Box>
                                <Text as="label" size="2" weight="bold" mb="2" style={{ display: "block" }}>
                                    Password
                                </Text>
                                <TextField.Root
                                    type={showPassword ? "text" : "password"}
                                    size="3"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                >
                                    <TextField.Slot>
                                        <LockClosedIcon />
                                    </TextField.Slot>
                                    <TextField.Slot side="right">
                                        <IconButton
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}
                                        </IconButton>
                                    </TextField.Slot>
                                </TextField.Root>
                            </Box>

                            {error && (
                                <Callout.Root color="red" variant="soft">
                                    <Callout.Icon>
                                        <ExclamationTriangleIcon />
                                    </Callout.Icon>
                                    <Callout.Text>{error}</Callout.Text>
                                </Callout.Root>
                            )}

                            <Button type="submit" size="3" disabled={loading}>
                                {loading && <Spinner />}
                                Sign in
                            </Button>
                        </Flex>
                    </form>

                    <Box mt="4">
                        <Text size="2" color="gray" align="center" style={{ display: "block" }}>
                            Don&apos;t have an account?{" "}
                            <NextLink href="/signup" passHref legacyBehavior>
                                <Link weight="bold">
                                    Sign up
                                </Link>
                            </NextLink>
                        </Text>
                    </Box>
                </Flex>
            </Card>
        </Box>
    );
}
