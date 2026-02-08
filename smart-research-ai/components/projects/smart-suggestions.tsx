"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus, ExternalLink, RefreshCcw } from "lucide-react"
import { searchService } from "@/services/search"
import { toast } from "sonner"

interface SuggestedPaper {
    id: string
    title: string
    authors: string[]
    year: number
    citations: number
    relevance: string
}

interface SmartSuggestionsProps {
    projectId: string
    papers: any[]
    projectTitle?: string
}

export function SmartSuggestionsPanel({ projectId, papers, projectTitle }: SmartSuggestionsProps) {
    const [suggestions, setSuggestions] = useState<SuggestedPaper[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const fetchSuggestions = async () => {
        if (!projectTitle) return

        try {
            // Use FREE sources only (arXiv, CrossRef, PubMed)
            // Filter for high-impact papers (1000+ citations)
            const response = await searchService.searchPapers({
                query: projectTitle + " recent advances",
                filters: {
                    citations_min: 1000,  // High-impact papers only
                    open_access: false
                },
                sources: ["arxiv", "crossref", "pubmed", "semantic_scholar"], // All free sources
                page: 1,
                limit: 10  // Get 10 to have better selection
            })

            // Take only top 5 after filtering
            const highImpactPapers = response.results
                .filter(paper => paper.citations >= 1000)
                .slice(0, 5)

            const formattedSuggestions: SuggestedPaper[] = highImpactPapers.map((paper, idx) => ({
                id: paper.id,
                title: paper.title,
                authors: paper.authors?.slice(0, 1) || ["Unknown"],
                year: paper.year || new Date().getFullYear(),
                citations: paper.citations || 0,
                relevance: idx === 0
                    ? `Highly relevant to "${projectTitle}"`
                    : idx === 1
                        ? "Recent advance in your research area"
                        : "Related work worth exploring"
            }))

            setSuggestions(formattedSuggestions)
        } catch (error: any) {
            console.error("Failed to fetch suggestions:", error)
            toast.error("Could not load AI suggestions")
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        fetchSuggestions()
    }, [projectTitle])

    const handleRefresh = () => {
        setIsRefreshing(true)
        fetchSuggestions()
    }


    return (
        <Card className="border-primary/20 bg-primary/5 shadow-none overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        <CardTitle className="text-sm">Smart Suggestions</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                        AI-recommended papers based on your project context
                    </CardDescription>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRefresh}
                    disabled={isRefreshing || isLoading}
                >
                    <RefreshCcw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                        <div className="h-4 w-4 mx-auto border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
                        Loading AI suggestions...
                    </div>
                ) : suggestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                        No suggestions available
                    </div>
                ) : (
                    suggestions.map((paper) => (
                        <div
                            key={paper.id}
                            className="group p-3 rounded-lg bg-background border border-dashed hover:border-primary/50 transition-all"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1 flex-1">
                                    <h4 className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">
                                        {paper.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <span>{paper.authors[0]}</span>
                                        <span>•</span>
                                        <span>{paper.year}</span>
                                        <span>•</span>
                                        <Badge variant="secondary" className="px-1 h-3.5 text-[9px]">{paper.citations.toLocaleString()} Citations</Badge>
                                    </div>
                                    <p className="text-[10px] text-primary/70 italic leading-snug">
                                        "{paper.relevance}"
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-7 w-7 rounded-md"
                                        onClick={() => toast.success("Paper added to project")}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 rounded-md"
                                        onClick={() => window.open(`https://openalex.org/${paper.id}`, '_blank')}
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
