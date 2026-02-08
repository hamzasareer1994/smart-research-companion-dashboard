"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    MessageSquare,
    Search,
    MoreHorizontal,
    Calendar,
    Quote,
    Award
} from "lucide-react"
import { PaperContextMenu } from "./paper-context-menu"

interface Paper {
    id: string
    title: string
    authors: string[]
    year: number
    citations: number
    status: "to_read" | "reading" | "complete" | "key_paper"
}

interface PaperGalleryViewProps {
    papers: Paper[]
    onAction: (action: string, paperId: string) => void
}

export function PaperGalleryView({ papers, onAction }: PaperGalleryViewProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {papers.map((paper) => (
                <Card key={paper.id} className="flex flex-col group hover:shadow-lg transition-all border shadow-none overflow-hidden h-full">
                    {/* Visual Placeholder for Paper Thumbnail */}
                    <div className="aspect-[4/3] bg-muted/40 relative flex items-center justify-center p-4">
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                            <PaperContextMenu onAction={(action) => onAction(action, paper.id)}>
                                <Button variant="secondary" size="icon" className="h-7 w-7 rounded-full shadow-sm bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </PaperContextMenu>
                        </div>
                        <div className="w-16 h-20 bg-background rounded border-2 border-primary/20 shadow-sm flex flex-col p-1.5 gap-1 group-hover:scale-105 transition-transform">
                            <div className="h-1 w-full bg-primary/20 rounded" />
                            <div className="h-1 w-3/4 bg-muted rounded" />
                            <div className="h-1 w-full bg-muted rounded" />
                            <div className="flex-1" />
                            <div className="h-2 w-2 rounded-full bg-primary/40 mx-auto" />
                        </div>
                        {paper.status === 'key_paper' && (
                            <Badge className="absolute top-2 left-2 bg-purple-500 hover:bg-purple-600 gap-1">
                                <Award className="h-3 w-3" /> Key
                            </Badge>
                        )}
                    </div>

                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-bold leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                            {paper.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 pt-0 flex-1 flex flex-col gap-3">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Published {paper.year}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                                {paper.authors.join(", ")}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-dashed">
                            <Badge variant="outline" className="text-[10px] gap-1 px-1.5 h-5">
                                <Quote className="h-2.5 w-2.5" /> {paper.citations.toLocaleString()}
                            </Badge>
                            <div className="flex gap-1 ml-auto">
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500" onClick={() => onAction("chat", paper.id)}>
                                    <MessageSquare className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-purple-500" onClick={() => onAction("summarize", paper.id)}>
                                    <Search className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
