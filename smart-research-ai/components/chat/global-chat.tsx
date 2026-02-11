"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Send,
    Bot,
    User,
    Plus,
    Trash2,
    Download,
    Settings,
    Sparkles,
    Database,
    ChevronLeft,
    MessageSquare,
    MoreVertical,
    Loader2
} from "lucide-react"
import { ContextSelector } from "./context-selector"
import { UsageBar } from "@/components/ui/usage-bar"
import { useUserStore } from "@/lib/store"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ChatMessage {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    metadata?: {
        tokens?: number
        projects?: string[]
        papers?: string[]
    }
}

interface ChatSession {
    id: string
    title: string
    lastMessage: string
    timestamp: Date
}

export function GlobalChat() {
    const { user } = useUserStore()
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I am your Research Companion. Choose your context and let's start analyzing your library.",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isContextModalOpen, setIsContextModalOpen] = useState(true)

    // Context State
    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])
    const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([])

    // Sessions
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [usage, setUsage] = useState(0)

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchSessions()
        fetchQuota()
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const fetchSessions = async () => {
        try {
            const data = await apiClient("/api/v1/chat/sessions")
            if (data.ok) {
                const sessionsData = await data.json()
                setSessions(sessionsData.map((s: any) => ({
                    id: s.id,
                    title: s.title,
                    lastMessage: s.history?.[s.history.length - 1]?.content || "Empty session",
                    timestamp: new Date(s.created_at)
                })))
            }
        } catch (error) {
            console.error("Failed to fetch sessions")
        }
    }

    const fetchQuota = async () => {
        try {
            const res = await apiClient("/api/v1/user/quotas")
            if (res.ok) {
                const data = await res.json()
                const creditQuota = data.find((q: any) => q.feature === "credits")
                if (creditQuota) {
                    const pct = (creditQuota.used / creditQuota.limit) * 100
                    setUsage(Math.round(pct))
                }
            }
        } catch (error) { }
    }

    const selectSession = async (sessionId: string) => {
        setIsLoading(true)
        setCurrentSessionId(sessionId)
        try {
            const res = await apiClient(`/api/v1/chat/sessions/${sessionId}`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data.history.length > 0 ? data.history.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                })) : [{
                    id: "welcome",
                    role: "assistant",
                    content: `Welcome back to "${data.title}". How can I help with your research?`,
                    timestamp: new Date()
                }])
                setSelectedProjectIds(data.project_ids || [])
                setSelectedPaperIds(data.paper_ids || [])
            }
        } catch (error) {
            toast.error("Failed to load session")
        } finally {
            setIsLoading(false)
        }
    }

    const saveHistory = async (newMessages: ChatMessage[], sessionId: string) => {
        try {
            await apiClient(`/api/v1/chat/sessions/${sessionId}`, {
                method: "PATCH",
                body: JSON.stringify({
                    history: newMessages
                })
            })
        } catch (error) {
            console.error("Failed to save history")
        }
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        let sessionId = currentSessionId

        // If no session, create one
        if (!sessionId) {
            try {
                const newSessionRes = await apiClient("/api/v1/chat/sessions", {
                    method: "POST",
                    body: JSON.stringify({
                        title: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
                        project_ids: selectedProjectIds,
                        paper_ids: selectedPaperIds
                    })
                })
                if (newSessionRes.ok) {
                    const newSession = await newSessionRes.json()
                    sessionId = newSession.id
                    setCurrentSessionId(sessionId)
                    fetchSessions()
                } else {
                    toast.error("Failed to create chat session")
                    return
                }
            } catch (error) {
                console.error("Create session error", error)
                return
            }
        }

        const userMsg: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            role: "user",
            content: input,
            timestamp: new Date(),
            metadata: {
                projects: selectedProjectIds,
                papers: selectedPaperIds
            }
        }

        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const response = await apiClient("/api/v1/chat", {
                method: "POST",
                body: JSON.stringify({
                    query: input,
                    project_ids: selectedProjectIds,
                    paper_ids: selectedPaperIds
                })
            })

            if (!response.ok) throw new Error("Chat failed")

            const data = await response.json()

            const aiMsg: ChatMessage = {
                id: Math.random().toString(36).substr(2, 9),
                role: "assistant",
                content: data.response,
                timestamp: new Date(),
                metadata: {
                    tokens: data.tokens
                }
            }

            setMessages(prev => {
                const updated = [...prev, aiMsg]
                if (sessionId) saveHistory(updated, sessionId)
                return updated
            })

            fetchQuota()

        } catch (error: any) {
            toast.error(error.message || "Failed to get AI response")
            setMessages(prev => [...prev, {
                id: "error",
                role: "assistant",
                content: "I'm sorry, I'm having trouble connecting to the research knowledge base. Please try again later.",
                timestamp: new Date()
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const deleteSession = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await apiClient(`/api/v1/chat/sessions/${id}`, { method: "DELETE" })
            setSessions(prev => prev.filter(s => s.id !== id))
            if (currentSessionId === id) {
                setCurrentSessionId(null)
                clearChatUI()
            }
            toast.success("Session deleted")
        } catch (error) {
            toast.error("Failed to delete")
        }
    }

    const clearChatUI = () => {
        setCurrentSessionId(null)
        setMessages([{
            id: "initial",
            role: "assistant",
            content: "Welcome! Choose a session or start a new research query.",
            timestamp: new Date()
        }])
        setSelectedProjectIds([])
        setSelectedPaperIds([])
    }

    const exportConversation = () => {
        const text = messages.map(m => `[${m.role.toUpperCase()}] (${m.timestamp.toLocaleTimeString()}): ${m.content}`).join("\n\n")
        const blob = new Blob([text], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `research-chat-export-${new Date().toISOString()}.txt`
        a.click()
        toast.success("Conversation exported")
    }

    return (
        <div className="flex h-[calc(100vh-6rem)] w-full overflow-hidden bg-background rounded-3xl border shadow-2xl relative">
            {/* Sidebar - Chat History */}
            <div className={cn(
                "h-full border-r bg-muted/20 backdrop-blur-xl transition-all duration-300 flex flex-col",
                isSidebarOpen ? "w-72" : "w-0 overflow-hidden"
            )}>
                <div className="p-4 flex items-center justify-between border-b">
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-40">History</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => setIsSidebarOpen(false)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-3">
                    <Button className="w-full justify-start gap-2 h-11 rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none" onClick={clearChatUI}>
                        <Plus className="h-4 w-4" /> New Research Session
                    </Button>
                </div>

                <ScrollArea className="flex-1 p-2">
                    <div className="space-y-1">
                        {sessions.map(s => (
                            <div
                                key={s.id}
                                className={cn(
                                    "p-3 rounded-2xl cursor-pointer group transition-all relative",
                                    currentSessionId === s.id ? "bg-background border shadow-sm" : "hover:bg-muted/50"
                                )}
                                onClick={() => selectSession(s.id)}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold truncate max-w-[140px] font-sans">{s.title}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-40 hover:opacity-100 hover:text-destructive"
                                        onClick={(e) => deleteSession(s.id, e)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                                <p className="text-[10px] opacity-60 truncate font-medium">{s.lastMessage}</p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t space-y-4">
                    <UsageBar usage={usage} label="Research Credits" />
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-card border shadow-sm">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/avatar.png" />
                            <AvatarFallback>{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold truncate">{user?.full_name || "Guest Researcher"}</p>
                            <p className="text-[8px] opacity-60 uppercase tracking-tighter font-black">{user?.tier || "Free"} Plan</p>
                        </div>
                        <Settings className="h-4 w-4 opacity-40 hover:opacity-100 cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Side Toggle if hidden */}
            {!isSidebarOpen && (
                <div className="absolute left-4 top-4 z-20">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shadow-lg" onClick={() => setIsSidebarOpen(true)}>
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative bg-background/50 font-sans">
                {/* Header */}
                <div className="h-16 px-6 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                <h1 className="text-sm font-black italic tracking-tighter uppercase leading-none">AI Research Engine</h1>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                                <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                    {selectedProjectIds.length === 0 ? "General Knowledge" : (
                                        <>Grounded in <span className="text-primary">{selectedProjectIds.length} Projects</span></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-9 rounded-xl font-bold flex items-center gap-2" onClick={() => setIsContextModalOpen(true)}>
                            <Database className="h-4 w-4 text-primary" />
                            Change Context
                        </Button>
                        <div className="w-px h-4 bg-border mx-2" />
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary" onClick={exportConversation}>
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive" onClick={clearChatUI}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-6 pt-6 pb-24">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {messages.map((m) => (
                            <div key={m.id} className={cn(
                                "flex gap-4 p-4 rounded-3xl transition-all relative group",
                                m.role === "assistant" ? "bg-muted/10 border border-transparent hover:border-muted-foreground/10" : "flex-row-reverse"
                            )}>
                                <div className={cn(
                                    "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                    m.role === "assistant" ? "bg-gradient-to-br from-primary to-purple-600 text-white" : "bg-card border"
                                )}>
                                    {m.role === "assistant" ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
                                </div>
                                <div className={cn(
                                    "flex-1 space-y-2",
                                    m.role === "user" ? "text-right" : ""
                                )}>
                                    <div className={cn(
                                        "text-sm leading-relaxed whitespace-pre-wrap font-medium",
                                        m.role === "user" ? "text-foreground/90" : "text-foreground"
                                    )}>
                                        {m.content}
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity",
                                        m.role === "user" ? "justify-end" : "justify-start"
                                    )}>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {m.metadata?.tokens && (
                                            <>
                                                <span className="h-1 w-1 bg-muted-foreground rounded-full" />
                                                <span className="text-[10px] font-bold text-primary">{m.metadata.tokens} Tokens</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input Container */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/95 to-transparent">
                    <div className="max-w-3xl mx-auto relative group">
                        {isLoading && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm border px-4 py-2 rounded-full shadow-2xl animate-bounce">
                                <Loader2Icon className="h-3 w-3 animate-spin text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">AI Thinking...</span>
                            </div>
                        )}
                        <div className="relative border-2 border-muted-foreground/10 group-focus-within:border-primary/30 rounded-3xl bg-background shadow-2xl transition-all p-1.5 flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-muted/50" onClick={() => setIsContextModalOpen(true)}>
                                <Database className="h-5 w-5 text-muted-foreground" />
                            </Button>
                            <Input
                                placeholder="Consult your research library..."
                                className="border-none bg-transparent h-12 shadow-none focus-visible:ring-0 text-base font-medium placeholder:text-muted-foreground/50"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                            />
                            <Button
                                className="h-10 px-6 rounded-2xl font-bold bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Ask AI
                            </Button>
                        </div>
                    </div>
                    <p className="text-[9px] text-center font-black uppercase tracking-[0.2em] opacity-30 mt-4">
                        Precision RAG • Multi-Context • Grounded Intelligence
                    </p>
                </div>
            </div>

            {/* Modals */}
            <ContextSelector
                isOpen={isContextModalOpen}
                onClose={() => setIsContextModalOpen(false)}
                onConfirm={(projects, papers) => {
                    setSelectedProjectIds(projects)
                    setSelectedPaperIds(papers)
                    toast.success("Active research context updated")
                }}
            />
        </div>
    )
}

function Loader2Icon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin", className)}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
