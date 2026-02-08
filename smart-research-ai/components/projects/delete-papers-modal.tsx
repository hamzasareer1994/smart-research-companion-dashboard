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
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Trash2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface DeletePapersModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    papers: any[]
    onDelete: (paperIds: string[]) => Promise<void>
}

export function DeletePapersModal({
    isOpen,
    onOpenChange,
    papers,
    onDelete
}: DeletePapersModalProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isDeleting, setIsDeleting] = useState(false)

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

    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            toast.error("Please select at least one paper to delete")
            return
        }

        setIsDeleting(true)
        try {
            await onDelete(selectedIds)
            toast.success(`${selectedIds.length} paper(s) deleted successfully`)
            setSelectedIds([])
            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to delete papers")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Delete Papers
                    </DialogTitle>
                    <DialogDescription>
                        Select papers to remove from this project
                    </DialogDescription>
                </DialogHeader>

                {papers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <FileText className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-lg font-semibold">No Papers Yet</p>
                        <p className="text-sm">Add papers to this project to get started</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between border-b pb-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSelectAll}
                            >
                                {selectedIds.length === papers.length ? "Deselect All" : "Select All"}
                            </Button>
                            <Badge variant={selectedIds.length > 0 ? "destructive" : "secondary"}>
                                {selectedIds.length} / {papers.length} selected
                            </Badge>
                        </div>

                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-3">
                                {papers.map((paper) => (
                                    <div
                                        key={paper.id}
                                        className={`flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer hover:border-destructive/50 ${selectedIds.includes(paper.id) ? 'bg-destructive/5 border-destructive' : ''
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
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {selectedIds.length > 0 && (
                            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                                <p className="text-xs text-destructive">
                                    {selectedIds.length} paper(s) will be permanently deleted
                                </p>
                            </div>
                        )}
                    </>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={selectedIds.length === 0 || isDeleting || papers.length === 0}
                    >
                        {isDeleting ? "Deleting..." : `Delete ${selectedIds.length} Paper(s)`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
