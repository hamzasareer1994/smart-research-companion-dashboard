"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FileText, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "idle" | "uploading" | "processing" | "ready"

interface Props {
    status: Status
    progress?: number // 0 → 100
    filename?: string
}

export default function LivingDocumentAnimation({
    status,
    progress = 0,
    filename
}: Props) {
    return (
        <Card className="relative w-64 h-80 flex items-center justify-center bg-background overflow-hidden border shadow-2xl">
            {/* Filename Header */}
            {filename && (
                <div className="absolute top-4 left-0 right-0 px-4 z-20">
                    <p className="text-[10px] font-bold text-center truncate uppercase tracking-widest opacity-40">
                        {filename}
                    </p>
                </div>
            )}
            {/* Processing Ring */}
            {status !== "idle" && (
                <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="110"
                        stroke="hsl(var(--border))"
                        strokeWidth="6"
                        fill="none"
                    />
                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r="110"
                        stroke={
                            status === "ready"
                                ? "hsl(var(--primary))"
                                : "hsl(var(--ring))"
                        }
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={690}
                        strokeDashoffset={690 - (690 * progress) / 100}
                        transition={{ ease: "easeInOut", duration: 0.4 }}
                    />
                </svg>
            )}

            {/* Paper Stack */}
            <div className="relative">
                <AnimatePresence>
                    {(status === "uploading" || status === "processing") &&
                        [...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-32 h-40 bg-white dark:bg-slate-900 rounded-md shadow-md border"
                                style={{ top: i * 6, left: i * 4 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: 0.6,
                                    y: status === "processing" ? [-2, 2, -2] : 0,
                                }}
                                transition={{
                                    repeat: status === "processing" ? Infinity : 0,
                                    duration: 0.6,
                                    delay: i * 0.1,
                                }}
                            >
                                {/* Highlight sweep */}
                                {status === "processing" && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ repeat: Infinity, duration: 1.2 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                </AnimatePresence>

                {/* Main Icon */}
                <motion.div
                    className={cn(
                        "relative z-10 w-32 h-40 flex items-center justify-center rounded-md border bg-background",
                        status === "ready" && "border-primary"
                    )}
                    animate={
                        status === "ready"
                            ? { scale: [1, 1.05, 1] }
                            : { scale: 1 }
                    }
                    transition={{ repeat: status === "ready" ? Infinity : 0, duration: 1 }}
                >
                    {status === "ready" ? (
                        <CheckCircle className="w-14 h-14 text-primary" />
                    ) : (
                        <FileText className="w-14 h-14 text-muted-foreground" />
                    )}
                </motion.div>
            </div>

            {/* Status Badge */}
            <div className="absolute bottom-4">
                <Badge variant={status === "ready" ? "default" : "secondary"}>
                    {status === "uploading" && "Uploading"}
                    {status === "processing" && "Parsing document"}
                    {status === "ready" && "Ready"}
                </Badge>
            </div>
        </Card>
    )
}
