"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Upload, 
    FileIcon, 
    X, 
    CheckCircle2, 
    Loader2, 
    Database, 
    Sparkles, 
    ArrowRight, 
    Shield, 
    Zap,
    Info,
    Inbox
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUserStore } from "@/lib/store"
import { projectService, ProjectResponse } from "@/services/project"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

const UPLOAD_LIMITS: Record<string, number> = {
    payg: 20,
    pro: 999,
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
    const userTier = user?.tier || "payg"
    const limit = UPLOAD_LIMITS[userTier] ?? 20

    const [projects, setProjects] = useState<ProjectResponse[]>([])
    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
    const [isDragActive, setIsDragActive] = useState(false)
    const [mounted, setMounted] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setMounted(true)
        const fetchProjects = async () => {
            try {
                const data = await projectService.getProjects()
                setProjects(data)
                if (data.length > 0) setSelectedProjectId(data[0].id)
            } catch (error) {
                console.error("Failed to fetch projects")
            }
        }
        fetchProjects()
    }, [])

    const handleFiles = (files: File[]) => {
        const pdfs = files.filter(f => f.name.toLowerCase().endsWith(".pdf"))
        
        if (pdfs.length === 0) {
            toast.error("Invalid File Type", { description: "Please upload PDF documents only." })
            return
        }

        if (uploadingFiles.length + pdfs.length > limit) {
            toast.warning("Limit Reached", { description: `Your tier allows up to ${limit} files per project.` })
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
            toast.error("No Project Selected", { description: "Please select a project to upload your papers to." })
            return
        }

        const pendingFiles = uploadingFiles.filter(f => f.status === 'pending')
        if (pendingFiles.length === 0) return

        // Update status to uploading
        setUploadingFiles(prev => prev.map(f => 
            f.status === 'pending' ? { ...f, status: 'uploading', progress: 10 } : f
        ))

        try {
            const filesToUpload = pendingFiles.map(f => f.file)
            const result = await projectService.uploadFiles(selectedProjectId, filesToUpload)

            // Map results back to local state
            setUploadingFiles(prev => prev.map(f => {
                const res = result.results.find((r: any) => r.filename === f.file.name)
                if (res) {
                    const status = res.status === 'processing' ? 'completed' : 'error'
                    return { ...f, status, progress: status === 'completed' ? 100 : f.progress, error: res.message }
                }
                return f
            }))

            const successCount = result.results.filter((r: any) => r.status === 'processing').length
            if (successCount > 0) {
                toast.success("Success", { description: `Successfully indexed ${successCount} papers to Milvus.` })
            }
        } catch (error: any) {
            setUploadingFiles(prev => prev.map(f => f.status === 'uploading' ? { ...f, status: 'error', error: error.message } : f))
            toast.error("Upload Failed", { description: error.message || "An unexpected error occurred." })
        }
    }

    const removeFile = (id: string) => {
        setUploadingFiles(prev => prev.filter(f => f.id !== id))
    }

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto animate-fade-up">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-serif text-ink mb-2">
                    Research <em className="italic">Indexing Engine</em>
                </h1>
                <p className="text-ink3 text-[0.95rem] max-w-2xl">
                    Upload your research papers for semantic indexing. Our engine extracts vectors and stores them in Milvus for grounded AI reasoning.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    {/* Step 1: Configuration */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface border border-border rounded-2xl p-6 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">1</div>
                            <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                                <Database size={18} className="text-accent" /> Select Destination Project
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[0.75rem] font-bold text-ink4 uppercase tracking-wider">Target Project</label>
                                {mounted ? (
                                    <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                                        <SelectTrigger className="w-full h-11 bg-bg2 border-border text-[0.9rem] rounded-xl px-4">
                                            <SelectValue placeholder="Choose a project..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border shadow-2xl">
                                            {projects.map(p => (
                                                <SelectItem key={p.id} value={p.id} className="py-3 px-4 focus:bg-accent-light">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-ink">{p.name}</span>
                                                        <span className="text-[0.7rem] text-ink4">{p.paper_count || 0} existing papers</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="new" className="text-gold font-bold">+ Create New Project</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="w-full h-11 bg-bg2 border border-border rounded-xl px-4 flex items-center text-[0.9rem] text-ink3">Loading projects...</div>
                                )}
                            </div>
                            <div className="flex items-end">
                                <div className="bg-bg2/50 border border-border rounded-xl p-4 w-full flex items-center gap-3">
                                    <Shield size={20} className="text-teal" />
                                    <div className="text-[0.75rem] text-ink3 leading-tight">
                                        Indexed papers are isolated within project namespaces for high precision retrieval.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 2: Dropzone */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={cn(
                            "relative group rounded-3xl border-2 border-dashed transition-all duration-300 h-[320px] flex flex-col items-center justify-center p-8 overflow-hidden",
                            isDragActive ? "border-gold bg-gold-bg/30 scale-[0.99]" : "border-border hover:border-accent/40 bg-bg2/30",
                            uploadingFiles.length >= limit && "opacity-50 pointer-events-none"
                        )}
                        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                        onDragLeave={() => setIsDragActive(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragActive(false); handleFiles(Array.from(e.dataTransfer.files)); }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            multiple 
                            accept=".pdf" 
                            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
                        />

                        {/* Animated background pulse */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-surface border border-border rounded-2xl shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                <Upload size={32} className="text-gold" />
                            </div>
                            <h3 className="text-xl font-bold text-ink mb-2">Drop your research PDFs here</h3>
                            <p className="text-ink3 text-[0.85rem] max-w-sm mb-6">
                                Or click to browse. We'll automatically convert them into high-dimensional vectors.
                            </p>
                            
                            <div className="flex items-center gap-6 text-[0.7rem] font-bold text-ink4 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Zap size={14} className="text-gold" /> Fast chunking</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-teal" /> PDF OCR support</span>
                            </div>
                        </div>

                        {/* Progress feedback for active uploads */}
                        <AnimatePresence>
                            {uploadingFiles.some(f => f.status === 'uploading') && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex flex-col items-center justify-center"
                                >
                                    <div className="w-16 h-16 mb-6">
                                        <div className="w-full h-full border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                                    </div>
                                    <h4 className="text-lg font-bold text-ink mb-1">Indexing in Progress</h4>
                                    <p className="text-ink3 text-[0.8rem]">Running embedding models and storing in Milvus...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Queue & Status Sidebar */}
                <div className="space-y-6">
                    <div className="bg-surface border border-border rounded-2xl flex flex-col shadow-sm h-full min-h-[500px]">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h3 className="text-[0.75rem] font-bold text-ink4 uppercase tracking-wider">Upload Queue</h3>
                            <Badge className="bg-bg2 text-ink3 border-border">{uploadingFiles.length} / {limit}</Badge>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {uploadingFiles.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-30 italic">
                                    <Inbox size={40} className="mb-4" />
                                    <p className="text-[0.8rem]">Queue is empty. Select papers to begin.</p>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {uploadingFiles.map((f) => (
                                        <motion.div 
                                            key={f.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-3 rounded-xl bg-bg2/50 border border-border group relative overflow-hidden"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                                    f.status === 'completed' ? "bg-teal-bg text-teal" : 
                                                    f.status === 'error' ? "bg-red-bg text-red" : "bg-white text-accent"
                                                )}>
                                                    {f.status === 'completed' ? <CheckCircle2 size={16} /> : 
                                                     f.status === 'uploading' ? <Loader2 size={16} className="animate-spin" /> : <FileIcon size={16} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[0.8rem] font-bold text-ink truncate pr-6">{f.file.name}</div>
                                                    <div className="text-[0.65rem] text-ink4 uppercase tracking-tighter">{(f.file.size / (1024 * 1024)).toFixed(1)} MB • {f.status}</div>
                                                </div>
                                                <button 
                                                    onClick={() => removeFile(f.id)}
                                                    className="absolute top-2 right-2 text-ink4 hover:text-red transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>

                                            {f.status === 'uploading' && (
                                                <div className="mt-3 space-y-1">
                                                    <Progress value={f.progress} className="h-1 bg-white" />
                                                    <div className="text-[0.6rem] text-accent font-bold uppercase tracking-widest text-right">Processing...</div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {uploadingFiles.length > 0 && (
                            <div className="p-4 bg-bg2/30 border-t border-border space-y-4">
                                <div className="bg-accent-light rounded-xl p-3 flex gap-3">
                                    <Sparkles size={16} className="text-accent shrink-0" />
                                    <div className="text-[0.7rem] text-accent-text leading-tight">
                                        Your papers will be summarized via <strong className="font-bold">GPT-4o</strong> after indexing.
                                    </div>
                                </div>
                                <Button 
                                    className="w-full h-12 bg-accent text-white rounded-xl shadow-lg shadow-accent/20 hover:opacity-90 font-bold flex items-center justify-center gap-2"
                                    onClick={startUpload}
                                    disabled={uploadingFiles.every(f => f.status !== 'pending')}
                                >
                                    Start Indexing Engine <ArrowRight size={18} />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Pro Tip Card */}
                    <div className="bg-gold-bg/50 border border-gold/20 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                            <Info size={18} className="text-gold shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[0.85rem] font-bold text-gold-text">Indexing Tip</h4>
                                <p className="text-[0.75rem] text-gold-text/80 mt-1 leading-relaxed">
                                    For better AI search, ensure papers have clear titles and abstracts. We'll automatically handle multi-column layouts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
