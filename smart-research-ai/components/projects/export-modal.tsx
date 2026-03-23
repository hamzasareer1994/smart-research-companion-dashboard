"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Download, Layers, Presentation, Share2, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface ExportModalProps {
    projectName: string
    paperCount: number
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    userTier?: string
}

const EXPORT_OPTIONS = [
    { id: 'bibtex', title: 'BibTeX', desc: 'Standard LaTeX citations', icon: FileText, tier: 'free' },
    { id: 'pdf', title: 'Research Report', desc: 'AI-generated summary PDF', icon: Layers, tier: 'pro' },
    { id: 'slides', title: 'Presentation Slides', desc: 'Auto-generated PPTX', icon: Presentation, tier: 'pro' },
    { id: 'ris', title: 'RIS / EndNote', desc: 'Reference manager format', icon: FileText, tier: 'free' },
]

export function ExportModal({ projectName, paperCount, isOpen, onOpenChange, userTier = "payg" }: ExportModalProps) {
    const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
    const [isExporting, setIsExporting] = useState(false)

    const isPremiumFormat = (formatId: string) => {
        const option = EXPORT_OPTIONS.find(opt => opt.id === formatId)
        return option?.tier !== 'free'
    }

    const canExport = selectedFormat && (userTier === "pro" || !isPremiumFormat(selectedFormat))

    const handleExport = async () => {
        if (!selectedFormat) return

        // Check tier restrictions
        if (userTier !== "pro" && isPremiumFormat(selectedFormat)) {
            toast.error("This export format requires Pro plan")
            return
        }

        setIsExporting(true)
        // Mock generation delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        const formatName = EXPORT_OPTIONS.find(opt => opt.id === selectedFormat)?.title || selectedFormat.toUpperCase()
        toast.success(`Exporting "${projectName}" as ${formatName}`)
        setIsExporting(false)
        onOpenChange(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Export Research</DialogTitle>
                    <DialogDescription>
                        Generate and download your bibliography or research insights for <strong>{projectName}</strong> ({paperCount} papers).
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {EXPORT_OPTIONS.map((option) => (
                        <div
                            key={option.id}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-muted/50 ${selectedFormat === option.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-transparent bg-muted/30'
                                } ${userTier !== "pro" && option.tier !== 'free'
                                    ? 'opacity-60 cursor-not-allowed hover:bg-muted/30'
                                    : ''
                                }`}
                            onClick={() => {
                                if (userTier !== "pro" && option.tier !== 'free') {
                                    toast.info("Pro plan required for this export format")
                                } else {
                                    setSelectedFormat(option.id)
                                }
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg bg-background shadow-sm ${selectedFormat === option.id ? 'text-primary' : ''}`}>
                                    <option.icon className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold leading-none flex items-center gap-2">
                                        {option.title}
                                        {option.tier !== 'free' && (
                                            <Badge variant="secondary" className="text-[10px] h-4 py-0">PRO</Badge>
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{option.desc}</p>
                                </div>
                            </div>
                            {selectedFormat === option.id && (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                        </div>
                    ))}
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        disabled={!canExport || isExporting}
                        onClick={handleExport}
                        className="min-w-[120px]"
                    >
                        {isExporting ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </div>
                        ) : (
                            <>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
