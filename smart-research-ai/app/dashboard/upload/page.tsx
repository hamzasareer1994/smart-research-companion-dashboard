"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileIcon, X, AlertCircle } from "lucide-react"
import { useUserStore, UserTier } from "@/lib/store"
import { UpgradeModal } from "@/components/upgrade-modal"
import { toast } from "sonner"

const UPLOAD_LIMITS: Record<UserTier, number> = {
    student: 10,
    professor: 50,
    researcher: 99999,
}

export default function UploadPage() {
    const { user } = useUserStore()
    const userTier = user?.tier || "student"
    const limit = UPLOAD_LIMITS[userTier]
    const [uploads, setUploads] = useState([]) // Start with empty to remove dummy data
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

    const currentCount = uploads.length
    const isAtLimit = currentCount >= limit

    const handleUploadClick = () => {
        if (isAtLimit) {
            setIsUpgradeModalOpen(true)
        } else {
            toast.info("File selection opened (Mock)")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Upload Documents</h2>
                    <p className="text-muted-foreground">
                        Upload your research papers (PDF) to start analyzing.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-dashed">
                    <span className="text-xs font-medium">Usage:</span>
                    <span className={`text-xs font-bold ${isAtLimit ? 'text-destructive' : 'text-primary'}`}>
                        {currentCount} / {userTier === 'researcher' ? '∞' : limit}
                    </span>
                </div>
            </div>

            {isAtLimit && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-4 text-destructive">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold">Upload Limit Reached</p>
                        <p className="text-xs opacity-90">You've reached the maximum number of daily uploads for the {userTier} plan.</p>
                    </div>
                    <Button variant="destructive" size="sm" className="h-8" onClick={() => setIsUpgradeModalOpen(true)}>
                        Upgrade to Upload More
                    </Button>
                </div>
            )}

            {/* Dropzone */}
            <Card className={`border-dashed transition-all cursor-pointer hover:bg-muted/30 ${isAtLimit ? 'opacity-50 grayscale' : ''}`} onClick={handleUploadClick}>
                <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="p-4 rounded-full bg-primary/10">
                        <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Drag and drop files here</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Or click to browse (PDF only, max 10MB per file)
                        </p>
                    </div>
                    <Button disabled={isAtLimit}>Select Files</Button>
                </CardContent>
            </Card>

            {/* Uploaded Files List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Recent Uploads</h3>
                    <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                </div>
                <div className="grid gap-3">
                    {uploads.map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-card hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <FileIcon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">research_paper_v{i}.pdf</p>
                                    <p className="text-xs text-muted-foreground">{(2.4 + i * 0.5).toFixed(1)} MB • Uploaded {i}h ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-8">Process AI</Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
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
