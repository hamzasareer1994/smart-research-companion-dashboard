"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, Lock as LockIcon } from "lucide-react"
import { aiService } from "@/services/ai"
import { toast } from "sonner"
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
    const [isLoading, setIsLoading] = useState(true)
    const [isRegenerating, setIsRegenerating] = useState(false)
    const [isResearchGapModalOpen, setIsResearchGapModalOpen] = useState(false)

    const generateInsights = async () => {
        if (papers.length === 0) {
            setSummary("Add papers to your project to generate AI insights.")
            setThemes([])
            setIsLoading(false)
            return
        }

        try {
            // Extract paper titles and info for AI context
            const papersSummary = papers.slice(0, 10).map((p, idx) =>
                `${idx + 1}. "${p.title}" (${p.year || 'N/A'}) by ${p.authors?.[0] || 'Unknown'}`
            ).join('\n')

            // Call backend AI service with Mistral Mini
            const response = await fetch('/api/ai/generate-insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_title: projectTitle,
                    papers_summary: papersSummary,
                    paper_count: papers.length
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
        generateInsights()
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
                    ) : (
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
                    )}
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
