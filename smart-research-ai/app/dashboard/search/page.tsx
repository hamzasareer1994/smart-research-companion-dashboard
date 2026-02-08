"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import {
    Search as SearchIcon,
    Filter,
    LayoutGrid,
    Plus,
    History,
    FileText,
    Library,
    ArrowRight,
    ExternalLink,
    List,
    Check,
    Quote,
    ChevronRight,
    Download
} from "lucide-react"
import { searchService } from "@/services/search"
import { useUserStore, Paper, SearchFilters } from "@/lib/store"
import { projectService, ProjectResponse } from "@/services/project"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function SearchPage() {
    const [query, setQuery] = useState("")
    const [lastQuery, setLastQuery] = useState("")
    const [results, setResults] = useState<Paper[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPaperIds, setSelectedPaperIds] = useState<Set<string>>(new Set())
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
    const [sources, setSources] = useState<string[]>(["arxiv", "crossref", "pubmed"]) // Default to FREE sources
    const [projects, setProjects] = useState<ProjectResponse[]>([])
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Advanced filters state
    const [showFilters, setShowFilters] = useState(false)
    const [yearFrom, setYearFrom] = useState(2020)
    const [yearTo, setYearTo] = useState(new Date().getFullYear())
    const [citationsMin, setCitationsMin] = useState(0)
    const [openAccessOnly, setOpenAccessOnly] = useState(false)
    const [openAlexQuota, setOpenAlexQuota] = useState({ used: 0, limit: 10 })

    const { user, searchHistory, addSearchHistory, clearSearchHistory } = useUserStore()

    const togglePaperSelection = (id: string) => {
        const newSelected = new Set(selectedPaperIds)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedPaperIds(newSelected)
    }

    const selectAll = () => {
        if (selectedPaperIds.size === results.length && results.length > 0) {
            setSelectedPaperIds(new Set())
        } else {
            setSelectedPaperIds(new Set(results.map(p => p.id)))
        }
    }

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
                limit: 10
            })
            setResults(response.results)
            addSearchHistory(query)
            setSelectedPaperIds(new Set()) // Clear selection on new search

            // Update OpenAlex quota if used
            if (sources.includes("openalex")) {
                setOpenAlexQuota(prev => ({ ...prev, used: prev.used + 1 }))
            }

            if (response.results.length === 0) {
                toast.info("No papers found for your query.")
            }
        } catch (error: any) {
            toast.error(error.message || "Search failed")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchProjects = async () => {
        try {
            const data = await projectService.getProjects()
            setProjects(data)
        } catch (error) {
            console.error("Failed to fetch projects")
        }
    }

    const handleAddToProject = async (projectId: string) => {
        // Handle both single and bulk adding
        const papersToSave = selectedPaperIds.size > 0
            ? results.filter(p => selectedPaperIds.has(p.id))
            : selectedPaper ? [selectedPaper] : []

        if (papersToSave.length === 0) return

        setIsSaving(true)
        try {
            for (const paper of papersToSave) {
                await projectService.addPaperToProject(projectId, paper)
            }
            toast.success(`Successfully added ${papersToSave.length} paper(s) to project`)
            setIsProjectDialogOpen(false)
            setSelectedPaperIds(new Set())
        } catch (error: any) {
            toast.error(error.message || "Failed to add papers")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Search</h2>
                    <p className="text-muted-foreground">
                        Discover top research across millions of open-source papers.
                    </p>
                </div>
                {searchHistory.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            clearSearchHistory()
                            toast.success("Search history cleared")
                        }}
                        className="gap-2"
                    >
                        <History className="h-4 w-4" />
                        Clear History ({searchHistory.length})
                    </Button>
                )}
            </div>

            {/* Project Selection Dialog */}
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add to Project</DialogTitle>
                        <DialogDescription>
                            {selectedPaperIds.size > 0
                                ? `Adding ${selectedPaperIds.size} selected papers.`
                                : `Adding "${selectedPaper?.title}" to project.`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 mt-4">
                        {projects.length > 0 ? (
                            projects.map(p => (
                                <Button
                                    key={p.id}
                                    variant="outline"
                                    className="justify-start h-12"
                                    onClick={() => handleAddToProject(p.id)}
                                    disabled={isSaving}
                                >
                                    <Library className="mr-3 h-4 w-4 text-primary" />
                                    <div className="text-left">
                                        <div className="font-semibold text-xs">{p.name}</div>
                                        <div className="text-[10px] text-muted-foreground">{p.paper_count} papers</div>
                                    </div>
                                </Button>
                            ))
                        ) : (
                            <div className="text-center p-8 border border-dashed rounded-lg">
                                <p className="text-sm text-muted-foreground mb-4">No projects found</p>
                                <Button size="sm" variant="secondary">Create Project</Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Search Bar & Controls */}
            <Card className="border-primary/20 shadow-sm border-2">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search for research papers, authors, or topics..."
                                    className="pl-9 bg-background focus-visible:ring-primary"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>
                            <Popover open={showFilters} onOpenChange={setShowFilters}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="border-dashed">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filters
                                        {(citationsMin > 0 || openAccessOnly || yearFrom > 2020) && (
                                            <Badge className="ml-2 h-5 px-1.5" variant="secondary">
                                                {[citationsMin > 0, openAccessOnly, yearFrom > 2020].filter(Boolean).length}
                                            </Badge>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-4">
                                        <h4 className="font-medium leading-none text-primary">Advanced Filters</h4>
                                        <div className="grid gap-4 pt-2">
                                            {/* Year Range */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-muted-foreground">Year Range</label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="From"
                                                        className="h-8 text-xs"
                                                        type="number"
                                                        value={yearFrom}
                                                        onChange={(e) => setYearFrom(parseInt(e.target.value) || 2020)}
                                                        min="1900"
                                                        max={yearTo}
                                                    />
                                                    <Input
                                                        placeholder="To"
                                                        className="h-8 text-xs"
                                                        type="number"
                                                        value={yearTo}
                                                        onChange={(e) => setYearTo(parseInt(e.target.value) || new Date().getFullYear())}
                                                        min={yearFrom}
                                                        max={new Date().getFullYear()}
                                                    />
                                                </div>
                                            </div>

                                            {/* Citations Filter */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-muted-foreground">Min Citations</label>
                                                <Input
                                                    placeholder="e.g., 100"
                                                    className="h-8 text-xs"
                                                    type="number"
                                                    value={citationsMin || ""}
                                                    onChange={(e) => setCitationsMin(parseInt(e.target.value) || 0)}
                                                    min="0"
                                                />
                                            </div>

                                            {/* Open Access Toggle */}
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="oa"
                                                    checked={openAccessOnly}
                                                    onCheckedChange={(checked) => setOpenAccessOnly(checked as boolean)}
                                                />
                                                <label htmlFor="oa" className="text-sm font-medium leading-none cursor-pointer">
                                                    Open Access Only
                                                </label>
                                            </div>

                                            {/* Clear Filters */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => {
                                                    setYearFrom(2020)
                                                    setYearTo(new Date().getFullYear())
                                                    setCitationsMin(0)
                                                    setOpenAccessOnly(false)
                                                }}
                                            >
                                                Clear Filters
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button onClick={handleSearch} disabled={isLoading} className="shadow-lg shadow-primary/20">
                                {isLoading ? "Searching..." : "Search"}
                            </Button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4 text-sm mt-1">
                                <span className="text-muted-foreground font-medium">Sources:</span>
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* FREE Sources */}
                                    <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                                        <span className="text-[10px] font-bold text-green-600 dark:text-green-400">FREE</span>
                                        {[
                                            { id: "arxiv", label: "arXiv" },
                                            { id: "crossref", label: "CrossRef" },
                                            { id: "pubmed", label: "PubMed" },
                                            { id: "semantic_scholar", label: "Semantic Scholar" }
                                        ].map(source => (
                                            <div key={source.id} className="flex items-center space-x-1.5">
                                                <Checkbox
                                                    id={source.id}
                                                    checked={sources.includes(source.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) setSources([...sources, source.id])
                                                        else setSources(sources.filter(s => s !== source.id))
                                                    }}
                                                />
                                                <label htmlFor={source.id} className="text-xs font-medium cursor-pointer">{source.label}</label>
                                            </div>
                                        ))}
                                    </div>

                                    {/* PAID Source */}
                                    <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                                        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">PAID</span>
                                        <div className="flex items-center space-x-1.5">
                                            <Checkbox
                                                id="openalex"
                                                checked={sources.includes("openalex")}
                                                onCheckedChange={(checked) => {
                                                    if (checked) setSources([...sources, "openalex"])
                                                    else setSources(sources.filter(s => s !== "openalex"))
                                                }}
                                            />
                                            <label htmlFor="openalex" className="text-xs font-medium cursor-pointer">OpenAlex</label>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">
                                            ({openAlexQuota.limit - openAlexQuota.used}/{openAlexQuota.limit} left)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {(user?.tier === 'professor' || user?.tier === 'researcher') && (
                                <div className="flex flex-col gap-2 border-t pt-2 mt-1">
                                    <div className="flex items-center gap-4 text-sm pt-1">
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-tighter shrink-0 flex items-center gap-1">
                                            Premium Research Web:
                                            <Badge variant="secondary" className="bg-yellow-500 text-black text-[8px] h-3 px-1 ml-1 truncate">PROFESSOR+</Badge>
                                        </span>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                            {[
                                                { id: "google_scholar", label: "Google Scholar" },
                                                { id: "researchgate", label: "ResearchGate" },
                                                { id: "pubmed", label: "PubMed" },
                                                { id: "ieee_xplore", label: "IEEE Xplore" },
                                                { id: "academia_edu", label: "Academia.edu" },
                                                ...(user?.tier === 'researcher' ? [
                                                    { id: "jstor", label: "JSTOR" },
                                                    { id: "ssrn", label: "SSRN" },
                                                    { id: "nature_science", label: "Nature/Science" },
                                                    { id: "doaj", label: "DOAJ" },
                                                    { id: "eric", label: "ERIC" }
                                                ] : [])
                                            ].map((s) => (
                                                <div key={s.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={s.id}
                                                        checked={sources.includes(s.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) setSources([...sources, s.id])
                                                            else setSources(sources.filter(src => src !== s.id))
                                                        }}
                                                    />
                                                    <label htmlFor={s.id} className="text-[11px] font-medium cursor-pointer whitespace-nowrap">{s.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tier Badge for result limit */}
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold py-0 h-5">
                                    {user?.tier === 'researcher' ? '200' : user?.tier === 'professor' ? '50' : '10'} OPENALEX RESULTS MAX ({user?.tier || 'Student'} Tier)
                                </Badge>
                                <span className="text-[10px] text-muted-foreground italic">Arxiv, Semantic Scholar & ACM are unlimited. Premium Search at 100 queries/source.</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Section */}
            {results.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-semibold">Search Results</h3>
                            <p className="text-xs text-muted-foreground">Found {results.length} papers for "{lastQuery}"</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-md p-0.5 bg-muted/20">
                                <Button
                                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                                    size="icon"
                                    className="h-7 w-7 rounded-sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "secondary" : "ghost"}
                                    size="icon"
                                    className="h-7 w-7 rounded-sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-8"
                                onClick={selectAll}
                            >
                                {selectedPaperIds.size === results.length ? "Deselect All" : "Select All"}
                            </Button>
                        </div>
                    </div>

                    <div className={cn(
                        "grid gap-6 animate-in fade-in duration-500",
                        viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                    )}>
                        {results.map((paper) => (
                            <Card
                                key={paper.id}
                                className={cn(
                                    "group cursor-pointer hover:border-primary/50 transition-all flex flex-col relative overflow-hidden",
                                    selectedPaperIds.has(paper.id) && "border-primary bg-primary/5 shadow-md scale-[1.01]"
                                )}
                                onClick={() => setSelectedPaper(paper)}
                            >
                                <div
                                    className="absolute top-3 left-3 z-10"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        togglePaperSelection(paper.id)
                                    }}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                        selectedPaperIds.has(paper.id)
                                            ? "bg-primary border-primary shadow-sm"
                                            : "bg-background border-muted-foreground/30 group-hover:border-primary/50 group-hover:bg-primary/5"
                                    )}>
                                        {selectedPaperIds.has(paper.id) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                    </div>
                                </div>

                                <CardHeader className="p-4 pb-2 pt-10">
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-base font-bold group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                            {paper.title}
                                        </CardTitle>
                                        <Badge variant="secondary" className="shrink-0 flex gap-1 p-1 h-5 px-1.5">
                                            <Quote className="w-2 h-2" />
                                            <span className="text-[10px]">{paper.citations}</span>
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-1 text-[11px] pt-1">
                                        {paper.authors.join(", ")} • {paper.year || "n/a"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between">
                                    {paper.abstract && (
                                        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem] border-l-2 pl-3 border-primary/20 bg-muted/5 py-1 mb-4">
                                            {paper.abstract}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-auto pt-2">
                                        <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter opacity-70">
                                            {paper.source}
                                        </Badge>
                                        {paper.open_access && (
                                            <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[9px] border-emerald-500/30">
                                                Open Access
                                            </Badge>
                                        )}
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-primary text-[11px] font-bold">
                                            Preview <ChevronRight className="w-3 h-3 ml-0.5" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {searchHistory.length > 0 ? (
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Recent Searches</h3>
                            <div className="flex flex-wrap gap-2">
                                {searchHistory.map((h, i) => (
                                    <div
                                        key={i}
                                        className="bg-muted/40 hover:bg-primary/10 border hover:border-primary/30 transition-all px-4 py-2 rounded-2xl cursor-pointer flex items-center gap-3 group"
                                        onClick={() => setQuery(h)}
                                    >
                                        <History className="w-3.5 h-3.5 text-primary opacity-50 group-hover:opacity-100" />
                                        <span className="text-sm font-medium">{h}</span>
                                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-muted/10 border border-dashed rounded-[3rem] max-w-4xl mx-auto">
                            <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-primary/5">
                                <SearchIcon className="h-10 w-10 text-primary opacity-20" />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight">Intelligence-Powered Literature Research</h3>
                            <p className="text-muted-foreground max-w-[500px] mx-auto mt-3 text-sm leading-relaxed">
                                Our AI connects to millions of papers via OpenAlex, arXiv, Semantic Scholar, and ACM to bring you high-impact research papers instantly.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3 mt-10">
                                <span className="text-xs text-muted-foreground w-full mb-2">Try searching for:</span>
                                <Badge variant="outline" className="px-4 py-1.5 rounded-full cursor-pointer hover:bg-primary/5" onClick={() => setQuery("Transformer Architectures")}>Transformer Architectures</Badge>
                                <Badge variant="outline" className="px-4 py-1.5 rounded-full cursor-pointer hover:bg-primary/5" onClick={() => setQuery("Climate Resilience")}>Climate Resilience</Badge>
                                <Badge variant="outline" className="px-4 py-1.5 rounded-full cursor-pointer hover:bg-primary/5" onClick={() => setQuery("Graphene Supercapacitors")}>Graphene Supercapacitors</Badge>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Paper Preview Dialog */}
            <Dialog open={!!selectedPaper} onOpenChange={() => setSelectedPaper(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border-2">
                    {selectedPaper && (
                        <div className="space-y-6">
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                        {selectedPaper.source.toUpperCase()}
                                    </Badge>
                                    <Badge className="bg-yellow-500 text-black border-none">
                                        {selectedPaper.citations} CITATIONS
                                    </Badge>
                                </div>
                                <DialogTitle className="text-2xl leading-tight font-black tracking-tight">
                                    {selectedPaper.title}
                                </DialogTitle>
                                <DialogDescription className="text-base mt-2 font-medium text-foreground/80">
                                    {selectedPaper.authors.join(", ")} • {selectedPaper.year}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3">
                                <h4 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Abstract
                                </h4>
                                {selectedPaper.abstract ? (
                                    <p className="text-sm leading-relaxed text-muted-foreground bg-muted/30 p-6 rounded-2xl border italic">
                                        {selectedPaper.abstract}
                                    </p>
                                ) : (
                                    <div className="text-sm leading-relaxed text-muted-foreground/60 bg-muted/20 p-6 rounded-2xl border border-dashed flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-muted-foreground/40" />
                                        <span className="italic">
                                            Abstract not available for this paper from {selectedPaper.source || 'this source'}.
                                            Try viewing the full source for more details.
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                {selectedPaper.url && (
                                    <Button asChild variant="default" className="flex-1 rounded-xl h-12 font-bold shadow-lg shadow-primary/20">
                                        <a href={selectedPaper.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            View Full Source
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    variant="secondary"
                                    className="flex-1 rounded-xl h-12 font-bold"
                                    onClick={() => {
                                        fetchProjects()
                                        setIsProjectDialogOpen(true)
                                    }}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add to Project
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Floating Bulk Actions Bar */}
            {selectedPaperIds.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <div className="bg-foreground text-background px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-8 border-4 border-white/5 backdrop-blur-xl">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-black leading-none">{selectedPaperIds.size}</span>
                                <span className="text-xs font-bold leading-none uppercase tracking-tighter opacity-50">Selected</span>
                            </div>
                        </div>

                        <div className="w-[1px] h-8 bg-white/10" />

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 text-xs font-bold hover:bg-white/10 text-white gap-2 px-4 rounded-xl"
                                onClick={() => {
                                    fetchProjects()
                                    setIsProjectDialogOpen(true)
                                }}
                            >
                                <Plus className="w-4 h-4" />
                                ADD TO PROJECT
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 text-xs font-bold hover:bg-white/10 text-white gap-2 px-4 rounded-xl"
                                onClick={() => toast.info("Bulk citation export is coming soon for Professor+ tiers.")}
                            >
                                <Download className="w-4 h-4" />
                                EXPORT CITATIONS
                                <Badge variant="secondary" className="bg-yellow-500 text-black text-[9px] h-4 px-1 border-none ml-1 font-bold">PRO</Badge>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 hover:bg-destructive hover:text-white text-white/50 rounded-xl"
                                onClick={() => setSelectedPaperIds(new Set())}
                            >
                                <Plus className="w-5 h-5 rotate-45" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
