"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Send, 
    Bot, 
    User, 
    Plus, 
    Trash2, 
    Download, 
    Sparkles, 
    Database, 
    ChevronLeft, 
    MessageSquare, 
    Loader2,
    X,
    Clock,
    Paperclip
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ContextSelector } from "./context-selector"
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
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isContextModalOpen, setIsContextModalOpen] = useState(false)
    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])
    const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([])
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchSessions()
        // Initial welcome message if no session
        if (!currentSessionId && messages.length === 0) {
            setMessages([{
                id: "initial",
                role: "assistant",
                content: "Greetings researcher. I'm your AI Research Engine. Choose a context from your projects and let's begin synthesizing data.",
                timestamp: new Date()
            }])
        }
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

    const selectSession = async (sessionId: string) => {
        setIsLoading(true)
        setCurrentSessionId(sessionId)
        try {
            const res = await apiClient(`/api/v1/chat/sessions/${sessionId}`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data.history.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                })))
                setSelectedProjectIds(data.project_ids || [])
                setSelectedPaperIds(data.paper_ids || [])
            }
        } catch (error) {
            toast.error("Failed to load session")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            role: "user",
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        let sessionId = currentSessionId
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
                }
            } catch (error) { console.error(error) }
        }

        try {
            const response = await apiClient("/api/v1/chat", {
                method: "POST",
                body: JSON.stringify({
                    query: input,
                    project_ids: selectedProjectIds,
                    paper_ids: selectedPaperIds
                })
            })

            const data = await response.json()
            const aiMsg: ChatMessage = {
                id: Math.random().toString(36).substr(2, 9),
                role: "assistant",
                content: data.response,
                timestamp: new Date(),
                metadata: { tokens: data.tokens }
            }

            setMessages(prev => [...prev, aiMsg])
            if (sessionId) {
                await apiClient(`/api/v1/chat/sessions/${sessionId}`, {
                    method: "PATCH",
                    body: JSON.stringify({ history: [...messages, userMsg, aiMsg] })
                })
            }
        } catch (error) {
            toast.error("Deep reasoning failure")
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
                setMessages([{ id: "new", role: "assistant", content: "New session started. How can I help?", timestamp: new Date() }])
            }
        } catch (error) { toast.error("Delete failed") }
    }

    const exportConversation = () => {
        const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`).join("\n\n")
        const blob = new Blob([text], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `research-chat.txt`
        a.click()
    }

    return (
        <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden bg-surface rounded-3xl border border-border shadow-xl relative animate-fade-up">
            {/* History Sidebar */}
            <div className={cn(
                "h-full border-r border-border bg-bg2/50 backdrop-blur-xl transition-all duration-300 flex flex-col",
                isSidebarOpen ? "w-80" : "w-0"
            )}>
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-[0.7rem] font-bold text-ink4 uppercase tracking-[0.2em]">Archive</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsSidebarOpen(false)}>
                        <ChevronLeft size={16} />
                    </Button>
                </div>

                <div className="p-4">
                    <Button 
                        onClick={() => { setCurrentSessionId(null); setMessages([{ id: "new", role: "assistant", content: "New workspace ready.", timestamp: new Date() }]); }}
                        className="w-full justify-start gap-2 h-11 rounded-xl bg-accent text-white font-bold text-[0.85rem] shadow-lg shadow-accent/10"
                    >
                        <Plus size={18} /> New Research Session
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-4 pb-4">
                    <div className="space-y-2">
                        {sessions.map(s => (
                            <div 
                                key={s.id} 
                                onClick={() => selectSession(s.id)}
                                className={cn(
                                    "p-4 rounded-2xl cursor-pointer group transition-all relative border",
                                    currentSessionId === s.id ? "bg-white border-accent/20 shadow-md" : "border-transparent hover:bg-white/50"
                                )}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <span className="text-[0.85rem] font-bold text-ink truncate leading-tight w-4/5">{s.title}</span>
                                    <button onClick={e => deleteSession(s.id, e)} className="text-ink4 hover:text-red opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                </div>
                                <div className="flex items-center gap-2 text-[0.65rem] text-ink4">
                                    <Clock size={10} /> {s.timestamp.toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                
                <div className="p-6 border-t border-border bg-bg2/30">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border shadow-sm">
                            <AvatarFallback className="bg-gold-bg text-gold font-bold">{user?.full_name?.charAt(0) || "R"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-[0.8rem] font-bold text-ink truncate">{user?.full_name || "Guest Researcher"}</p>
                            <p className="text-[0.6rem] text-ink4 uppercase tracking-widest font-black">{user?.tier || "Basic"} Membership</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex flex-col relative bg-surface overflow-hidden">
                {/* Header */}
                <div className="h-[70px] px-8 flex items-center justify-between border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="mr-2"><MessageSquare size={18} /></Button>}
                        <div>
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-gold animate-pulse" />
                                <h1 className="text-sm font-black uppercase tracking-[0.1em] text-ink">AI Research Engine</h1>
                                <Badge className="bg-teal-bg text-teal border-teal/10 text-[0.6rem] font-black tracking-widest px-1.5 ml-2">GROUNDED RAG</Badge>
                            </div>
                            <p className="text-[0.7rem] text-ink4 mt-0.5 font-bold uppercase tracking-wider">
                                {selectedProjectIds.length > 0 ? `Consulting ${selectedProjectIds.length} projects` : "General Academic Intelligence"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => setIsContextModalOpen(true)} className="rounded-full h-9 border-border bg-bg2 text-[0.75rem] font-bold flex items-center gap-2 hover:bg-accent-light hover:text-accent hover:border-accent/10 transition-all">
                            <Database size={14} /> Context Selector
                        </Button>
                        <div className="w-[1px] h-6 bg-border mx-1" />
                        <Button variant="ghost" size="icon" onClick={exportConversation} className="h-9 w-9 text-ink4 hover:text-ink"><Download size={18} /></Button>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <AnimatePresence>
                            {messages.map((m, idx) => (
                                <motion.div 
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-6",
                                        m.role === "user" ? "flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                        m.role === "assistant" ? "bg-accent text-white" : "bg-gold-bg text-gold shadow-gold/10"
                                    )}>
                                        {m.role === "assistant" ? <Bot size={22} /> : <User size={22} />}
                                    </div>
                                    <div className={cn(
                                        "flex-1 max-w-[85%]",
                                        m.role === "user" ? "text-right" : ""
                                    )}>
                                        <div className={cn(
                                            "inline-block rounded-3xl p-6 text-[0.95rem] leading-relaxed shadow-sm",
                                            m.role === "assistant" ? "bg-bg2/50 border border-border text-ink" : "bg-accent text-white font-medium"
                                        )}>
                                            {m.content}
                                        </div>
                                        <div className="flex items-center gap-3 mt-3 opacity-30 group-hover:opacity-100 transition-opacity px-2">
                                            <span className="text-[0.65rem] font-bold uppercase tracking-widest">{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {m.metadata?.tokens && <span className="text-[0.65rem] font-bold text-accent uppercase tracking-widest">• {m.metadata.tokens} Tokens</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isLoading && (
                            <div className="flex gap-6">
                                <div className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center animate-pulse"><Bot size={22} /></div>
                                <div className="bg-bg2/50 border border-border rounded-3xl p-6 flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                                    </div>
                                    <span className="text-[0.75rem] font-bold text-accent uppercase tracking-widest ml-2">Indexing Knowledge...</span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} className="h-20" />
                    </div>
                </ScrollArea>

                {/* Input Panel */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-surface via-surface/90 to-transparent pt-16">
                    <div className="max-w-4xl mx-auto relative">
                        <div className="bg-white border-2 border-border focus-within:border-accent/40 rounded-[2rem] shadow-2xl p-2 pl-6 flex items-center gap-4 transition-all">
                            <button onClick={() => setIsContextModalOpen(true)} className="text-ink4 hover:text-accent transition-colors"><Paperclip size={20} /></button>
                            <input 
                                placeholder="Query the research library..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-[1rem] font-medium h-12 text-ink placeholder:text-ink4/50"
                            />
                            <Button 
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="bg-accent text-white h-11 px-8 rounded-full font-bold flex items-center gap-2 hover:opacity-90 shadow-xl shadow-accent/20"
                            >
                                Send Prompt <Send size={18} />
                            </Button>
                        </div>
                        <p className="mt-4 text-[0.65rem] text-center text-ink4 font-bold uppercase tracking-[0.3em] opacity-40">
                            ResearchAI Engine v4.0 • Academic Precision
                        </p>
                    </div>
                </div>
            </div>

            {/* Context Selector Modal */}
            <ContextSelector 
                isOpen={isContextModalOpen} 
                onClose={() => setIsContextModalOpen(false)}
                onConfirm={(projects, papers) => {
                    setSelectedProjectIds(projects)
                    setSelectedPaperIds(papers)
                    setIsContextModalOpen(false)
                    toast.success("Context refined")
                }}
            />
        </div>
    )
}
