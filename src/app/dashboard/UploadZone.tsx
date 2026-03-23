"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Upload,
    FileText,
    X,
    CheckCircle2,
    FileUp,
    Shield
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function UploadZone() {
    const [files, setFiles] = useState<{ name: string; size: string; status: 'idle' | 'uploading' | 'done', progress: number }[]>([]);
    const [dragging, setDragging] = useState(false);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');

        const newFiles = droppedFiles.map(f => ({
            name: f.name,
            size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
            status: 'idle' as const,
            progress: 0
        }));
        setFiles([...files, ...newFiles]);
    };

    const startUpload = () => {
        setFiles(prev => prev.map(f => f.status === 'idle' ? { ...f, status: 'uploading', progress: 0 } : f));

        // Mock upload progress
        setTimeout(() => {
            setFiles(prev => prev.map(f => f.status === 'uploading' ? { ...f, status: 'done', progress: 100 } : f));
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Research Papers</h1>
                <p className="text-muted-foreground">Add PDFs to your research engine to enable intelligent chat and analysis.</p>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragging
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card/40 backdrop-blur-sm"
                    } hover-lift`}
            >
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm shadow-primary/20">
                        <Upload className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Drag & Drop Documents</h3>
                    <p className="text-muted-foreground mb-6">Support for PDF only. Max file size 50MB.</p>
                    <label className="cursor-pointer">
                        <input type="file" className="hidden" multiple accept=".pdf" />
                        <Button variant="outline" className="h-11 px-8 rounded-full hover-lift">
                            Select Files
                        </Button>
                    </label>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-4 flex gap-4 glass border-none hover-lift">
                    <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div className="text-xs">
                        <p className="font-semibold">Privacy First</p>
                        <p className="text-muted-foreground">Your papers are private to your workspace.</p>
                    </div>
                </Card>
                <Card className="p-4 flex gap-4 glass border-none hover-lift">
                    <FileUp className="w-5 h-5 text-primary shrink-0" />
                    <div className="text-xs">
                        <p className="font-semibold">Smart Vectorization</p>
                        <p className="text-muted-foreground">Semantic embedding for high-precision search.</p>
                    </div>
                </Card>
                <Card className="p-4 flex gap-4 glass border-none hover-lift">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <div className="text-xs">
                        <p className="font-semibold">Bulk Processing</p>
                        <p className="text-muted-foreground">Upload and process entire folders at once.</p>
                    </div>
                </Card>
            </div>

            {files.length > 0 && (
                <div className="space-y-4 pt-8 border-t border-border/50">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg">{files.length} Document(s) pending</h2>
                        <Button
                            onClick={startUpload}
                            disabled={files.some(f => f.status === 'uploading')}
                            className="btn-primary px-8 rounded-xl shadow-lg shadow-primary/20"
                        >
                            Process Documents
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {files.map((file, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-md flex items-center gap-4 hover-lift">
                                <FileText className="w-8 h-8 text-primary shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-medium truncate text-sm">{file.name}</p>
                                        <span className="text-xs text-muted-foreground">{file.size}</span>
                                    </div>
                                    {file.status === 'uploading' && (
                                        <Progress value={file.progress} className="h-1.5 bg-muted" />
                                    )}
                                    {file.status === 'done' && (
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium italic">
                                            <CheckCircle2 className="w-3 h-3" /> Ready for analysis
                                        </p>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => setFiles(f => f.filter((_, i) => i !== idx))}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
