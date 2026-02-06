"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    Send,
    Sparkles,
    FileText,
    User,
    Bot,
    PlusCircle,
    RotateCcw,
    Bookmark,
    MoreVertical
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <div className="flex h-[calc(100vh-160px)] gap-6">
            {/* Sidebar Context */}
            <div className="hidden lg:flex w-72 flex-col gap-4">
                <div className="font-bold flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Research Context
                </div>
                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-3">
                        <Card className="p-3 bg-card/40 border-none cursor-pointer hover:bg-muted/60 transition-colors hover-lift">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold truncate">Attention Is All You Need.pdf</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">Main source for NLP concepts.</p>
                        </Card>
                        <Card className="p-3 bg-card/40 border-none cursor-pointer hover:bg-muted/60 transition-colors hover-lift">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold truncate">GPT-4 Technical Report.pdf</span>
                            </div>
                        </Card>
                        <Button variant="ghost" className="w-full justify-start text-xs border border-dashed border-border hover:border-primary/50" size="sm">
                            <PlusCircle className="w-3 h-3 mr-2" /> Add Papers to Context
                        </Button>
                    </div>
                </ScrollArea>
                <Card className="p-4 bg-primary/5 border-primary/10">
                    <p className="text-xs font-semibold text-primary mb-2">Model Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Milvus Connected</span>
                    </div>
                </Card>
            </div>

            {/* Main Chat Area */}
            <Card className="flex-1 flex flex-col glass shadow-xl overflow-hidden rounded-2xl">
                {/* Chat Header */}
                <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold">Research Assistant</h2>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover-lift"><RotateCcw className="w-4 h-4 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover-lift"><Bookmark className="w-4 h-4 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover-lift"><MoreVertical className="w-4 h-4 text-muted-foreground" /></Button>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${m.role === 'user' ? 'bg-primary' : 'bg-muted'
                                    }`}>
                                    {m.role === 'user' ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-md ${m.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-card border border-border/50 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{m.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-6 border-t border-border/50 bg-muted/20">
                    <div className="relative group">
                        <Input
                            placeholder="Type your question about your research..."
                            className="h-14 pl-6 pr-14 rounded-2xl border-border/40 focus:border-primary/50 focus:ring-primary/20 bg-background/50 backdrop-blur-sm text-sm shadow-inner"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <Button
                            className="absolute right-2 top-2 h-10 w-10 rounded-xl btn-primary shadow-lg transition-all active:scale-95"
                            onClick={handleSend}
                            disabled={!input.trim()}
                        >
                            <Send className="w-4 h-4 shrink-0" />
                        </Button>
                    </div>
                    <p className="text-[10px] text-center mt-3 text-muted-foreground">
                        AI can make mistakes. Consider checking important information.
                    </p>
                </div>
            </Card>
        </div>
    );
}
