"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, FileText } from "lucide-react"
import { toast } from "sonner"

interface Paper {
    id: string
    title: string
    authors?: string
    year?: number
}

interface PaperDeleteModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    papers: Paper[]
    projectId: string
    onDeleteComplete: () => void
}

export function PaperDeleteModal({
    isOpen,
    onOpenChange,
    papers,
    projectId,
    onDeleteComplete
}: PaperDeleteModalProps) {
    const [selectedPaperIds, setSelectedPaperIds] = useState<Set<string>>(new Set())
    const [isDeleting, setIsDeleting] = useState(false)

    const togglePaper = (paperId: string) => {
        const newSet = new Set(selectedPaperIds)
        if (newSet.has(paperId)) {
            newSet.delete(paperId)
        } else {
            newSet.add(paperId)
        }
        setSelectedPaperIds(newSet)
    }

    const toggleAll = () => {
        if (selectedPaperIds.size === papers.length) {
            setSelectedPaperIds(new Set())
        } else {
            setSelectedPaperIds(new Set(papers.map(p => p.id)))
        }
    }

    const handleDelete = async () => {
        if (selectedPaperIds.size === 0) return

        const confirmed = window.confirm(
            `Are you sure you want to delete ${selectedPaperIds.size} paper(s)? This action cannot be undone.`
        )
        if (!confirmed) return

        setIsDeleting(true)
        try {
            // Call API to delete papers
            // For now, just simulate
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast.success(`Deleted ${selectedPaperIds.size} paper(s)`)
            setSelectedPaperIds(new Set())
            onDeleteComplete()
            onOpenChange(false)
        } catch (error: any) {
            toast.error(error.message || "Failed to delete papers")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Delete Papers
                    </DialogTitle>
                    <DialogDescription>
                        Select papers to delete from this project. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {papers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No papers in this project</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-3 pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={selectedPaperIds.size === papers.length}
                                        onCheckedChange={toggleAll}
                                        id="select-all"
                                    />
                                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                                        Select All ({papers.length})
                                    </label>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {selectedPaperIds.size} selected
                                </span>
                            </div>

                            <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-2">
                                    {papers.map((paper) => (
                                        <div
                                            key={paper.id}
                                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${selectedPaperIds.has(paper.id)
                                                    ? 'bg-destructive/5 border-destructive/30'
                                                    : 'bg-muted/30 border-transparent hover:bg-muted/50'
                                                }`}
                                        >
                                            <Checkbox
                                                checked={selectedPaperIds.has(paper.id)}
                                                onCheckedChange={() => togglePaper(paper.id)}
                                                id={`paper-${paper.id}`}
                                            />
                                            <label
                                                htmlFor={`paper-${paper.id}`}
                                                className="flex-1 cursor-pointer"
                                            >
                                                <p className="text-sm font-medium leading-tight mb-1">
                                                    {paper.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {paper.authors || "Unknown Author"} • {paper.year || "N/A"}
                                                </p>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={selectedPaperIds.size === 0 || isDeleting}
                        onClick={handleDelete}
                    >
                        {isDeleting ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Deleting...
                            </div>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete {selectedPaperIds.size > 0 && `(${selectedPaperIds.size})`}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
