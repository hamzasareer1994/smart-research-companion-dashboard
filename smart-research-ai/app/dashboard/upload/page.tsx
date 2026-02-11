"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Upload,
    FileIcon,
    X,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Search,
    ChevronDown,
    Layers,
    FileSearch2,
    Database,
    Sparkles
} from "lucide-react"
import { useUserStore, UserTier } from "@/lib/store"
import { UpgradeModal } from "@/components/upgrade-modal"
import { toast } from "sonner"
import { projectService, ProjectResponse } from "@/services/project"
import LivingDocumentAnimation from "@/components/LivingDocumentAnimation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const UPLOAD_LIMITS: Record<UserTier, number> = {
    student: 10,
    professor: 50,
    researcher: 99999,
}

interface UploadingFile {
    id: string
    file: File
    status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
    progress: number
    error?: string
}

export default function UploadPage() {
    const { user } = useUserStore()
    const userTier = user?.tier || "student"
    const limit = UPLOAD_LIMITS[userTier]

    const [projects, setProjects] = useState<ProjectResponse[]>([])
    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
    const [isDragActive, setIsDragActive] = useState(false)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const data = await projectService.getProjects()
            setProjects(data)
            if (data.length > 0) setSelectedProjectId(data[0].id)
        } catch (error) {
            console.error("Failed to fetch projects")
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files))
        }
    }

    const handleFiles = (files: File[]) => {
        const pdfs = files.filter(f => f.name.endsWith(".pdf"))
        if (pdfs.length === 0) {
            toast.error("Please select only PDF files.")
            return
        }

        if (uploadingFiles.length + pdfs.length > limit) {
            setIsUpgradeModalOpen(true)
            return
        }

        const newFiles = pdfs.map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            file: f,
            status: 'pending' as const,
            progress: 0
        }))

        setUploadingFiles(prev => [...prev, ...newFiles])
    }

    const startUpload = async () => {
        if (!selectedProjectId) {
            toast.error("Please select a project first.")
            return
        }

        const pendingFiles = uploadingFiles.filter(f => f.status === 'pending')
        if (pendingFiles.length === 0) return

        // Mark as uploading
        setUploadingFiles(prev => prev.map(f => f.status === 'pending' ? { ...f, status: 'uploading', progress: 10 } : f))

        // Simulate upload progress
        const progressInterval = setInterval(() => {
            setUploadingFiles(prev => prev.map(f => {
                if (f.status === 'uploading' && f.progress < 40) {
                    return { ...f, progress: f.progress + 5 }
                }
                if (f.status === 'processing' && f.progress < 90) {
                    return { ...f, progress: f.progress + 2 }
                }
                return f
            }))
        }, 500)

        try {
            const filesToUpload = pendingFiles.map(f => f.file)
            const result = await projectService.uploadFiles(selectedProjectId, filesToUpload)

            clearInterval(progressInterval)

            const successCount = result.results.filter((r: any) => r.status === 'processing').length
            const errorCount = result.results.filter((r: any) => r.status === 'error').length

            // Map results back to local state
            setUploadingFiles(prev => prev.map(f => {
                const res = result.results.find((r: any) => r.filename === f.file.name)
                if (res) {
                    const status = res.status === 'processing' ? 'processing' : 'error'
                    return { ...f, status, progress: status === 'processing' ? 45 : f.progress, error: res.message }
                }
                return f
            }))

            if (successCount > 0) {
                toast.success(`Processing ${successCount} papers. ${errorCount > 0 ? `${errorCount} failed.` : ''}`)
            } else if (errorCount > 0) {
                toast.error(`Failed to process ${errorCount} papers.`)
            }
        } catch (error: any) {
            clearInterval(progressInterval)
            setUploadingFiles(prev => prev.map(f => f.status === 'uploading' ? { ...f, status: 'error', error: error.message } : f))
            toast.error(error.message || "Upload failed")
        }
    }

    const removeFile = (id: string) => {
        setUploadingFiles(prev => prev.filter(f => f.id !== id))
    }

    const isAtLimit = uploadingFiles.length >= limit

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Research Engine
                    </h2>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Upload papers to build your project's knowledge base.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-full border border-dashed border-primary/20 backdrop-blur-sm shadow-inner">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Daily Limit:</span>
                    <span className={cn("text-sm font-bold", isAtLimit ? 'text-destructive' : 'text-primary')}>
                        {uploadingFiles.length} / {userTier === 'researcher' ? '∞' : limit}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    {/* Project Selector */}
                    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-md overflow-hidden group">
                        <div className="h-1 w-full bg-gradient-to-r from-primary/50 to-purple-600/50" />
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                <Database className="h-4 w-4" />
                                1. Select Destination Project
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                                <SelectTrigger className="bg-background/80 h-12 rounded-xl border-muted-foreground/10 hover:border-primary/50 transition-all shadow-sm">
                                    <SelectValue placeholder="Chose a project workspace..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                    {projects.map(p => (
                                        <SelectItem key={p.id} value={p.id} className="rounded-lg py-3 focus:bg-primary/10">
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="font-bold">{p.name}</span>
                                                <span className="text-[10px] opacity-60">{p.paper_count} existing papers</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                    <SelectSeparator />
                                    <SelectItem value="new" disabled>+ Create New Project</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Dropzone or Animation */}
                    {uploadingFiles.some(f => f.status === 'uploading' || f.status === 'processing') ? (
                        <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-3xl border-2 border-dashed border-primary/20">
                            {(() => {
                                const activeFile = uploadingFiles.find(f => f.status === 'uploading' || f.status === 'processing')
                                return (
                                    <LivingDocumentAnimation
                                        status={activeFile?.status === 'uploading' ? 'uploading' : 'processing'}
                                        progress={activeFile?.progress || 0}
                                        filename={activeFile?.file.name}
                                    />
                                )
                            })()}
                        </div>
                    ) : (
                        <Card
                            className={cn(
                                "border-4 border-dashed rounded-3xl transition-all relative overflow-hidden h-[300px] flex items-center justify-center group",
                                isDragActive ? "border-primary bg-primary/5 scale-[0.98]" : "border-muted-foreground/10 hover:border-primary/20 hover:bg-muted/10",
                                isAtLimit && "opacity-50 grayscale pointer-events-none"
                            )}
                            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                            onDragLeave={() => setIsDragActive(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragActive(false); handleFiles(Array.from(e.dataTransfer.files)); }}
                        >
                            <input
                                type="file"
                                multiple
                                accept=".pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                disabled={isAtLimit}
                            />
                            <CardContent className="flex flex-col items-center justify-center text-center p-8">
                                <div className="relative mb-6">
                                    <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse group-hover:bg-primary/40 transition-all" />
                                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-2xl text-white transform group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                                        <Upload className="h-10 w-10" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold tracking-tight">Drop your research PDFs here</h3>
                                <p className="text-muted-foreground mt-2 max-w-[280px]">
                                    We'll instantly process, chunk, and index them for a grounded AI experience.
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mt-4 group-hover:text-primary transition-colors">
                                    Max 50MB per file • PDF Only
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Queue / Status Panel */}
                <div className="space-y-6">
                    <Card className="border-none shadow-xl bg-muted/20 backdrop-blur-xl h-full flex flex-col min-h-[460px]">
                        <CardHeader className="p-4 border-b border-muted">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60">Upload Queue</CardTitle>
                                {uploadingFiles.length > 0 && (
                                    <Badge variant="secondary" className="bg-primary/10 text-primary h-5 px-1.5 font-bold">
                                        {uploadingFiles.length}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 flex flex-col">
                            {uploadingFiles.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30 select-none">
                                    <FileIcon className="h-12 w-12 mb-4" />
                                    <p className="text-xs font-medium">No files selected</p>
                                </div>
                            ) : (
                                <div className="p-3 space-y-3 overflow-y-auto max-h-[400px]">
                                    {uploadingFiles.map((file) => (
                                        <div key={file.id} className="p-3 rounded-2xl bg-card border group relative animate-in slide-in-from-right-4 transition-all hover:shadow-md">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "p-2 rounded-xl transition-colors",
                                                    file.status === 'completed' ? "bg-green-500/10 text-green-500" :
                                                        file.status === 'error' ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                                                )}>
                                                    {file.status === 'processing' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileIcon className="h-4 w-4" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-xs truncate pr-6">{file.file.name}</p>
                                                    <p className="text-[10px] opacity-60 uppercase font-bold tracking-tighter">
                                                        {(file.file.size / (1024 * 1024)).toFixed(2)} MB • {file.status}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => removeFile(file.id)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            {(file.status === 'uploading' || file.status === 'processing') && (
                                                <div className="mt-3 space-y-2">
                                                    <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-primary">
                                                        <span className="flex items-center gap-1">
                                                            {file.status === 'uploading' ? <Upload className="h-2.5 w-2.5" /> : <FileSearch2 className="h-2.5 w-2.5" />}
                                                            {file.status === 'uploading' ? 'Uploading...' : 'Analyzing Chunks...'}
                                                        </span>
                                                        <span>{file.status === 'uploading' ? 'Transfer' : 'Indexing'}</span>
                                                    </div>
                                                    <Progress value={file.progress} className="h-1 bg-primary/10" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {uploadingFiles.length > 0 && (
                                <div className="p-4 bg-background/50 border-t mt-auto">
                                    <Button
                                        className="w-full h-12 rounded-xl font-bold bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        onClick={startUpload}
                                        disabled={uploadingFiles.every(f => f.status !== 'pending')}
                                    >
                                        {uploadingFiles.some(f => f.status === 'uploading' || f.status === 'processing') ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                AI Processing In Progress...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Scale Upload & Start RAG
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onOpenChange={setIsUpgradeModalOpen}
                title="Increase Upload Capacity"
                description={`The ${userTier} plan allows up to ${limit} uploads per day. Upgrade to process more papers and accelerate your literature review.`}
                requiredTier={userTier === 'student' ? 'professor' : 'researcher'}
                feature="higher daily upload limits"
            />
        </div>
    )
}
