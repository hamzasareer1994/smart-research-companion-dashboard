"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    FileText,
    Sparkles,
    BarChart3,
    MessageSquare,
    Trash2,
    ExternalLink,
    ChevronRight,
    Search
} from "lucide-react"

interface PaperContextMenuProps {
    children: React.ReactNode
    onAction: (action: string) => void
}

export function PaperContextMenu({ children, onAction }: PaperContextMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>AI Actions</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => onAction("summarize")}>
                        <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Generate Summary</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction("insights")}>
                        <BarChart3 className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Extract Insights</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction("chat")}>
                        <MessageSquare className="mr-2 h-4 w-4 text-green-500" />
                        <span>Chat with Paper</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => onAction("find_similar")}>
                        <Search className="mr-2 h-4 w-4" />
                        <span>Find Similar Papers</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction("view_original")}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>View Original</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => onAction("remove")}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Remove from Project</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
