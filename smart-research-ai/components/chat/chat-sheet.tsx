"use client"

import { useState } from "react"
import { PaperSelectorModal } from "./paper-selector-modal"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Send,
    Bot,
    User,
    Paperclip,
    X,
    MessageSquare,
    Sparkles,
    Layers,
    Lock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useUserStore } from "@/lib/store"
import { toast } from "sonner"

interface Message {
    role: "user" | "assistant"
    content: string
}

interface ChatSheetProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    contextId?: string // Project ID or Paper ID
    contextTitle?: string
    papers?: any[] // Papers in the project
}

export function ChatSheet({
    isOpen,
    onOpenChange,
    contextId,
    contextTitle = "Project Context",
    papers = []
}: ChatSheetProps) {
    const { user } = useUserStore()
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: `Hello! I'm your research assistant. I have context on "${contextTitle}". How can I help you today?` }
    ])
    const [input, setInput] = useState("")
    const [isMultiPaper, setIsMultiPaper] = useState(false)
    const [isPaperSelectorOpen, setIsPaperSelectorOpen] = useState(false)
    const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const isPremium = user?.tier === "pro"

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg: Message = { role: "user", content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch('/api/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("smart-research-storage") || "{}")?.state?.user?.access_token}`
                },
                body: JSON.stringify({
                    query: input,
                    paper_ids: selectedPaperIds.length > 0 ? selectedPaperIds : undefined,
                    project_id: contextId
                })
            })

            if (!response.ok) throw new Error('Chat failed')

            const data = await response.json()
            setMessages(prev => [...prev, {
                role: "assistant",
                content: data.response
            }])
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[500px] flex flex-col p-0 gap-0 border-l shadow-2xl">
                <SheetHeader className="p-6 border-b bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <SheetTitle className="text-xl">Research Chat</SheetTitle>
                        </div>
                        <Badge variant="outline" className="gap-1.5 py-1">
                            <Sparkles className="w-3 h-3 text-purple-500" />
                            AI Assistant
                        </Badge>
                    </div>
                    <SheetDescription className="flex items-center gap-2">
                        Focus: <span className="font-semibold text-foreground truncate max-w-[200px] inline-block">{contextTitle}</span>
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                    }`}>
                                    {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${m.role === 'assistant'
                                    ? 'bg-muted/50 border rounded-tl-none'
                                    : 'bg-primary text-primary-foreground rounded-tr-none'
                                    } shadow-sm`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-6 border-t bg-background/80 backdrop-blur-md">
                    <div className="flex gap-2 relative group">
                        <Input
                            placeholder="Ask anything about your papers..."
                            className="pr-20 py-6 rounded-2xl shadow-inner border-primary/20 focus-visible:ring-primary/30"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-muted-foreground hover:text-primary"
                                onClick={() => setIsPaperSelectorOpen(true)}
                                title="Select papers for context"
                            >
                                <Paperclip className="h-5 w-5" />
                                {selectedPaperIds.length > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px]">
                                        {selectedPaperIds.length}
                                    </Badge>
                                )}
                            </Button>
                            <Button
                                size="icon"
                                className="h-9 w-9 rounded-xl shadow-lg shadow-primary/20"
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                            >
                                {isLoading ? (
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground mt-4">
                        AI-generated responses. Double check key facts.
                    </p>
                </div>
            </SheetContent>

            <PaperSelectorModal
                isOpen={isPaperSelectorOpen}
                onOpenChange={setIsPaperSelectorOpen}
                papers={papers}
                onConfirm={(ids) => {
                    setSelectedPaperIds(ids)
                    toast.success(`${ids.length} paper${ids.length !== 1 ? 's' : ''} selected for chat context`)
                }}
            />
        </Sheet>
    )
}
