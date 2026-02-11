"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
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
    LayoutDashboard as GalleryIcon,
    Lock as LockIcon,
    Plus,
    MessageSquare,
    Layers
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { KanbanBoard } from "@/components/projects/kanban-board"
import { PaperContextMenu } from "@/components/projects/paper-context-menu"
import { ChatSheet } from "@/components/chat/chat-sheet"
import { AIInsights } from "@/components/projects/ai-insights"
import { projectService, ProjectResponse } from "@/services/project"
import { toast } from "sonner"
import Link from "next/link"
import { PaperTableView } from "@/components/projects/paper-table-view"
import { PaperGalleryView } from "@/components/projects/paper-gallery-view"
import { ProjectStatisticsCard } from "@/components/projects/project-stats"
import { SmartSuggestionsPanel } from "@/components/projects/smart-suggestions"
import { ExportModal } from "@/components/projects/export-modal"
import { aiService } from "@/services/ai"
import { useUserStore } from "@/lib/store"
import { UpgradeModal } from "@/components/upgrade-modal"
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog"
import { DeletePapersModal } from "@/components/projects/delete-papers-modal"

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
    const [selectedInsights, setSelectedInsights] = useState<any>(null)
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false)

    useEffect(() => {
        if (projectId) {
            fetchProjectDetails()
            fetchProjectAnalytics()
        }
    }, [projectId])

    const fetchProjectDetails = async () => {
        // Only show full loading if we don't have project data yet
        if (!project) {
            setIsLoading(true)
        }

        try {
            const data = await projectService.getProjectDetails(projectId)
            setProject(data)
            setNotes(data.notes || "")
        } catch (error: any) {
            toast.error("Error loading project details")
            router.push("/dashboard/projects")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefresh = async () => {
        await Promise.all([
            fetchProjectDetails(),
            fetchProjectAnalytics()
        ])
    }

    const fetchProjectAnalytics = async () => {
        try {
            const response = await fetch(`/api/v1/projects/${projectId}/analytics`, {
                headers: {
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("smart-research-storage") || "{}")?.state?.user?.access_token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error("Failed to fetch analytics")
        }
    }

    const [viewMode, setViewMode] = useState<"kanban" | "table" | "gallery">("kanban")
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [isExportModalOpen, setIsExportModalOpen] = useState(false)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [isDeletePapersOpen, setIsDeletePapersOpen] = useState(false)
    const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false)
    const [chatContext, setChatContext] = useState({ id: "", title: "" })
    const { user } = useUserStore()
    const userTier = user?.tier || "student"

    const papers = project?.papers || []

    const handleAction = (action: string, paperId: string) => {
        const paper = papers.find((p: any) => p.id === paperId)
        if (!paper) return

        switch (action) {
            case "chat":
                setChatContext({ id: paper.id, title: paper.title })
                setIsChatOpen(true)
                break
            case "summarize":
                const runSummarize = async () => {
                    const id = toast.loading(`Analyzing "${paper.title}"...`)
                    try {
                        const summary = await aiService.generateSummary(paper.title, paper.abstract || "No abstract available.")
                        toast.success("Summary generated!", { id })
                        // In a real app, we might open a modal here
                    } catch (error: any) {
                        toast.error(error.message || "Failed to generate summary", { id })
                    }
                }
                runSummarize()
                break
            case "insights":
                const runInsights = async () => {
                    const id = toast.loading(`Extracting insights from "${paper.title}"...`)
                    try {
                        const insights = await aiService.extractInsights(paper.abstract || "No abstract available.")
                        toast.success("Insights extracted!", {
                            id,
                            action: {
                                label: "View Insights",
                                onClick: () => {
                                    setSelectedInsights({
                                        title: paper.title,
                                        content: insights
                                    })
                                    setIsInsightsModalOpen(true)
                                }
                            }
                        })
                    } catch (error: any) {
                        toast.error(error.message || "Failed to extract insights", { id })
                    }
                }
                runInsights()
                break
            case "find_similar":
                toast.info(`Looking for papers similar to: ${paper.title}`)
                router.push(`/dashboard/search?q=${encodeURIComponent(paper.title)}&similar=${paper.id}`)
                break
            case "view_original":
                const url = paper.storage_url || paper.pdf_url || paper.url
                if (url) {
                    window.open(url, "_blank")
                } else {
                    toast.error("No source URL available for this paper")
                }
                break
            case "remove":
                const runRemove = async () => {
                    const id = toast.loading(`Removing "${paper.title}"...`)
                    try {
                        await projectService.removePaper(projectId, paper.id)
                        await fetchProjectDetails()
                        toast.success("Paper removed from project", { id })
                    } catch (error: any) {
                        toast.error(error.message || "Failed to remove paper", { id })
                    }
                }
                runRemove()
                break
            default:
                console.log("Action:", action, "on paper:", paperId)
        }
    }

    const handleDeleteProject = async () => {
        if (!project) return

        try {
            await projectService.deleteProject(projectId)
            router.push('/dashboard/projects')
        } catch (error) {
            console.error('Failed to delete project:', error)
        }
    }

    const handleDeletePapers = async (paperIds: string[]) => {
        if (paperIds.length === 0) return

        try {
            // Delete each paper from the project
            await Promise.all(
                paperIds.map(paperId =>
                    projectService.removePaper(projectId, paperId)
                )
            )

            // Refresh the papers list
            await fetchProjectDetails()
            setIsDeletePapersOpen(false)
        } catch (error) {
            console.error('Failed to delete papers:', error)
        }
    }

    const handleSaveNotes = async () => {
        setIsSavingNotes(true)
        const toastId = toast.loading("Saving notes...")
        try {
            await projectService.updateProject(projectId, { notes })
            toast.success("Notes saved successfully", { id: toastId })
            // Refresh local project data
            setProject({ ...project, notes })
        } catch (error: any) {
            toast.error(error.message || "Failed to save notes", { id: toastId })
        } finally {
            setIsSavingNotes(false)
        }
    }

    if (isLoading) return <div className="p-8">Loading project details...</div>
    if (!project) return null


    return (
        <div className="space-y-6">
            {/* Project Header */}
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/projects">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
                        <Badge variant="outline" className="h-6 px-2 text-xs font-mono">
                            {stats.totalPapers || project.papers?.length || 0} / {userTier === "student" ? "10" : userTier === "professor" ? "20" : "∞"} Papers
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        {project.description || "Research workspace overview and paper management."}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsExportModalOpen(true)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (userTier !== "researcher") {
                                setIsInviteModalOpen(true)
                            } else {
                                // Actual invite/share logic for researchers
                                toast.info("Invite collaborators feature coming soon")
                            }
                        }}
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        Invite
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsDeletePapersOpen(true)}>
                                Delete Papers
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setIsDeleteProjectOpen(true)}
                                className="text-destructive"
                            >
                                Delete Project
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Delete Papers Modal */}
            <DeletePapersModal
                isOpen={isDeletePapersOpen}
                onOpenChange={setIsDeletePapersOpen}
                papers={papers}
                onDelete={async (paperIds) => {
                    for (const paperId of paperIds) {
                        await projectService.removePaper(projectId, paperId)
                    }
                    await fetchProjectDetails()
                    toast.success(`Deleted ${paperIds.length} paper(s)`)
                }}
            />

            <aside className="space-y-6">
                <ProjectStatisticsCard stats={stats} />
                <SmartSuggestionsPanel
                    projectId={projectId}
                    papers={papers}
                    projectTitle={project.name}
                    onPaperAdded={handleRefresh}
                />
            </aside>

            {/* Main Tabs */}
            <Tabs defaultValue="papers" className="w-full">
                <TabsList className="grid w-full grid-cols-4 max-w-[400px]">
                    <TabsTrigger value="papers">Papers</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="network">Network</TabsTrigger>
                </TabsList>

                <TabsContent value="papers" className="mt-6 space-y-4">
                    <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg border border-dashed">
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === "kanban" ? "secondary" : "ghost"}
                                size="sm"
                                className={viewMode === "kanban" ? "bg-background shadow-sm" : ""}
                                onClick={() => setViewMode("kanban")}
                            >
                                <LayoutGrid className="h-4 w-4 mr-2" />
                                Kanban
                            </Button>
                            <Button
                                variant={viewMode === "table" ? "secondary" : "ghost"}
                                size="sm"
                                className={viewMode === "table" ? "bg-background shadow-sm" : ""}
                                onClick={() => setViewMode("table")}
                            >
                                <TableIcon className="h-4 w-4 mr-2" />
                                Table
                            </Button>
                            <Button
                                variant={viewMode === "gallery" ? "secondary" : "ghost"}
                                size="sm"
                                className={viewMode === "gallery" ? "bg-background shadow-sm" : ""}
                                onClick={() => setViewMode("gallery")}
                            >
                                <GalleryIcon className="h-4 w-4 mr-2" />
                                Gallery
                            </Button>
                        </div>
                        <Button size="sm" asChild>
                            <Link href="/dashboard/search">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Papers
                            </Link>
                        </Button>
                    </div>

                    {papers.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center p-20 text-center border-dashed bg-muted/5">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                            <h3 className="text-lg font-semibold">No papers in this project</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-[300px]">
                                Start by searching for papers or uploading PDFs directly to this project.
                            </p>
                            <div className="flex gap-3 mt-8">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/dashboard/search">Search Papers</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/dashboard/upload">Upload PDF</Link>
                                </Button>
                            </div>
                        </Card>
                    ) : (viewMode === "kanban" ? (
                        <KanbanBoard
                            papers={papers}
                            onStatusChange={(id, status) => console.log(id, status)}
                            onAction={handleAction}
                        />
                    ) : viewMode === "gallery" ? (
                        <PaperGalleryView
                            papers={papers}
                            onAction={handleAction}
                        />
                    ) : (
                        <PaperTableView
                            papers={papers}
                            onAction={handleAction}
                        />
                    ))}

                    <div className="pt-8 border-t border-dashed">
                        {/* Suggestions now handled in top aside */}
                    </div>
                </TabsContent>

                <TabsContent value="insights" className="mt-6 space-y-6">
                    <AIInsights projectId={projectId} papers={papers} projectTitle={project.name} />
                </TabsContent>

                <TabsContent value="notes" className="mt-6">
                    <Card className="min-h-[400px] flex flex-col">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center text-lg">
                                    <PenLine className="h-5 w-5 mr-3 text-primary" />
                                    Research Notes
                                </CardTitle>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleSaveNotes}
                                    disabled={isSavingNotes || notes === (project?.notes || "")}
                                >
                                    {isSavingNotes ? "Saving..." : "Save Notes"}
                                </Button>
                            </div>
                        </CardHeader>
                        <textarea
                            className="flex-1 p-6 bg-transparent outline-none resize-none text-sm leading-relaxed"
                            placeholder="Start writing your thoughts, research questions, or drafting segments of your paper..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Card>
                </TabsContent>

                <TabsContent value="network" className="mt-6">
                    <Card className="p-20 text-center border-dashed">
                        <LayersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-semibold">Citation Network Visualization</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                            Visualize how the papers in your project are connected and discover influential researchers.
                        </p>
                        <Badge variant="secondary" className="mt-4">Researcher Feature Only</Badge>
                    </Card>
                </TabsContent>
            </Tabs >

            <ExportModal
                projectName={project.name}
                paperCount={papers.length}
                isOpen={isExportModalOpen}
                onOpenChange={setIsExportModalOpen}
                userTier={userTier}
            />


            {/* Upgrade Modal for Invite Feature */}
            <UpgradeModal
                isOpen={isInviteModalOpen}
                onOpenChange={setIsInviteModalOpen}
                title="Researcher Only Feature"
                description="Inviting collaborators to projects is available for Researcher and Professor tiers."
                requiredTier="researcher"
                feature="collaboration and team sharing"
            />

            {/* Global Chat Sheet */}
            <ChatSheet
                isOpen={isChatOpen}
                onOpenChange={setIsChatOpen}
                contextId={projectId}
                contextTitle={project.name}
                papers={papers}
            />

            {/* Floating Chat Trigger for Project Context */}
            <Button
                size="icon"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 group hover:scale-105 transition-transform"
                onClick={() => {
                    setChatContext({ id: "", title: "" }) // Reset to project context
                    setIsChatOpen(true)
                }}
            >
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-background animate-bounce">
                    AI
                </div>
                <MessageSquare className="h-6 w-6" />
                <span className="sr-only">Chat with Assistant</span>
            </Button>

            {/* AI Insights Modal */}
            <Dialog open={isInsightsModalOpen} onOpenChange={setIsInsightsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-500" />
                            AI Research Insights
                        </DialogTitle>
                        <DialogDescription>
                            Deep analysis for: {selectedInsights?.title}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="bg-muted/50 p-6 rounded-xl border leading-relaxed whitespace-pre-wrap">
                                {selectedInsights?.content}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsInsightsModalOpen(false)}>
                            Close
                        </Button>
                        <Button onClick={() => {
                            setChatContext({ id: "", title: selectedInsights?.title || "Paper" })
                            setIsChatOpen(true)
                            setIsInsightsModalOpen(false)
                        }}>
                            Discuss with AI
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    )
}

function LayersIcon({ className }: { className?: string }) {
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
            className={className}
        >
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
            <path d="m2.6 10.33 8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9" />
            <path d="m2.6 14.33 8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9" />
            <path d="m2.6 18.33 8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9" />
        </svg>
    )
}
