"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { projectService, ProjectResponse } from "@/services/project"
import { Search, Loader2, Folder, FileText, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContextSelectorProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (selectedProjectIds: string[], selectedPaperIds: string[]) => void
}

export function ContextSelector({ isOpen, onClose, onConfirm }: ContextSelectorProps) {
    const [projects, setProjects] = useState<ProjectResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({})
    const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
    const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (isOpen) {
            fetchData()
        }
    }, [isOpen])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const data = await projectService.getProjects()
            setProjects(data)
        } catch (error) {
            console.error("Failed to fetch projects for context selector")
        } finally {
            setIsLoading(false)
        }
    }

    const toggleProject = (projectId: string) => {
        const newSelected = new Set(selectedProjects)
        if (newSelected.has(projectId)) {
            newSelected.delete(projectId)
            // Also deselect all papers in this project?
            // Optional: keep papers if project is deselected but specific papers were selected
        } else {
            newSelected.add(projectId)
        }
        setSelectedProjects(newSelected)
    }

    const togglePaper = (paperId: string) => {
        const newSelected = new Set(selectedPapers)
        if (newSelected.has(paperId)) {
            newSelected.delete(paperId)
        } else {
            newSelected.add(paperId)
        }
        setSelectedPapers(newSelected)
    }

    const toggleExpand = (projectId: string) => {
        setExpandedProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }))
    }

    const handleConfirm = () => {
        onConfirm(Array.from(selectedProjects), Array.from(selectedPapers))
        onClose()
    }

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-background rounded-3xl border-none shadow-2xl">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-purple-500 to-blue-500" />
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-2">
                        <Folder className="h-6 w-6 text-primary" />
                        Select Research Context
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium opacity-70">
                        Ground the AI in your projects and papers.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 pb-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <input
                            className="w-full bg-muted/50 border-none h-10 pl-9 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="h-[350px] px-2 py-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-xs font-bold uppercase tracking-widest">Indexing Library...</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredProjects.map((project) => (
                                <div key={project.id} className="group px-2">
                                    <div className={cn(
                                        "flex items-center gap-2 p-3 rounded-2xl transition-all cursor-pointer",
                                        selectedProjects.has(project.id) ? "bg-primary/10" : "hover:bg-muted/50"
                                    )}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 p-0 hover:bg-transparent"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleExpand(project.id);
                                            }}
                                        >
                                            {expandedProjects[project.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </Button>
                                        <div
                                            className="flex-1 flex items-center gap-3 select-none"
                                            onClick={() => toggleProject(project.id)}
                                        >
                                            <Checkbox
                                                checked={selectedProjects.has(project.id)}
                                                onCheckedChange={() => toggleProject(project.id)}
                                                className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary transition-colors"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold leading-none">{project.name}</span>
                                                <span className="text-[10px] opacity-60 font-semibold">{project.paper_count} Papers</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Papers List (Expanded) */}
                                    {expandedProjects[project.id] && (
                                        <div className="ml-10 mt-1 space-y-1 border-l-2 border-primary/10 pl-2 animate-in slide-in-from-left-2">
                                            {project.papers?.map(paper => (
                                                <div
                                                    key={paper.id}
                                                    className={cn(
                                                        "flex items-center gap-3 p-2 rounded-xl border border-transparent transition-all cursor-pointer group/paper",
                                                        selectedPapers.has(paper.id) ? "bg-background shadow-sm border-primary/20" : "hover:bg-muted/30"
                                                    )}
                                                    onClick={() => togglePaper(paper.id)}
                                                >
                                                    <Checkbox
                                                        checked={selectedPapers.has(paper.id)}
                                                        onCheckedChange={() => togglePaper(paper.id)}
                                                        className="h-3.5 w-3.5 rounded-sm border-muted-foreground/30"
                                                    />
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                                                        <span className="text-[11px] font-medium truncate group-hover/paper:text-primary transition-colors">{paper.title}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-6 bg-muted/30 border-t flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Selection</span>
                        <span className="text-xs font-bold text-primary">
                            {selectedProjects.size} Projects • {selectedPapers.size} Papers
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" className="rounded-xl font-bold text-xs" onClick={onClose}>Cancel</Button>
                        <Button
                            className="rounded-xl px-6 font-bold bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                            onClick={handleConfirm}
                        >
                            Start Researching
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
