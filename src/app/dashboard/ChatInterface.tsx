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
    ScrollArea,
    Avatar,
    Callout
} from "@radix-ui/themes";
import {
    PaperPlaneIcon,
    MagicWandIcon,
    FileTextIcon,
    PersonIcon,
    PlusCircledIcon,
    ResetIcon,
    BookmarkIcon,
    DotsVerticalIcon,
    InfoCircledIcon
} from "@radix-ui/react-icons";

// Custom Bot Icon since Radix doesn't have a direct equivalent
const BotIcon = () => (
    <MagicWandIcon width="18" height="18" />
);

const MOCK_CHAT = [
    { role: 'assistant', content: 'Hello! I am your research companion. Which papers should we analyze today?' },
    { role: 'user', content: 'Can you explain the main findings of the paper about Transformer attention mechanisms?' },
    { role: 'assistant', content: 'In that paper, Vaswani et al. found that self-attention mechanisms outperform traditional RNNs by allowing for better parallelization and capturing long-range dependencies through the Multi-Head Attention approach.' }
];

export function ChatInterface() {
    const [messages, setMessages] = useState(MOCK_CHAT);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', content: input }]);
        setInput("");

        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm processing that based on your specific project context. In a real scenario, this would involve a vector search across your uploaded documents."
            }]);
        }, 1000);
    };

    return (
        <Flex gap="6" height="calc(100vh - 180px)">
            {/* Sidebar Context */}
            <Flex direction="column" gap="4" width="280px" className="hidden lg:flex">
                <Flex align="center" gap="2" mb="2">
                    <MagicWandIcon style={{ color: "var(--accent-9)" }} />
                    <Heading size="3" weight="bold">Research Context</Heading>
                </Flex>
                <ScrollArea scrollbars="vertical" style={{ flexGrow: 1, height: "100%" }}>
                    <Flex direction="column" gap="3" pr="4">
                        <Card size="2" style={{ cursor: "pointer" }} className="hover-lift">
                            <Flex align="center" gap="2" mb="1">
                                <FileTextIcon style={{ color: "var(--accent-9)" }} />
                                <Text size="2" weight="bold" className="truncate">Attention Is All You Need.pdf</Text>
                            </Flex>
                            <Text size="1" color="gray" className="line-clamp-2">Main source for NLP concepts.</Text>
                        </Card>
                        <Card size="2" style={{ cursor: "pointer" }} className="hover-lift">
                            <Flex align="center" gap="2" mb="1">
                                <FileTextIcon style={{ color: "var(--accent-9)" }} />
                                <Text size="2" weight="bold" className="truncate">GPT-4 Technical Report.pdf</Text>
                            </Flex>
                        </Card>
                        <Button variant="ghost" size="2" style={{ border: "1px dashed var(--gray-5)" }}>
                            <PlusCircledIcon /> Add Papers to Context
                        </Button>
                    </Flex>
                </ScrollArea>
                <Card size="2" variant="surface" style={{ backgroundColor: "var(--accent-2)" }}>
                    <Text size="1" weight="bold" color="indigo" mb="2" style={{ display: "block" }}>Model Status</Text>
                    <Flex align="center" gap="2">
                        <Box width="8px" height="8px" style={{ backgroundColor: "var(--accent-9)", borderRadius: "var(--radius-full)" }} className="animate-pulse" />
                        <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase" }}>Milvus Connected</Text>
                    </Flex>
                </Card>
            </Flex>

            {/* Main Chat Area */}
            <Card size="3" style={{ flexGrow: 1, padding: 0, height: "100%" }} className="flex flex-col overflow-hidden">
                <Flex direction="column" height="100%">
                    {/* Chat Header */}
                    <Flex align="center" justify="between" p="4" style={{ borderBottom: "1px solid var(--gray-5)", backgroundColor: "var(--gray-2)" }}>
                        <Flex align="center" gap="3">
                            <Avatar
                                size="3"
                                fallback={<BotIcon />}
                                color="indigo"
                                variant="solid"
                                radius="full"
                            />
                            <Box>
                                <Heading size="3">Research Assistant</Heading>
                                <Text size="1" weight="bold" style={{ textTransform: "uppercase", color: "var(--accent-9)" }}>Online</Text>
                            </Box>
                        </Flex>
                        <Flex align="center" gap="1">
                            <IconButton variant="ghost" size="2" radius="full"><ResetIcon /></IconButton>
                            <IconButton variant="ghost" size="2" radius="full"><BookmarkIcon /></IconButton>
                            <IconButton variant="ghost" size="2" radius="full"><DotsVerticalIcon /></IconButton>
                        </Flex>
                    </Flex>

                    {/* Messages */}
                    <ScrollArea scrollbars="vertical" style={{ flexGrow: 1, height: "100%" }}>
                        <Flex direction="column" gap="6" p="6">
                            <Callout.Root color="blue" variant="soft" size="1">
                                <Callout.Icon>
                                    <InfoCircledIcon />
                                </Callout.Icon>
                                <Callout.Text>
                                    This chat session is focused on your current project context.
                                </Callout.Text>
                            </Callout.Root>

                            {messages.map((m, i) => (
                                <Flex key={i} gap="4" direction={m.role === 'user' ? 'row-reverse' : 'row'}>
                                    <Avatar
                                        size="2"
                                        fallback={m.role === 'user' ? <PersonIcon /> : <BotIcon />}
                                        color={m.role === 'user' ? 'indigo' : 'gray'}
                                        variant={m.role === 'user' ? 'solid' : 'soft'}
                                        radius="full"
                                    />
                                    <Box
                                        p="4"
                                        maxWidth="80%"
                                        style={{
                                            borderRadius: "var(--radius-4)",
                                            backgroundColor: m.role === 'user' ? 'var(--accent-9)' : 'var(--gray-3)',
                                            color: m.role === 'user' ? 'white' : 'inherit',
                                            borderTopRightRadius: m.role === 'user' ? 0 : "var(--radius-4)",
                                            borderTopLeftRadius: m.role === 'user' ? "var(--radius-4)" : 0
                                        }}
                                    >
                                        <Text size="2" style={{ lineHeight: "1.6" }}>{m.content}</Text>
                                    </Box>
                                </Flex>
                            ))}
                        </Flex>
                    </ScrollArea>

                    {/* Input Area */}
                    <Box p="6" style={{ borderTop: "1px solid var(--gray-5)", backgroundColor: "var(--gray-2)" }}>
                        <Flex direction="column" gap="3">
                            <Flex gap="2">
                                <Box style={{ flexGrow: 1 }}>
                                    <TextField.Root
                                        placeholder="Type your question about your research..."
                                        size="3"
                                        radius="large"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    >
                                        <TextField.Slot side="right">
                                            <IconButton
                                                size="2"
                                                variant="solid"
                                                radius="medium"
                                                onClick={handleSend}
                                                disabled={!input.trim()}
                                            >
                                                <PaperPlaneIcon />
                                            </IconButton>
                                        </TextField.Slot>
                                    </TextField.Root>
                                </Box>
                            </Flex>
                            <Text size="1" color="gray" align="center">
                                AI can make mistakes. Consider checking important information.
                            </Text>
                        </Flex>
                    </Box>
                </Flex>
            </Card>
        </Flex>
    );
}
