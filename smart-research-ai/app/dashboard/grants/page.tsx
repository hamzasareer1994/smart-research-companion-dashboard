"use client"

import { useState } from "react"
import { FileText, Sparkles, Info, ChevronDown, ChevronUp, CheckCircle, Trophy, DollarSign, Target, Users, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SECTIONS = [
    { icon: Target, label: "Project Significance", status: "generated", preview: "This research addresses a critical gap in the understanding of large-scale transformer efficiency. Current SOTA models require prohibitive computational resources, limiting accessibility for smaller research institutions..." },
    { icon: BarChart2, label: "Methodology", status: "generated", preview: "We propose a three-phase experimental protocol: (1) baseline establishment using existing BERT and GPT-2 checkpoints; (2) systematic ablation across attention head counts (2, 4, 8, 16); (3) efficiency measurement via FLOPs analysis..." },
    { icon: DollarSign, label: "Budget Justification", status: "ready", preview: null },
    { icon: Users, label: "Team Qualifications", status: "ready", preview: null },
    { icon: CheckCircle, label: "Expected Impact", status: "ready", preview: null },
]

export default function GrantsPage() {
    const [expanded, setExpanded] = useState<string | null>("Project Significance")
    const [title, setTitle] = useState("")
    const [agency, setAgency] = useState("")

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-serif text-ink">Grant <em className="italic">Proposals</em></h1>
                        <Badge variant="outline" className="text-gold border-gold/40 text-xs">50¢ per section</Badge>
                    </div>
                    <p className="text-ink3 text-sm max-w-xl">Generate structured grant sections — significance, methodology, budget justification, impact — grounded in your project's research context.</p>
                </div>
            </div>

            {/* Config */}
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-ink4 uppercase tracking-wider">Grant Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-ink3">Project Title</label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Efficient Transformer Architectures for Edge Deployment" className="h-10 bg-bg2 border-border rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-ink3">Funding Agency</label>
                        <Input value={agency} onChange={e => setAgency(e.target.value)} placeholder="e.g. NSF, NIH, EU Horizon, DARPA..." className="h-10 bg-bg2 border-border rounded-xl" />
                    </div>
                </div>
                <Button className="h-10 px-6 rounded-xl bg-accent text-white font-bold gap-2 shadow-lg shadow-accent/20"
                    onClick={() => toast.info("AI grant generation coming in Phase 2 — preview sections shown below")}>
                    <Sparkles size={15} /> Generate All Sections
                </Button>
            </div>

            {/* Sections */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-ink4 uppercase tracking-wider">Proposal Sections</h3>
                    <Badge className="bg-gold-bg text-gold border-0 text-xs">2 of 5 generated (preview)</Badge>
                </div>
                {SECTIONS.map((s, i) => {
                    const SIcon = s.icon
                    return (
                    <div key={i} className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
                        <button className="w-full flex items-center gap-4 p-5 text-left hover:bg-bg2/50 transition-colors"
                            onClick={() => setExpanded(expanded === s.label ? null : s.label)}>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                s.status === "generated" ? "bg-teal-bg text-teal" : "bg-bg2 text-ink3")}>
                                <SIcon size={18} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-ink">{s.label}</span>
                                    {s.status === "generated"
                                        ? <Badge className="bg-teal-bg text-teal border-0 text-xs">Generated</Badge>
                                        : <Badge variant="outline" className="border-border text-ink4 text-xs">Ready</Badge>}
                                </div>
                                <span className="text-xs text-ink4">{s.status === "generated" ? "Click to review" : "Click Generate to create"}</span>
                            </div>
                            {expanded === s.label ? <ChevronUp size={16} className="text-ink4" /> : <ChevronDown size={16} className="text-ink4" />}
                        </button>
                        {expanded === s.label && s.preview && (
                            <div className="px-5 pb-5 border-t border-border">
                                <div className="mt-4 p-4 bg-bg2/50 rounded-xl text-sm text-ink leading-relaxed font-serif italic">
                                    {s.preview}
                                    <span className="not-italic text-ink4"> [continues...]</span>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <Button variant="outline" size="sm" className="rounded-lg border-border text-xs" onClick={() => toast.info("Regeneration in Phase 2")}>Regenerate</Button>
                                    <Button size="sm" className="rounded-lg bg-accent text-white text-xs" onClick={() => toast.info("Edit mode in Phase 2")}>Edit Section</Button>
                                    <Button variant="outline" size="sm" className="rounded-lg border-border text-xs ml-auto" onClick={() => toast.info("Export in Phase 2")}>Export as DOCX</Button>
                                </div>
                            </div>
                        )}
                        {expanded === s.label && !s.preview && (
                            <div className="px-5 pb-5 border-t border-border">
                                <div className="mt-4 flex items-center gap-3">
                                    <Button className="h-9 rounded-xl bg-accent text-white text-xs gap-1.5" onClick={() => toast.info("AI section generation coming in Phase 2")}>
                                        <Sparkles size={13} /> Generate {s.label}
                                    </Button>
                                    <span className="text-xs text-ink4">~50¢ credit cost</span>
                                </div>
                            </div>
                        )}
                    </div>
                )})}
            </div>

            <div className="bg-accent-light border border-accent/10 rounded-xl p-4 flex gap-3">
                <Info size={15} className="text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-accent-text">Each section will be generated using your project papers and research context, tailored to the specific funding agency's requirements.</p>
            </div>
        </div>
    )
}
