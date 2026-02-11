"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, X, FileText, Download } from "lucide-react"

interface PDFViewerModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    paper: {
        title: string
        storage_url: string | null
    } | null
}

export function PDFViewerModal({
    isOpen,
    onOpenChange,
    paper
}: PDFViewerModalProps) {
    if (!paper) return null

    const url = paper.storage_url

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-muted/20 flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3 pr-8 min-w-0">
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        <DialogTitle className="text-sm font-semibold truncate">
                            {paper.title}
                        </DialogTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        {url && (
                            <Button variant="outline" size="sm" asChild className="h-8">
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    External
                                </a>
                            </Button>
                        )}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 bg-slate-100 relative">
                    {url ? (
                        <iframe
                            src={url}
                            className="w-full h-full border-none"
                            title={paper.title}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                            <FileText className="h-16 w-16 mb-4 opacity-20" />
                            <h3 className="text-lg font-semibold">No Preview Available</h3>
                            <p className="max-w-xs mt-2">
                                This paper doesn't have a direct PDF link or storage URL for previewing.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <Button variant="outline">Learn More</Button>
                                <Button size="sm">Request Access</Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
