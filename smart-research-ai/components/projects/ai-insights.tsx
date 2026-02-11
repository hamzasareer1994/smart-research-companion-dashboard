"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, Lock as LockIcon } from "lucide-react"
import { Checkbox as UIStatsCheckbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { aiService } from "@/services/ai"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import { useUserStore } from "@/lib/store"
import { ResearchGapModal } from "./research-gap-modal"

interface AIInsightsProps {
    projectId: string
    papers: any[]
    projectTitle: string
}

export function AIInsights({ projectId, papers, projectTitle }: AIInsightsProps) {
    const { user } = useUserStore()
    const [summary, setSummary] = useState("")
    const [themes, setThemes] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isRegenerating, setIsRegenerating] = useState(false)
    const [isResearchGapModalOpen, setIsResearchGapModalOpen] = useState(false)
    const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>(papers.map(p => p.id))

    const generateInsights = async () => {
        setIsLoading(true) // Start loading on click
        if (papers.length === 0) {
            setSummary("Add papers to your project to generate AI insights.")
            setThemes([])
            setIsLoading(false)
            return
        }

        try {
            // Extract selected papers
            const selectedPapers = papers.filter(p => selectedPaperIds.includes(p.id))
            const papersSummary = selectedPapers.slice(0, 10).map((p, idx) =>
                `${idx + 1}. "${p.title}" (${p.year || 'N/A'}) by ${p.authors?.[0] || 'Unknown'}`
            ).join('\n')

            // Call backend AI service with Mistral Mini via Next.js proxy
            const response = await apiClient('/api/v1/ai/generate-insights', {
                method: 'POST',
                body: JSON.stringify({
                    text: `Project: ${projectTitle}\n\nSelected Papers:\n${papersSummary}`
                })
            })

            if (!response.ok) throw new Error('Failed to generate insights')

            const data = await response.json()

            if (data.summary) {
                setSummary(data.summary)
            } else {
                setSummary(`The project "${projectTitle}" contains ${papers.length} research papers. The collection explores key topics and trends in the field.`)
            }

            // Extract themes from paper titles (simple keyword extraction)
            const allTitles = papers.map(p => p.title?.toLowerCase() || '').join(' ')
            const commonWords = ["deep learning", "neural", "transformer", "attention", "model", "architecture", "training", "optimization", "machine learning", "AI", "reinforcement", "computer vision", "natural language"]
            const foundThemes = commonWords.filter(word =>
                allTitles.includes(word.toLowerCase())
            ).slice(0, 3)

            setThemes(foundThemes.length > 0
                ? foundThemes.map(w => w.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
                : ["Research", "Analysis", "Innovation"]
            )
        } catch (error: any) {
            console.error("Failed to generate insights:", error)
            toast.error("Could not generate AI insights")
            setSummary(`The project "${projectTitle}" contains ${papers.length} papers. AI analysis is currently unavailable.`)
        } finally {
            setIsLoading(false)
            setIsRegenerating(false)
        }
    }

    useEffect(() => {
        // No automatic generation
    }, [papers.length, projectId])

    const handleRegenerate = () => {
        setIsRegenerating(true)
        generateInsights()
    }

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-500" />
                            Executive Summary
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRegenerate}
                            disabled={isLoading || isRegenerating}
                        >
                            <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                    <CardDescription>AI-generated overview of your project's research domain.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="h-4 w-4 mx-auto border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
                            <p className="text-xs text-muted-foreground">Generating insights...</p>
                        </div>
                    ) : summary ? (
                        <>
                            <p className="text-sm leading-relaxed">
                                {summary}
                            </p>
                            {themes.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Themes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {themes.map((theme, idx) => (
                                            <Badge key={idx} variant="secondary">{theme}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Sparkles className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
                            <p className="text-sm text-muted-foreground mb-6 max-w-[300px]">
                                Click generate to analyze your {selectedPaperIds.length} selected papers.
                            </p>
                            <Button onClick={generateInsights} disabled={selectedPaperIds.length === 0}>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Insights
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="md:col-span-1">
                <CardHeader className="pb-3 text-sm">
                    <CardTitle className="text-sm font-bold">Select Papers</CardTitle>
                    <CardDescription className="text-[10px]">Customize which papers contribute to AI insights.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[250px] px-4 pb-4">
                        <div className="space-y-2">
                            {papers.map((paper) => (
                                <div key={paper.id} className="flex items-start gap-2 group">
                                    <UIStatsCheckbox
                                        id={`paper-${paper.id}`}
                                        checked={selectedPaperIds.includes(paper.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedPaperIds(prev => [...prev, paper.id])
                                            } else {
                                                setSelectedPaperIds(prev => prev.filter(id => id !== paper.id))
                                            }
                                        }}
                                        className="mt-1 shrink-0"
                                    />
                                    <label
                                        htmlFor={`paper-${paper.id}`}
                                        className="text-xs font-medium leading-tight cursor-pointer group-hover:text-primary transition-colors"
                                    >
                                        {paper.title}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-muted/10">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full text-[10px] h-8"
                            onClick={handleRegenerate}
                            disabled={isLoading || isRegenerating || selectedPaperIds.length === 0}
                        >
                            <Sparkles className="h-3 w-3 mr-2" />
                            Update Insights
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        Research Gaps
                    </CardTitle>
                    <CardDescription className="text-xs">
                        {user?.tier === 'student' && 'Analyze up to 10 papers'}
                        {user?.tier === 'researcher' && 'Analyze up to 500 papers'}
                        {user?.tier === 'professor' && 'Analyze up to 100 papers'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="border-l-2 border-yellow-500 pl-4 py-1">
                        <p className="text-xs font-bold">Model Efficiency</p>
                        <p className="text-[10px] text-muted-foreground">Limited discussion on edge-device deployment.</p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4 py-1">
                        <p className="text-xs font-bold">Ethical Frameworks</p>
                        <p className="text-[10px] text-muted-foreground">Few papers address bias in training data.</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => setIsResearchGapModalOpen(true)}
                    >
                        Generate More
                    </Button>
                </CardContent>
            </Card>

            <ResearchGapModal
                isOpen={isResearchGapModalOpen}
                onOpenChange={setIsResearchGapModalOpen}
                projectPapers={papers}
                projectId={projectId}
            />
        </div>
    )
}
