"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search as SearchIcon,
    Filter,
    LayoutGrid,
    List,
    History,
    ChevronRight,
    Quote,
    ExternalLink,
    Plus,
    Check,
    Library,
    ArrowRight,
    FileText,
    Download,
    X,
    Info,
    Loader2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { searchService } from "@/services/search"
import { useUserStore, Paper, SearchFilters } from "@/lib/store"
import { projectService, ProjectResponse } from "@/services/project"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function SearchPage() {
    const { user, searchHistory, addSearchHistory, clearSearchHistory } = useUserStore()
    const [query, setQuery] = useState("")
    const [lastQuery, setLastQuery] = useState("")
    const [results, setResults] = useState<Paper[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPaperIds, setSelectedPaperIds] = useState<Set<string>>(new Set())
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
    const [sources, setSources] = useState<string[]>(["arxiv", "crossref", "pubmed"])
    const [projects, setProjects] = useState<ProjectResponse[]>([])
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Filters
    const [yearFrom, setYearFrom] = useState(2020)
    const [yearTo, setYearTo] = useState(new Date().getFullYear())
    const [citationsMin, setCitationsMin] = useState(0)
    const [openAccessOnly, setOpenAccessOnly] = useState(false)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await projectService.getProjects()
                setProjects(data)
            } catch (error) {
                console.error("Failed to fetch projects")
            }
        }
        fetchProjects()
    }, [])

    const handleSearch = async () => {
        if (!query.trim()) return
        setIsLoading(true)
        setLastQuery(query)
        try {
            const filters: SearchFilters = {
                open_access: openAccessOnly,
                year_range: [yearFrom, yearTo],
                citations_min: citationsMin > 0 ? citationsMin : undefined
            }
            const response = await searchService.searchPapers({
                query,
                filters,
                sources,
                page: 1,
                limit: 12
            })
            setResults(response.results)
            addSearchHistory(query)
            setSelectedPaperIds(new Set())
            
            if (response.results.length === 0) {
                toast.info("No results found", { description: "Try adjusting your filters or search terms." })
            }
        } catch (error: any) {
            toast.error("Search failed", { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    const togglePaperSelection = (id: string) => {
        const newSelected = new Set(selectedPaperIds)
        if (newSelected.has(id)) newSelected.delete(id)
        else newSelected.add(id)
        setSelectedPaperIds(newSelected)
    }

    const handleAddToProject = async (projectId: string) => {
        const papersToSave = selectedPaperIds.size > 0
            ? results.filter(p => selectedPaperIds.has(p.id))
            : selectedPaper ? [selectedPaper] : []

        if (papersToSave.length === 0) return
        setIsSaving(true)
        try {
            for (const paper of papersToSave) {
                await projectService.addPaperToProject(projectId, paper)
            }
            toast.success("Success", { description: `Added ${papersToSave.length} papers to project.` })
            setIsProjectDialogOpen(false)
            setSelectedPaperIds(new Set())
        } catch (error: any) {
            toast.error("Failed to add papers", { description: error.message })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-fade-up">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif text-ink mb-2">
                        Discovery <em className="italic">Hub</em>
                    </h1>
                    <p className="text-ink3 text-[0.95rem] max-w-xl">
                        Search across millions of academic papers. Our AI aggregates data from arXiv, CrossRef, and more.
                    </p>
                </div>
                {searchHistory.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearSearchHistory} className="rounded-full border-border text-ink3 hover:text-ink">
                        <History size={14} className="mr-2" /> Clear History
                    </Button>
                )}
            </div>

            {/* Search Controls Card */}
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col gap-6">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-ink4" size={20} />
                            <Input 
                                placeholder="Search papers, authors, or DOIs..."
                                className="pl-12 h-12 bg-bg2 border-border rounded-2xl text-[1rem] focus:ring-accent focus:border-accent"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-12 px-6 rounded-2xl border-dashed flex items-center gap-2">
                                    <Filter size={18} /> Filters
                                    {(citationsMin > 0 || openAccessOnly || yearFrom > 2020) && <Badge className="bg-gold text-white ml-2 rounded-full h-5 px-1.5 focus:bg-gold">!</Badge>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 rounded-2xl shadow-2xl border-border p-6" align="end">
                                <div className="space-y-6">
                                    <h4 className="font-bold text-ink uppercase text-[0.7rem] tracking-widest border-b pb-2">Advanced Filters</h4>
                                    
                                    <div className="space-y-3">
                                        <label className="text-[0.7rem] font-bold text-ink4 uppercase">Year Range</label>
                                        <div className="flex gap-2">
                                            <Input type="number" value={yearFrom} onChange={e => setYearFrom(Number(e.target.value))} className="h-9 rounded-lg" />
                                            <div className="flex items-center text-ink4">→</div>
                                            <Input type="number" value={yearTo} onChange={e => setYearTo(Number(e.target.value))} className="h-9 rounded-lg" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[0.7rem] font-bold text-ink4 uppercase">Min Citations</label>
                                        <Input type="number" value={citationsMin} onChange={e => setCitationsMin(Number(e.target.value))} className="h-9 rounded-lg" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-ink">Open Access Only</label>
                                        <Checkbox checked={openAccessOnly} onCheckedChange={c => setOpenAccessOnly(!!c)} />
                                    </div>

                                    <Button variant="outline" className="w-full text-[0.8rem]" onClick={() => { setYearFrom(2020); setCitationsMin(0); setOpenAccessOnly(false); }}>Reset Filters</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Button onClick={handleSearch} disabled={isLoading} className="h-12 px-8 rounded-2xl bg-accent text-white shadow-lg shadow-accent/20 hover:opacity-90">
                            {isLoading ? <Loader2 className="animate-spin" /> : "Search"}
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
                        <span className="text-[0.75rem] font-bold text-ink3 uppercase tracking-widest">Active Sources</span>
                        <div className="flex flex-wrap gap-3">
                            {["arxiv", "crossref", "pubmed", "semantic_scholar"].map(source => (
                                <div key={source} className="flex items-center gap-2 group cursor-pointer" onClick={() => {
                                    if (sources.includes(source)) setSources(sources.filter(s => s !== source))
                                    else setSources([...sources, source])
                                }}>
                                    <Checkbox checked={sources.includes(source)} />
                                    <span className="text-[0.85rem] text-ink2 group-hover:text-ink transition-colors capitalize">{source.replace('_', ' ')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Area */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 flex flex-col items-center gap-4">
                        <div className="animate-spin w-10 h-10 border-4 border-accent border-t-transparent rounded-full" />
                        <p className="text-ink3 font-serif italic text-lg tracking-wide">Scanning world repositories...</p>
                    </motion.div>
                ) : results.length > 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h3 className="text-xl font-serif text-ink">Found {results.length} results</h3>
                            <div className="flex items-center gap-4">
                                <div className="bg-bg2 p-1 rounded-lg flex gap-1">
                                    <Button variant={viewMode === "grid" ? "surface" : "ghost"} size="icon" onClick={() => setViewMode("grid")} className="h-8 w-8 rounded-md"><LayoutGrid size={16} /></Button>
                                    <Button variant={viewMode === "list" ? "surface" : "ghost"} size="icon" onClick={() => setViewMode("list")} className="h-8 w-8 rounded-md"><List size={16} /></Button>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setSelectedPaperIds(selectedPaperIds.size === results.length ? new Set() : new Set(results.map(r => r.id)))} className="rounded-full text-[0.75rem]">
                                    {selectedPaperIds.size === results.length ? "Deselect All" : "Select All"}
                                </Button>
                            </div>
                        </div>

                        <div className={cn("grid gap-6", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
                            {results.map((paper, idx) => (
                                <motion.div 
                                    key={paper.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => setSelectedPaper(paper)}
                                    className={cn(
                                        "paper-card bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all cursor-pointer group relative",
                                        selectedPaperIds.has(paper.id) && "ring-2 ring-accent border-accent/20 bg-accent-light/30"
                                    )}
                                >
                                    <div className="absolute top-4 right-4" onClick={e => { e.stopPropagation(); togglePaperSelection(paper.id); }}>
                                        <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-all", selectedPaperIds.has(paper.id) ? "bg-accent border-accent text-white" : "border-ink4 bg-white/50")}>
                                            {selectedPaperIds.has(paper.id) && <Check size={12} />}
                                        </div>
                                    </div>

                                    <div className="flex flex-col h-full">
                                        <div className="mb-4">
                                            <Badge variant="outline" className="mb-2 text-[0.6rem] uppercase tracking-widest text-ink4 border-border">{paper.source}</Badge>
                                            <h4 className="text-[1rem] font-bold text-ink leading-tight mb-2 group-hover:text-accent transition-colors line-clamp-2">{paper.title}</h4>
                                            <p className="text-[0.75rem] text-ink4 italic truncate">{paper.authors.join(", ")}</p>
                                        </div>
                                        
                                        <p className="text-[0.8rem] text-ink3 line-clamp-3 mb-6 leading-relaxed italic border-l-2 border-border pl-3 flex-1">
                                            {paper.abstract || "No abstract available for this publication."}
                                        </p>

                                        <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 text-[0.7rem] font-bold text-ink4">
                                                    <Quote size={12} /> {paper.citations}
                                                </div>
                                                <div className="text-[0.7rem] font-bold text-ink4">{paper.year}</div>
                                            </div>
                                            {paper.open_access && <Badge className="bg-teal-bg text-teal text-[0.6rem] font-black uppercase">Open Access</Badge>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-20 text-center space-y-8">
                        {searchHistory.length > 0 ? (
                            <div className="w-full max-w-2xl">
                                <h3 className="text-[0.75rem] font-bold text-ink4 uppercase tracking-widest mb-4">Recent Research Domains</h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {searchHistory.map((h, i) => (
                                        <Button key={i} variant="outline" className="rounded-full bg-bg2 border-border text-ink group hover:border-gold" onClick={() => setQuery(h)}>
                                            <History size={14} className="mr-2 text-ink4 group-hover:text-gold" /> {h}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="w-20 h-20 bg-bg2 rounded-full flex items-center justify-center mx-auto text-ink4">
                                    <SearchIcon size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-ink">Ready to Explore?</h3>
                                    <p className="text-ink3 text-[0.9rem] max-w-sm mt-2">Enter keywords to begin searching across world-class digital repositories.</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Bar for selected items */}
            {selectedPaperIds.size > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
                    <div className="bg-ink text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-serif italic text-gold">{selectedPaperIds.size}</span>
                            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-white/50">Papers selected</span>
                        </div>
                        <div className="w-[1px] h-6 bg-white/20" />
                        <div className="flex gap-4">
                            <Button className="h-10 px-6 rounded-full bg-gold text-white font-bold text-[0.8rem] hover:opacity-90" onClick={() => setIsProjectDialogOpen(true)}>
                                Add to Project
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-white/50 hover:text-white" onClick={() => setSelectedPaperIds(new Set())}>
                                <X size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODALS */}
            <Dialog open={!!selectedPaper} onOpenChange={o => !o && setSelectedPaper(null)}>
                <DialogContent className="max-w-3xl rounded-3xl border-border p-8 overflow-y-auto max-h-[90vh]">
                    {selectedPaper && (
                        <div className="space-y-8">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-accent-light text-accent border-accent/10">{selectedPaper.source.toUpperCase()}</Badge>
                                        <Badge className="bg-gold-bg text-gold border-gold/10 font-black">{selectedPaper.citations} CITATIONS</Badge>
                                    </div>
                                    <h2 className="text-2xl font-serif text-ink leading-tight">{selectedPaper.title}</h2>
                                    <p className="text-ink3 italic">{selectedPaper.authors.join(", ")} • {selectedPaper.year}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedPaper(null)} className="rounded-full"><X size={20} /></Button>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-ink4 border-b pb-2">Abstract Summary</h4>
                                <div className="p-6 bg-bg2 rounded-2xl italic text-ink text-[1rem] leading-relaxed relative">
                                    <Quote size={40} className="absolute -top-3 -left-3 text-gold/10 pointer-events-none" />
                                    {selectedPaper.abstract || "No abstract available for this entry."}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {selectedPaper.url && (
                                    <Button className="flex-1 h-12 rounded-xl bg-accent text-white font-bold" asChild>
                                        <a href={selectedPaper.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} className="mr-2" /> View Source</a>
                                    </Button>
                                )}
                                <Button className="flex-1 h-12 rounded-xl bg-gold text-white font-bold" onClick={() => setIsProjectDialogOpen(true)}>
                                    <Plus size={16} className="mr-2" /> Collector to Project
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl border-border p-6">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-xl border-b pb-4">Destination Library</DialogTitle>
                        <DialogDescription className="text-ink4 pt-4">Choose a workspace to store these papers for AI synthesis.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 mt-6">
                        {projects.length > 0 ? projects.map(p => (
                            <button key={p.id} onClick={() => handleAddToProject(p.id)} disabled={isSaving} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface hover:bg-bg2 transition-all text-left group">
                                <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center group-hover:scale-110 transition-transform"><Library size={18} /></div>
                                <div className="flex-1">
                                    <div className="font-bold text-ink text-[0.9rem] line-clamp-1">{p.name}</div>
                                    <div className="text-[0.7rem] text-ink4 uppercase tracking-widest font-black">{p.paper_count} papers indexed</div>
                                </div>
                                <ChevronRight size={18} className="text-ink4" />
                            </button>
                        )) : (
                            <div className="p-10 text-center border-2 border-dashed border-border rounded-2xl opacity-50">No projects found</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
