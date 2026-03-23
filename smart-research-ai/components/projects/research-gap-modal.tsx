"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, CheckCircle2, Sparkles, Loader2 } from "lucide-react"
import { useUserStore } from "@/lib/store"
import { toast } from "sonner"

interface ResearchGapModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    projectPapers: any[]
    projectId: string
}

export function ResearchGapModal({
    isOpen,
    onOpenChange,
    projectPapers,
    projectId
}: ResearchGapModalProps) {
    const { user } = useUserStore()
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [gaps, setGaps] = useState<any[]>([])

    // Tier-based paper limits
    const tierLimits: Record<string, number> = {
        payg: 20,
        pro: 500,
    }
    const maxPapers = tierLimits[user?.tier || "payg"] ?? 20

    const togglePaper = (paperId: string) => {
        setSelectedIds(prev => {
            if (prev.includes(paperId)) {
                return prev.filter(id => id !== paperId)
            } else if (prev.length >= maxPapers) {
                toast.error(`Maximum ${maxPapers} papers allowed for your plan`)
                return prev
            } else {
                return [...prev, paperId]
            }
        })
    }

    const handleSelectAll = () => {
        if (selectedIds.length === projectPapers.length || selectedIds.length === maxPapers) {
            setSelectedIds([])
        } else {
            setSelectedIds(projectPapers.slice(0, maxPapers).map(p => p.id))
        }
    }

    const handleGenerate = async () => {
        if (selectedIds.length === 0) {
            toast.error("Please select at least one paper")
            return
        }

        setIsGenerating(true)

        try {
            const selectedPapers = projectPapers.filter(p => selectedIds.includes(p.id))
            const papersSummary = selectedPapers.map((p, idx) =>
                `${idx + 1}. "${p.title}" (${p.year || 'N/A'}) by ${p.authors?.[0] || 'Unknown'}`
            ).join('\n')

            const response = await fetch('/api/ai/research-gaps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    papers_summary: papersSummary,
                    paper_count: selectedIds.length
                })
            })

            if (!response.ok) throw new Error('Failed to generate gaps')

            const data = await response.json()
            setGaps(data.gaps || [])
            toast.success("Research gaps generated!")
        } catch (error: any) {
            toast.error("Could not generate research gaps")
            console.error(error)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        Generate Research Gaps
                    </DialogTitle>
                    <DialogDescription>
                        Select papers to analyze ({user?.tier}: max {maxPapers} papers)
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {gaps.length === 0 ? (
                        <>
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectAll}
                                >
                                    {selectedIds.length >= maxPapers || selectedIds.length === projectPapers.length ? "Deselect All" : "Select All"}
                                </Button>
                                <Badge variant="secondary">
                                    {selectedIds.length} / {maxPapers} selected
                                </Badge>
                            </div>

                            <ScrollArea className="h-[300px] border rounded-lg p-4">
                                {projectPapers.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm">No papers in this project</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {projectPapers.map((paper) => (
                                            <div
                                                key={paper.id}
                                                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${selectedIds.includes(paper.id) ? 'bg-primary/5 border-primary' : ''
                                                    }`}
                                                onClick={() => togglePaper(paper.id)}
                                            >
                                                <Checkbox
                                                    checked={selectedIds.includes(paper.id)}
                                                    onCheckedChange={() => togglePaper(paper.id)}
                                                    disabled={!selectedIds.includes(paper.id) && selectedIds.length >= maxPapers}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold leading-tight mb-1">
                                                        {paper.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        {paper.authors?.[0] && <span>{paper.authors[0]}</span>}
                                                        {paper.year && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{paper.year}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                {selectedIds.includes(paper.id) && (
                                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleGenerate}
                                    disabled={selectedIds.length === 0 || isGenerating}
                                >
                                    {isGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Generate Gaps
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <ScrollArea className="h-[400px] border rounded-lg p-4">
                                <div className="space-y-4">
                                    {gaps.map((gap, idx) => (
                                        <div key={idx} className={`border-l-2 pl-4 py-1 ${idx % 3 === 0 ? 'border-yellow-500' :
                                                idx % 3 === 1 ? 'border-blue-500' : 'border-green-500'
                                            }`}>
                                            <p className="text-xs font-bold">{gap.title}</p>
                                            <p className="text-[10px] text-muted-foreground">{gap.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => {
                                    setGaps([])
                                    setSelectedIds([])
                                }}>
                                    Analyze Different Papers
                                </Button>
                                <Button onClick={() => onOpenChange(false)}>
                                    Done
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
