"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lock, Sparkles, Zap, ChevronRight } from "lucide-react"
import Link from "next/link"
import { UserTier } from "@/lib/store"

interface UpgradeModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
    requiredTier?: UserTier
    feature?: string
}

export function UpgradeModal({
    isOpen,
    onOpenChange,
    title = "Upgrade Your Plan",
    description = "You've reached the limit for your current plan. Upgrade to continue your research without interruptions.",
    requiredTier = "professor",
    feature = "This feature"
}: UpgradeModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-background/95 backdrop-blur-xl">
                <div className="relative h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-24 h-24" />
                    </div>
                    <div className="bg-background/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-primary/20">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">{title}</DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground pt-2">
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <div className="bg-muted/30 rounded-xl p-4 flex items-center gap-4 border border-dashed transition-all hover:bg-muted/50">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold capitalize">{requiredTier} Features</h4>
                                <p className="text-xs text-muted-foreground">Unlock {feature} and much more.</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() => onOpenChange(false)}
                        >
                            Maybe Later
                        </Button>
                        <Button
                            asChild
                            className="flex-1 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold"
                        >
                            <Link href="/pricing" onClick={() => onOpenChange(false)}>
                                View Pricing
                            </Link>
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
