import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { createPortal } from "react-dom"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    MoreHorizontal,
    Quote,
    ExternalLink,
    MessageSquare,
    Plus
} from "lucide-react"
import { PaperContextMenu } from "./paper-context-menu"
import { cn } from "@/lib/utils"

interface Paper {
    id: string
    title: string
    authors: string[]
    year: number
    citations: number
    status: "to_read" | "reading" | "complete" | "key_paper"
}

interface KanbanBoardProps {
    papers: Paper[]
    onStatusChange: (paperId: string, newStatus: Paper["status"]) => void
    onAction: (action: string, paperId: string) => void
}

const COLUMNS = [
    { id: "to_read", title: "To Read", color: "bg-slate-500" },
    { id: "reading", title: "Reading", color: "bg-blue-500" },
    { id: "complete", title: "Complete", color: "bg-green-500" },
    { id: "key_paper", title: "Key Papers", color: "bg-purple-500" },
] as const

export function KanbanBoard({ papers: initialPapers, onStatusChange, onAction }: KanbanBoardProps) {
    const [papers, setPapers] = useState(initialPapers)
    const [activePaper, setActivePaper] = useState<Paper | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const paper = papers.find(p => p.id === active.id)
        if (paper) setActivePaper(paper)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActivePaper(null)

        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        // Check if dropped over a column or another card
        const overPaper = papers.find(p => p.id === overId)
        const newStatus = overPaper ? overPaper.status : (overId as Paper["status"])

        const activePaper = papers.find(p => p.id === activeId)
        if (activePaper && activePaper.status !== newStatus) {
            onStatusChange(activeId, newStatus)
            setPapers(prev => prev.map(p => p.id === activeId ? { ...p, status: newStatus } : p))
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full min-h-[600px]">
                {COLUMNS.map((column) => (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        papers={papers.filter((p) => p.status === column.id)}
                        onAction={onAction}
                    />
                ))}
            </div>

            {typeof document !== 'undefined' && createPortal(
                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.5',
                            },
                        },
                    }),
                }}>
                    {activePaper ? (
                        <div className="w-[300px] rotate-3 cursor-grabbing">
                            <PaperCard paper={activePaper} onAction={onAction} isOverlay />
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    )
}

function KanbanColumn({ column, papers, onAction }: { column: typeof COLUMNS[number], papers: Paper[], onAction: (action: string, paperId: string) => void }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${column.color}`} />
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1.5">
                        {papers.length}
                    </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background shadow-sm">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <SortableContext items={papers.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <ScrollArea className="flex-1 rounded-2xl bg-muted/20 p-2 border border-dashed hover:bg-muted/40 transition-colors min-h-[500px]">
                    <div className="flex flex-col gap-3 p-1">
                        {papers.map((paper) => (
                            <SortablePaperCard key={paper.id} paper={paper} onAction={onAction} />
                        ))}
                        {papers.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-8 text-center opacity-20 py-20 pointer-events-none">
                                <Plus className="h-8 w-8 mb-2 border-2 border-dashed rounded-full p-2" />
                                <p className="text-[10px] uppercase font-bold tracking-wider">Empty Column</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </SortableContext>
        </div>
    )
}

function SortablePaperCard({ paper, onAction }: { paper: Paper, onAction: (action: string, paperId: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: paper.id })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <PaperCard paper={paper} onAction={onAction} />
        </div>
    )
}

function PaperCard({ paper, onAction, isOverlay }: { paper: Paper, onAction: (action: string, paperId: string) => void, isOverlay?: boolean }) {
    return (
        <Card className={cn(
            "group border shadow-none hover:shadow-md hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing bg-card",
            isOverlay && "shadow-2xl border-primary"
        )}>
            <CardHeader className="p-3 pb-1">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">
                        {paper.title}
                    </CardTitle>
                    <div onClick={(e) => e.stopPropagation()}>
                        <PaperContextMenu onAction={(action) => onAction(action, paper.id)}>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-3 w-3" />
                            </Button>
                        </PaperContextMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
                <p className="text-[10px] text-muted-foreground line-clamp-1">
                    {paper.authors[0]} {paper.authors.length > 1 && `et al.`} • {paper.year}
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                    <Badge variant="outline" className="text-[10px] px-1 h-4 flex gap-1 items-center">
                        <Quote className="h-2 w-2" /> {paper.citations}
                    </Badge>
                    <div className="ml-auto flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <div
                            className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                            onClick={() => onAction("view_original", paper.id)}
                        >
                            <ExternalLink className="w-2.5 h-2.5" />
                        </div>
                        <div
                            className="w-5 h-5 rounded flex items-center justify-center bg-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-blue-500"
                            onClick={() => onAction("chat", paper.id)}
                        >
                            <MessageSquare className="w-2.5 h-2.5" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

