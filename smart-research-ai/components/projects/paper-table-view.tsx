"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    MoreHorizontal,
    ArrowUpDown,
    MessageSquare,
    Download,
    Trash2,
    Eye,
    Star
} from "lucide-react"
import { PaperContextMenu } from "./paper-context-menu"

interface Paper {
    id: string
    title: string
    authors: string[]
    year: number
    citations: number
    status: "processing" | "completed" | "failed"
}

interface PaperTableViewProps {
    papers: Paper[]
    onAction: (action: string, paperId: string) => void
}

export function PaperTableView({ papers, onAction }: PaperTableViewProps) {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Paper, direction: 'asc' | 'desc' } | null>(null)

    const sortedPapers = [...papers].sort((a, b) => {
        if (!sortConfig) return 0
        const { key, direction } = sortConfig
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
        return 0
    })

    const handleSort = (key: keyof Paper) => {
        setSortConfig(prev => ({
            key,
            direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const getStatusBadge = (status: Paper["status"]) => {
        switch (status) {
            case "processing": return <Badge variant="secondary">Reading</Badge>
            case "completed": return <Badge variant="default" className="bg-green-500">Done Reading</Badge>
            case "failed": return <Badge variant="destructive">Failed</Badge>
        }
    }

    return (
        <div className="rounded-xl border bg-card overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[400px]">
                            <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort('title')}>
                                Title <ArrowUpDown className="ml-2 h-3 w-3" />
                            </Button>
                        </TableHead>
                        <TableHead>Authors</TableHead>
                        <TableHead>
                            <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort('year')}>
                                Year <ArrowUpDown className="ml-2 h-3 w-3" />
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">
                            <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort('citations')}>
                                Citations <ArrowUpDown className="ml-2 h-3 w-3" />
                            </Button>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedPapers.map((paper) => (
                        <TableRow key={paper.id} className="group hover:bg-muted/30">
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="line-clamp-1">{paper.title}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                                {paper.authors[0]} {paper.authors.length > 1 && `+${paper.authors.length - 1}`}
                            </TableCell>
                            <TableCell>{paper.year}</TableCell>
                            <TableCell className="text-right font-mono">{(paper.citations ?? 0).toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(paper.status)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => onAction("chat", paper.id)}>
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                    <PaperContextMenu onAction={(action) => onAction(action, paper.id)}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </PaperContextMenu>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
