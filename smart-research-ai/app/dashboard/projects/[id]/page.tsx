"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft,
    FileText,
    LayoutGrid,
    Table as TableIcon,
    BarChart3,
    PenLine,
    MoreVertical,
    Share2,
    Download,
    Sparkles,
    Plus,
    MessageSquare,
    Layers,
    ChevronRight,
    Search,
    Filter,
    X,
    Trash2,
    BookOpen,
    Quote,
    ExternalLink,
    Settings,
    User,
    Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger, 
    DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { KanbanBoard } from "@/components/projects/kanban-board"
import { ChatSheet } from "@/components/chat/chat-sheet"
import { AIInsights } from "@/components/projects/ai-insights"
import { projectService } from "@/services/project"
import { aiService } from "@/services/ai"
import { useUserStore } from "@/lib/store"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function ProjectDetailPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string

    const [project, setProject] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        totalPapers: 0,
        totalCitations: 0,
        topAuthor: "Loading...",
        citationVelocity: 0,
        avgYear: 0
    })
    const [notes, setNotes] = useState("")
    const [isSavingNotes, setIsSavingNotes] = useState(false)
    const [viewMode, setViewMode] = useState<"kanban" | "table" | "gallery">("kanban")
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [selectedInsights, setSelectedInsights] = useState<any>(null)
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false)

    const { user } = useUserStore()
    const userTier = user?.tier || "payg"

    useEffect(() => {
        if (projectId) {
            fetchProjectDetails()
            fetchProjectAnalytics()
        }
    }, [projectId])

    const fetchProjectDetails = async () => {
        setIsLoading(true)
        try {
            const data = await projectService.getProjectDetails(projectId)
            setProject(data)
            setNotes(data.notes || "")
        } catch (error: any) {
            toast.error("Project access denied")
            router.push("/dashboard/projects")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchProjectAnalytics = async () => {
        try {
            const response = await fetch(`/api/v1/projects/${projectId}/analytics`, {
                headers: { "Authorization": `Bearer ${useUserStore.getState().user?.access_token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) { console.error(error) }
    }

    const handleAction = (action: string, paperId: string) => {
        const paper = project?.papers?.find((p: any) => p.id === paperId)
        if (!paper) return

        switch (action) {
            case "chat":
                setIsChatOpen(true)
                break
            case "summarize":
                const id = toast.loading("Synthesizing paper...")
                aiService.generateSummary(paper.title, paper.abstract || "")
                    .then(s => {
                        toast.success("Synthesis complete", { id })
                        setSelectedInsights({ title: paper.title, content: s })
                        setIsInsightsModalOpen(true)
                    })
                    .catch(() => toast.error("Synthesis failed", { id }))
                break
            case "view_original":
                const url = paper.storage_url || paper.pdf_url || paper.url
                if (url) window.open(url, "_blank")
                break
            case "remove":
                if (!confirm(`Remove "${paper.title}" from project?`)) return
                projectService.removePaper(projectId, paper.id).then(() => {
                    toast.success("Paper removed")
                    fetchProjectDetails()
                })
                break
        }
    }

    if (isLoading) return (
        <div className="h-full flex flex-col items-center justify-center py-20 pointer-events-none">
            <div className="animate-spin w-10 h-10 border-4 border-accent border-t-transparent rounded-full mb-4" />
            <p className="text-ink3 font-serif italic text-lg tracking-wide">Initializing workspace...</p>
        </div>
    )

    if (!project) return null

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-up">
            {/* Header Area */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-ink4 font-bold text-[0.7rem] uppercase tracking-widest">
                    <Link href="/dashboard/projects" className="hover:text-accent transition-colors">Projects</Link>
                    <ChevronRight size={12} />
                    <span className="text-ink">Workspace Detail</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-5xl font-serif text-ink">{project.name}</h1>
                            <Badge className="bg-gold-bg text-gold border-gold/10 font-black h-6 px-2">{project.papers?.length || 0} PAPERS</Badge>
                        </div>
                        <p className="text-ink3 text-[1rem] max-w-2xl italic leading-relaxed">
                            {project.description || "Active research workspace for specialized knowledge synthesis."}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full border border-border"><MoreVertical size={20} /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl border-border shadow-2xl p-2">
                                <DropdownMenuItem
                                    onClick={() => {
                                        const text = [project.name, project.description, ...(project.papers || []).map((p: any) => `${p.title} — ${p.authors?.[0]} (${p.year})`)].join("\n")
                                        const blob = new Blob([text], { type: "text/plain" })
                                        const url = URL.createObjectURL(blob)
                                        const a = document.createElement("a"); a.href = url; a.download = `${project.name}.txt`; a.click()
                                    }}
                                    className="rounded-xl py-3 px-4 focus:bg-accent-light text-ink font-bold flex items-center gap-2 cursor-pointer"
                                >
                                    <Download className="w-4 h-4" /> Export Workspace
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1" />
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return
                                        projectService.deleteProject(projectId).then(() => {
                                            toast.success("Project deleted")
                                            router.push("/dashboard/projects")
                                        }).catch(() => toast.error("Delete failed"))
                                    }}
                                    className="rounded-xl py-3 px-4 focus:bg-red-bg text-red-500 flex items-center gap-2 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Project
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Cit. Velocity", val: stats.citationVelocity.toFixed(1), color: "accent", icon: BarChart3 },
                    { label: "Top Researcher", val: stats.topAuthor.split(",")[0], color: "teal", icon: User },
                    { label: "Avg Pub Year", val: stats.avgYear || "-", color: "gold", icon: Calendar },
                    { label: "Total Ref. Count", val: stats.totalCitations, color: "ink", icon: Quote },
                ].map((s, i) => {
                    const SIcon = s.icon
                    return (
                    <div key={i} className="bg-surface border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2 text-ink4">
                            <SIcon size={16} className={cn("text-" + s.color)} />
                            <span className="text-[0.65rem] font-black uppercase tracking-widest">{s.label}</span>
                        </div>
                        <div className="text-2xl font-serif text-ink truncate">{s.val}</div>
                    </div>
                )})}
            </div>

            {/* Tabbed Interaction Area */}
            <Tabs defaultValue="papers" className="w-full">
                <TabsList className="h-auto p-0 bg-transparent gap-8 border-b border-border rounded-none flex justify-start mb-8">
                    {["papers", "insights", "notes", "network"].map(tab => (
                        <TabsTrigger 
                            key={tab} 
                            value={tab} 
                            className="bg-transparent border-none p-0 pb-4 h-auto data-[state=active]:bg-transparent data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none shadow-none text-[0.85rem] font-bold uppercase tracking-widest text-ink4"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="papers" className="mt-0 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 bg-bg2 p-1.5 rounded-2xl border border-border shadow-inner">
                            <Button variant={viewMode === "kanban" ? "surface" : "ghost"} size="sm" onClick={() => setViewMode("kanban")} className="h-9 px-4 rounded-xl font-bold flex items-center gap-2"><LayoutGrid size={16} /> Kanban</Button>
                            <Button variant={viewMode === "table" ? "surface" : "ghost"} size="sm" onClick={() => setViewMode("table")} className="h-9 px-4 rounded-xl font-bold flex items-center gap-2"><TableIcon size={16} /> Table</Button>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="rounded-full shadow-sm flex items-center gap-2 border-border" asChild>
                                <Link href="/dashboard/search"><Search size={16} /> Expand Search</Link>
                            </Button>
                            <Button className="rounded-full bg-accent text-white font-bold h-11 px-8 shadow-lg shadow-accent/20" asChild>
                                <Link href="/dashboard/upload"><Plus size={18} className="mr-2" /> Add Research</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="min-h-[500px]">
                        {project.papers?.length > 0 ? (
                            <div className="animate-fade-up">
                                {viewMode === "kanban" ? (
                                    <KanbanBoard papers={project.papers} onStatusChange={() => {}} onAction={handleAction} />
                                ) : (
                                    <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
                                        <div className="p-8 border-b border-border font-serif italic text-ink/50 text-center">Visual list view optimized for metadata analysis.</div>
                                        {/* Simplified list for now as PaperTableView is externalized */}
                                        <div className="divide-y divide-border">
                                            {project.papers.map((p: any) => (
                                                <div key={p.id} className="p-6 flex items-center justify-between hover:bg-bg2 transition-colors group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-accent-light text-accent rounded-xl flex items-center justify-center shrink-0"><BookOpen size={20} /></div>
                                                        <div>
                                                            <h4 className="font-bold text-ink underline-offset-4 group-hover:underline cursor-pointer">{p.title}</h4>
                                                            <p className="text-[0.7rem] text-ink4 font-bold uppercase tracking-widest mt-1">{p.authors?.[0]} • {p.year}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => handleAction("chat", p.id)} className="rounded-full text-accent"><MessageSquare size={18} /></Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 space-y-8 bg-muted/10 border-2 border-dashed border-border rounded-[3rem]">
                                <div className="w-20 h-20 bg-surface border border-border rounded-2xl shadow-xl flex items-center justify-center mx-auto text-ink4"><FileText size={32} /></div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-serif text-ink">Library Empty</h3>
                                    <p className="text-ink3 text-[0.9rem] max-w-sm mt-2 mx-auto">No papers have been indexed for this project yet. Start by expanding your search or uploading papers.</p>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="rounded-full px-8 h-12 font-bold" asChild><Link href="/dashboard/search">Search Papers</Link></Button>
                                    <Button className="bg-gold text-white rounded-full px-8 h-12 font-bold" asChild><Link href="/dashboard/upload">Upload PDF</Link></Button>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="insights" className="mt-0 space-y-8">
                    <AIInsights projectId={projectId} papers={project.papers} projectTitle={project.name} />
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-surface border border-border rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col min-h-[600px]">
                                <div className="p-8 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-accent-light text-accent flex items-center justify-center rounded-xl"><PenLine size={20} /></div>
                                        <h3 className="text-xl font-serif text-ink">Research Chronicle</h3>
                                    </div>
                                    <Button 
                                        onClick={() => {
                                            setIsSavingNotes(true)
                                            projectService.updateProject(projectId, { notes })
                                                .then(() => toast.success("Chronicle Recorded"))
                                                .finally(() => setIsSavingNotes(false))
                                        }}
                                        disabled={isSavingNotes}
                                        className="rounded-full bg-ink text-white font-bold px-6"
                                    >
                                        {isSavingNotes ? "Recording..." : "Save Chronicles"}
                                    </Button>
                                </div>
                                <textarea 
                                    className="flex-1 p-10 bg-transparent border-none focus:ring-0 text-[1.1rem] leading-[1.8] font-serif italic text-ink placeholder:text-ink4/30 resize-none outline-none"
                                    placeholder="Begin drafting your synthesis, theoretical frameworks, or initial observations here..."
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-gold-bg border border-gold/10 p-8 rounded-3xl shadow-lg relative overflow-hidden">
                                <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-gold/5" />
                                <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-gold mb-4">AI Copilot Tip</h4>
                                <p className="text-[0.9rem] text-ink leading-relaxed font-serif italic">
                                    "Your notes are automatically used to ground my responses when we chat in this project context. Elaborate on your thesis for better precision."
                                </p>
                            </div>

                            <div className="bg-surface border border-border p-8 rounded-3xl shadow-sm space-y-6">
                                <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-ink4 border-b pb-4">Workspace Index</h4>
                                <div className="space-y-4">
                                    {project.papers?.slice(0, 5).map((p: any) => (
                                        <div key={p.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => handleAction("chat", p.id)}>
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full group-hover:scale-150 transition-transform" />
                                            <span className="text-[0.8rem] font-bold text-ink2 truncate group-hover:text-ink transition-colors">{p.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="network" className="mt-0">
                    <div className="py-24 text-center bg-bg2 rounded-[3rem] border border-border border-dashed space-y-8">
                        <div className="w-24 h-24 bg-surface border border-border rounded-full flex items-center justify-center mx-auto text-ink4"><Layers size={40} /></div>
                        <div>
                            <h3 className="text-3xl font-serif text-ink italic leading-tight">Visualizing Knowledge <em className="italic">Networks</em></h3>
                            <p className="text-ink3 text-[1rem] max-w-sm mx-auto mt-4">Discover citation threads and researcher connections within your indexed papers.</p>
                        </div>
                        <Badge className="bg-gold-bg text-gold border-gold/10 font-bold px-4 py-1">PRO FEATURE</Badge>
                    </div>
                </TabsContent>
            </Tabs>

            {/* AI Insights Modal */}
            <Dialog open={isInsightsModalOpen} onOpenChange={setIsInsightsModalOpen}>
                <DialogContent className="max-w-3xl rounded-[2.5rem] border-border p-10 overflow-y-auto max-h-[85vh]">
                    {selectedInsights && (
                        <div className="space-y-8 animate-fade-up">
                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-accent text-white rounded-lg flex items-center justify-center"><Sparkles size={16} /></div>
                                        <Badge className="bg-teal-bg text-teal font-black text-[0.6rem] uppercase tracking-widest">Grounded Synthesis</Badge>
                                    </div>
                                    <h2 className="text-2xl font-serif text-ink leading-tight">{selectedInsights.title}</h2>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsInsightsModalOpen(false)} className="rounded-full"><X size={20} /></Button>
                            </div>

                            <div className="p-8 bg-bg2/50 rounded-3xl border border-border italic text-ink leading-[1.8] text-[1.05rem] relative">
                                <Quote size={48} className="absolute -top-4 -left-4 text-gold/10" />
                                {selectedInsights.content}
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 h-12 rounded-xl bg-accent text-white font-bold" onClick={() => { setIsChatOpen(true); setIsInsightsModalOpen(false); }}>
                                    Launch Deep Reasoning
                                </Button>
                                <Button variant="outline" className="flex-1 h-12 rounded-xl border-border font-bold" onClick={() => setIsInsightsModalOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Global Chat Overlay */}
            <ChatSheet 
                isOpen={isChatOpen} 
                onOpenChange={setIsChatOpen} 
                contextId={projectId} 
                contextTitle={project.name} 
                papers={project.papers} 
            />

            {/* Floating Quick Prompt */}
            <button 
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-10 right-10 bg-accent text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
            >
                <div className="absolute -top-2 -right-2 bg-gold text-white text-[0.6rem] font-black px-2 py-0.5 rounded-full border-2 border-surface shadow-md">AI</div>
                <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
            </button>
        </div>
    )
}
