"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, 
    MoreHorizontal, 
    Folder, 
    Loader2, 
    Trash2, 
    ChevronRight, 
    Calendar, 
    FileText, 
    Settings,
    LayoutGrid,
    Search,
    Filter,
    ArrowUpRight,
    Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { projectService, ProjectResponse } from "@/services/project"
import { useUserStore } from "@/lib/store"
import { UpgradeModal } from "@/components/upgrade-modal"
import { PaperDeleteModal } from "@/components/projects/paper-delete-modal"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

const TIER_LIMITS: Record<string, number> = {
    payg: 10,
    pro: 999,
}

export default function ProjectsPage() {
    const { user } = useUserStore()
    const userTier = user?.tier || "payg"
    const limit = TIER_LIMITS[userTier] ?? 10

    const [projects, setProjects] = useState<ProjectResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newProjectName, setNewProjectName] = useState("")
    const [newProjectDesc, setNewProjectDesc] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
    const [isDeletePapersModalOpen, setIsDeletePapersModalOpen] = useState(false)
    const [selectedProjectForDelete, setSelectedProjectForDelete] = useState<ProjectResponse | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setIsLoading(true)
        try {
            const data = await projectService.getProjects()
            setProjects(data)
        } catch (error: any) {
            toast.error("Failed to load projects", { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return
        setIsCreating(true)
        try {
            await projectService.createProject({
                name: newProjectName,
                description: newProjectDesc
            })
            toast.success("Project Initiated", { description: `"${newProjectName}" is ready for research.` })
            setIsCreateDialogOpen(false)
            setNewProjectName("")
            setNewProjectDesc("")
            fetchProjects()
        } catch (error: any) {
            toast.error("Creation failed", { description: error.message })
        } finally {
            setIsCreating(false)
        }
    }

    const handleDeleteProject = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to permanently delete "${name}"? all indexed papers will be removed from Milvus.`)) return
        try {
            await projectService.deleteProject(id)
            toast.success("Project Purged")
            setProjects(projects.filter(p => p.id !== id))
        } catch (error: any) {
            toast.error("Delete failed", { description: error.message })
        }
    }

    const filteredProjects = projects
        .filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            return sortOrder === "newest" ? diff : -diff
        })

    const isAtLimit = projects.length >= limit

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-up">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif text-ink mb-2">
                        Research <em className="italic">Workspaces</em>
                    </h1>
                    <p className="text-ink3 text-[0.95rem] max-w-xl">
                        Manage your thematic research projects. Each workspace provides isolated grounding for our AI engines.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="h-10 px-4 rounded-full border-border bg-bg2 text-ink4 font-bold uppercase tracking-wider text-[0.7rem]">
                        {projects.length} / {userTier === 'pro' ? '∞' : limit} Workspaces
                    </Badge>
                    <Button 
                        onClick={() => isAtLimit ? setIsUpgradeModalOpen(true) : setIsCreateDialogOpen(true)}
                        className="h-10 px-6 rounded-full bg-accent text-white font-bold shadow-lg shadow-accent/20 hover:opacity-90 flex items-center gap-2"
                    >
                        <Plus size={18} /> New Workspace
                    </Button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface border border-border rounded-2xl p-4 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4" size={16} />
                    <Input 
                        placeholder="Filter projects..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 bg-bg2/50 border-border rounded-xl focus:ring-accent"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button
                        variant="outline"
                        className="h-10 rounded-xl border-border flex-1 md:flex-none flex items-center gap-2"
                        onClick={() => setSortOrder(s => s === "newest" ? "oldest" : "newest")}
                    >
                        <Filter size={16} /> {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border bg-accent-light text-accent" disabled>
                        <LayoutGrid size={18} />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-accent" size={32} />
                    <p className="text-ink3 font-serif italic text-lg tracking-wide">Retrieving your research library...</p>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="py-20 text-center space-y-6 bg-muted/10 border-2 border-dashed border-border rounded-[3rem]">
                    <div className="w-20 h-20 bg-surface border border-border rounded-2xl shadow-xl flex items-center justify-center mx-auto text-ink4">
                        <Folder size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-ink">No Workspaces Found</h3>
                        <p className="text-ink3 text-[0.9rem] max-w-sm mt-2 mx-auto">
                            {searchQuery ? `No projects match "${searchQuery}".` : "You haven't created any research workspaces yet."}
                        </p>
                    </div>
                    {!searchQuery && (
                        <Button className="bg-gold text-white rounded-full px-8 h-12 font-bold" onClick={() => setIsCreateDialogOpen(true)}>
                            Start Your First Project
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredProjects.map((p, idx) => (
                            <motion.div 
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="project-card bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all group flex flex-col h-full relative"
                            >
                                <div className="absolute top-4 right-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 rounded-full text-ink4 hover:text-ink"><MoreHorizontal size={18} /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl border-border shadow-2xl">
                                            <DropdownMenuItem asChild className="py-2.5 px-4 cursor-pointer focus:bg-accent-light">
                                                <Link href={`/dashboard/projects/${p.id}`} className="flex items-center gap-2 font-bold text-ink">
                                                    <ArrowUpRight size={14} /> Open Workspace
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { setSelectedProjectForDelete(p); setIsDeletePapersModalOpen(true); }} className="py-2.5 px-4 cursor-pointer focus:bg-red-bg text-ink4">
                                                <Trash2 size={14} className="mr-2" /> Delete Papers
                                            </DropdownMenuItem>
                                            <div className="h-px bg-border my-1" />
                                            <DropdownMenuItem onClick={() => handleDeleteProject(p.id, p.name)} className="py-2.5 px-4 cursor-pointer focus:bg-red text-ink4 hover:text-white transition-colors">
                                                <Trash2 size={14} className="mr-2" /> Delete Project
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <Link href={`/dashboard/projects/${p.id}`} className="flex-1 space-y-4">
                                    <div className="w-12 h-12 bg-accent-light rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                                        <Folder size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-ink group-hover:text-accent transition-colors leading-tight mb-2 line-clamp-1">{p.name}</h3>
                                        <p className="text-[0.85rem] text-ink4 leading-relaxed line-clamp-2 italic">
                                            {p.description || "Experimental research workspace for specialized knowledge synthesis."}
                                        </p>
                                    </div>
                                </Link>

                                <div className="flex items-center justify-between border-t border-border pt-6 mt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[0.7rem] font-bold text-ink3 uppercase tracking-widest">
                                            <FileText size={14} className="text-teal" /> {p.paper_count || 0} Papers
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[0.7rem] font-bold text-ink3 uppercase tracking-widest">
                                            <Calendar size={14} /> {new Date(p.created_at).getFullYear()}
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/projects/${p.id}`} className="flex items-center gap-1 text-[0.75rem] font-bold text-gold uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        Enter <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modals & Dialogs */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl border-border p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gold-bg text-gold rounded-xl flex items-center justify-center shadow-lg shadow-gold/10"><Sparkles size={22} /></div>
                        <div>
                            <DialogTitle className="text-xl font-serif text-ink leading-none">New Workspace</DialogTitle>
                            <DialogDescription className="text-ink4 text-[0.8rem] mt-1 uppercase tracking-widest font-black">Architecture Selection</DialogDescription>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[0.7rem] font-black uppercase text-ink4 tracking-widest">Project Name</Label>
                            <Input 
                                id="name" 
                                placeholder="Quantum Resilience Analysis..."
                                value={newProjectName}
                                onChange={e => setNewProjectName(e.target.value)}
                                className="h-12 rounded-xl bg-bg2 border-border focus:ring-accent"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc" className="text-[0.7rem] font-black uppercase text-ink4 tracking-widest">Research Context</Label>
                            <Input 
                                id="desc" 
                                placeholder="Summarize the primary goal..."
                                value={newProjectDesc}
                                onChange={e => setNewProjectDesc(e.target.value)}
                                className="h-12 rounded-xl bg-bg2 border-border focus:ring-accent"
                            />
                        </div>
                        <div className="bg-bg2/50 p-4 rounded-xl border border-border flex items-start gap-3">
                            <Info size={16} className="text-accent shrink-0 mt-0.5" />
                            <p className="text-[0.7rem] text-ink3 leading-relaxed">Each workspace creates a dedicated vector index in Milvus, ensuring zero cross-contamination of research findings.</p>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 flex gap-3">
                        <Button variant="outline" className="flex-1 h-12 rounded-xl border-border" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button 
                            className="flex-1 h-12 rounded-xl bg-accent text-white font-bold" 
                            onClick={handleCreateProject}
                            disabled={isCreating || !newProjectName}
                        >
                            {isCreating ? <Loader2 className="animate-spin" /> : "Initiate Workspace"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onOpenChange={setIsUpgradeModalOpen}
                title="Workspace Capacity"
                description={`The PAYG plan allows up to ${limit} research workspaces. Upgrade to Pro for unlimited workspaces.`}
                requiredTier="pro"
                feature="unlimited thematic workspaces"
            />

            <PaperDeleteModal
                isOpen={isDeletePapersModalOpen}
                onOpenChange={setIsDeletePapersModalOpen}
                papers={selectedProjectForDelete?.papers || []}
                projectId={selectedProjectForDelete?.id || ""}
                onDeleteComplete={fetchProjects}
            />
        </div>
    )
}

function Info({ size, className }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
        </svg>
    )
}
