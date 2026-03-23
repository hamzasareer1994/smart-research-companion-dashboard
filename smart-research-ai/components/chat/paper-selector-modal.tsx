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
import { FileText, CheckCircle2 } from "lucide-react"

interface PaperSelectorModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    papers: any[]
    onConfirm: (selectedPaperIds: string[]) => void
}

export function PaperSelectorModal({
    isOpen,
    onOpenChange,
    papers,
    onConfirm
}: PaperSelectorModalProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const togglePaper = (paperId: string) => {
        setSelectedIds(prev =>
            prev.includes(paperId)
                ? prev.filter(id => id !== paperId)
                : [...prev, paperId]
        )
    }

    const handleSelectAll = () => {
        if (selectedIds.length === papers.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(papers.map(p => p.id))
        }
    }

    const handleConfirm = () => {
        onConfirm(selectedIds)
        onOpenChange(false)
        setSelectedIds([]) // Reset
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Select Papers for Chat Context
                    </DialogTitle>
                    <DialogDescription>
                        Choose which papers the AI should analyze when answering your questions
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAll}
                        >
                            {selectedIds.length === papers.length ? "Deselect All" : "Select All"}
                        </Button>
                        <Badge variant="secondary">
                            {selectedIds.length} of {papers.length} selected
                        </Badge>
                    </div>

                    <ScrollArea className="h-[400px] border rounded-lg p-4">
                        {papers.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No papers in this project</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {papers.map((paper) => (
                                    <div
                                        key={paper.id}
                                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${selectedIds.includes(paper.id) ? 'bg-primary/5 border-primary' : ''
                                            }`}
                                        onClick={() => togglePaper(paper.id)}
                                    >
                                        <Checkbox
                                            checked={selectedIds.includes(paper.id)}
                                            onCheckedChange={() => togglePaper(paper.id)}
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
                            onClick={handleConfirm}
                            disabled={selectedIds.length === 0}
                        >
                            Use {selectedIds.length} Paper{selectedIds.length !== 1 ? 's' : ''}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
