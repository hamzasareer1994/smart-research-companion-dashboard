"use client"

import { useState } from "react"
import { CalendarDays, Plus, Sparkles, Info, Check, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
const MILESTONES = [
    { id: 1, phase: "Literature Review", start: 0, end: 2, color: "#6366F1", status: "completed", assignee: "PI" },
    { id: 2, phase: "Data Collection", start: 1, end: 3, color: "#06B6D4", status: "completed", assignee: "RA" },
    { id: 3, phase: "Baseline Experiments", start: 2.5, end: 4.5, color: "#8B5CF6", status: "active", assignee: "Team" },
    { id: 4, phase: "Model Development", start: 3.5, end: 6, color: "#F59E0B", status: "upcoming", assignee: "Lead Dev" },
    { id: 5, phase: "Evaluation & Analysis", start: 5.5, end: 7, color: "#10B981", status: "upcoming", assignee: "Team" },
    { id: 6, phase: "Paper Writing", start: 6.5, end: 8, color: "#EF4444", status: "upcoming", assignee: "PI" },
]

const STATUS_CONFIG = {
    completed: { icon: Check, label: "Done", color: "text-teal", bg: "bg-teal-bg" },
    active: { icon: Clock, label: "In Progress", color: "text-accent", bg: "bg-accent-light" },
    upcoming: { icon: AlertCircle, label: "Upcoming", color: "text-ink3", bg: "bg-bg2" },
}

export default function TimelinePage() {
    const [selected, setSelected] = useState<number | null>(3)

    const selectedMilestone = MILESTONES.find(m => m.id === selected)

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-serif text-ink">Timeline <em className="italic">Planner</em></h1>
                        <Badge variant="outline" className="text-gold border-gold/40 text-xs">PAYG</Badge>
                    </div>
                    <p className="text-ink3 text-sm max-w-xl">Plan your research phases with an interactive Gantt chart. Set milestones, deadlines, and get AI-suggested timelines based on your project type.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 rounded-xl border-border gap-2"
                        onClick={() => toast.info("Add milestone in Phase 2")}>
                        <Plus size={15} /> Add Milestone
                    </Button>
                    <Button className="h-10 rounded-xl bg-accent text-white font-bold gap-2 shadow-lg shadow-accent/20"
                        onClick={() => toast.info("AI timeline suggestion coming in Phase 2")}>
                        <Sparkles size={15} /> AI Suggest Timeline
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Gantt */}
                <div className="lg:col-span-3 bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-accent" />
                            <span className="text-sm font-bold text-ink">Research Timeline — 2026</span>
                        </div>
                        <Badge className="bg-gold-bg text-gold border-0 text-xs">Preview</Badge>
                    </div>

                    {/* Month headers */}
                    <div className="px-5 pt-4">
                        <div className="grid ml-32 mb-2" style={{ gridTemplateColumns: `repeat(${MONTHS.length}, 1fr)` }}>
                            {MONTHS.map(m => <div key={m} className="text-xs font-bold text-ink4 text-center">{m}</div>)}
                        </div>
                    </div>

                    {/* Gantt rows */}
                    <div className="px-5 pb-5 space-y-2">
                        {MILESTONES.map(m => (
                            <div key={m.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelected(m.id)}>
                                <div className="w-28 shrink-0 text-xs font-bold text-ink3 truncate text-right pr-2 group-hover:text-ink transition-colors">{m.phase}</div>
                                <div className="flex-1 relative h-8 bg-bg2 rounded-lg overflow-hidden">
                                    <div
                                        className="absolute top-1 bottom-1 rounded-md flex items-center px-2 transition-all"
                                        style={{
                                            left: `${(m.start / MONTHS.length) * 100}%`,
                                            width: `${((m.end - m.start) / MONTHS.length) * 100}%`,
                                            background: selected === m.id ? m.color : m.color + "CC",
                                            boxShadow: selected === m.id ? `0 2px 8px ${m.color}66` : "none",
                                        }}
                                    >
                                        <span className="text-white text-[10px] font-bold truncate">{m.assignee}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Today marker overlay */}
                    <div className="px-5 pb-2 flex items-center gap-2">
                        <div className="ml-32 flex-1 relative h-1 bg-transparent">
                            <div className="absolute top-0 bottom-0 w-0.5 bg-red-400" style={{ left: `${(2.5 / MONTHS.length) * 100}%` }}>
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400" />
                            </div>
                        </div>
                    </div>
                    <div className="px-5 pb-3 ml-32">
                        <span className="text-xs text-red-400 font-bold">▲ Today (Mar 2026)</span>
                    </div>
                </div>

                {/* Detail panel */}
                <div className="space-y-4">
                    {selectedMilestone ? (() => {
                        const cfg = STATUS_CONFIG[selectedMilestone.status as keyof typeof STATUS_CONFIG]
                        const CfgIcon = cfg.icon
                        return (
                            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4">
                                <div>
                                    <h3 className="font-bold text-ink">{selectedMilestone.phase}</h3>
                                    <div className={cn("inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg text-xs font-bold", cfg.bg, cfg.color)}>
                                        <CfgIcon size={12} /> {cfg.label}
                                    </div>
                                </div>
                                {[
                                    ["Start", MONTHS[Math.floor(selectedMilestone.start)] + " 2026"],
                                    ["End", MONTHS[Math.min(Math.floor(selectedMilestone.end), MONTHS.length - 1)] + " 2026"],
                                    ["Duration", `${((selectedMilestone.end - selectedMilestone.start) * 4.3).toFixed(0)} weeks`],
                                    ["Assignee", selectedMilestone.assignee],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-sm">
                                        <span className="text-ink3">{k}</span><span className="font-bold text-ink">{v}</span>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="w-full rounded-xl border-border text-xs"
                                    onClick={() => toast.info("Edit milestone in Phase 2")}>Edit Milestone</Button>
                            </div>
                        )
                    })() : null}

                    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-2">
                        <h3 className="text-xs font-bold text-ink4 uppercase tracking-wider">Progress</h3>
                        {[["Completed", "2"], ["In Progress", "1"], ["Upcoming", "3"]].map(([k, v]) => (
                            <div key={k} className="flex justify-between text-sm">
                                <span className="text-ink3">{k}</span><span className="font-bold text-ink">{v}</span>
                            </div>
                        ))}
                        <div className="mt-3 h-2 bg-bg2 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-teal to-accent rounded-full" style={{ width: "33%" }} />
                        </div>
                        <p className="text-xs text-ink4">33% complete</p>
                    </div>

                    <div className="bg-accent-light border border-accent/10 rounded-xl p-4 flex gap-3">
                        <Info size={15} className="text-accent shrink-0 mt-0.5" />
                        <p className="text-xs text-accent-text leading-relaxed">AI will suggest realistic timelines based on your research type and project complexity.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
