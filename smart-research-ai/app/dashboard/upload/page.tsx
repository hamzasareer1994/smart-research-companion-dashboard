"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileIcon, X } from "lucide-react"

export default function UploadPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Upload Documents</h2>
                    <p className="text-muted-foreground">
                        Upload your research papers (PDF) to start analyzing.
                    </p>
                </div>
            </div>

            {/* Dropzone */}
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="p-4 rounded-full bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Drag and drop files here</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Or click to browse (PDF only, max 10MB)
                        </p>
                    </div>
                    <Button>Select Files</Button>
                </CardContent>
            </Card>

            {/* Uploaded Files List */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recent Uploads</h3>
                <div className="space-y-2">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded bg-primary/10">
                                    <FileIcon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">research_paper_v{i}.pdf</p>
                                    <p className="text-sm text-muted-foreground">2.4 MB • Uploaded just now</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
