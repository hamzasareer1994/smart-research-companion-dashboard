"use client"

import { useState } from "react"
import { GitCompare, AlertTriangle, CheckCircle, Minus, Sparkles, Info, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const MOCK_CONTRADICTIONS = [
    {
        id: 1, severity: "high",
        claim_a: { paper: "Vaswani et al. (2017)", text: "Transformers require O(n²) memory due to full self-attention over all tokens." },
        claim_b: { paper: "Beltagy et al. (2020)", text: "Longformer achieves O(n) memory complexity with sliding window attention." },
        reason: "Different attention mechanisms — full vs. sparse. Both correct for their respective models. Not a fundamental contradiction.",
        resolution: "Context-dependent: applies to different architectures."
    },
    {
        id: 2, severity: "medium",
        claim_a: { paper: "Brown et al. (2020)", text: "GPT-3 achieves few-shot performance without any fine-tuning or gradient updates." },
        claim_b: { paper: "Wei et al. (2022)", text: "Chain-of-thought prompting significantly outperforms standard few-shot prompting." },
        reason: "Brown et al. established the few-shot baseline; Wei et al. improve upon it. The newer work supersedes, not contradicts.",
        resolution: "Temporal: Wei (2022) is an improvement, not a contradiction."
    },
    {
        id: 3, severity: "low",
        claim_a: { paper: "Kaplan et al. (2020)", text: "Scaling laws suggest larger models always outperform smaller models given enough data." },
        claim_b: { paper: "Hoffmann et al. (2022)", text: "Chinchilla shows optimal compute requires equal scaling of model size and data." },
        reason: "Kaplan held data fixed; Hoffmann co-scales data. The scaling exponents differ, creating apparent contradiction.",
        resolution: "Methodological: different experimental conditions."
    },
]

const SEVERITY_CONFIG = {
    high: { color: "text-red-500", bg: "bg-red-50 border-red-100", icon: AlertTriangle, label: "Direct Conflict" },
    medium: { color: "text-amber-500", bg: "bg-amber-50 border-amber-100", icon: Minus, label: "Tension" },
    low: { color: "text-blue-500", bg: "bg-blue-50 border-blue-100", icon: CheckCircle, label: "Nuanced" },
}

export default function ContradictionsPage() {
    const [active, setActive] = useState<number | null>(1)
    const activeContra = MOCK_CONTRADICTIONS.find(c => c.id === active)

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-serif text-ink">Contradiction <em className="italic">Finder</em></h1>
                        <Badge variant="outline" className="text-gold border-gold/40 text-xs">30¢ per analysis</Badge>
                    </div>
                    <p className="text-ink3 text-sm max-w-xl">Compares claims across all papers in your project. AI surfaces conflicting results with explanations and possible reasons for each contradiction.</p>
                </div>
                <Button className="h-11 px-6 rounded-xl bg-accent text-white font-bold gap-2 shadow-lg shadow-accent/20"
                    onClick={() => toast.info("AI contradiction analysis coming in Phase 2 — preview shown below")}>
                    <Sparkles size={16} /> Analyze Project
                </Button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
                {[["3", "Contradictions Found", "text-red-500"], ["12", "Papers Analyzed", "text-accent"], ["87%", "Confidence Score", "text-teal"]].map(([val, label, color]) => (
                    <div key={label} className="bg-surface border border-border rounded-xl p-4 text-center shadow-sm">
                        <div className={cn("text-2xl font-bold mb-1", color)}>{val}</div>
                        <div className="text-xs text-ink3">{label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* List */}
                <div className="lg:col-span-2 space-y-3">
                    <h3 className="text-xs font-bold text-ink4 uppercase tracking-wider mb-3 flex items-center justify-between">
                        Detected Conflicts <Badge className="bg-gold-bg text-gold border-0 text-xs">Preview</Badge>
                    </h3>
                    {MOCK_CONTRADICTIONS.map(c => {
                        const cfg = SEVERITY_CONFIG[c.severity as keyof typeof SEVERITY_CONFIG]
                        const CfgIcon = cfg.icon
                        return (
                            <button key={c.id} onClick={() => setActive(c.id)}
                                className={cn("w-full text-left p-4 rounded-xl border transition-all",
                                    active === c.id ? "border-accent/30 bg-accent-light" : "border-border bg-surface hover:bg-bg2")}>
                                <div className="flex items-center gap-2 mb-2">
                                    <CfgIcon size={14} className={cfg.color} />
                                    <Badge className={cn("text-xs border", cfg.bg, cfg.color)}>{cfg.label}</Badge>
                                </div>
                                <p className="text-xs text-ink line-clamp-2">{c.claim_a.paper} vs. {c.claim_b.paper}</p>
                                <ChevronRight size={12} className="text-ink4 mt-2" />
                            </button>
                        )
                    })}
                </div>

                {/* Detail */}
                {activeContra && (() => {
                    const cfg = SEVERITY_CONFIG[activeContra.severity as keyof typeof SEVERITY_CONFIG]
                    const CfgIcon = cfg.icon
                    return (
                        <div className="lg:col-span-3 bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
                            <div className="flex items-center gap-2">
                                <CfgIcon size={18} className={cfg.color} />
                                <h3 className="font-bold text-ink">Contradiction #{activeContra.id}</h3>
                                <Badge className={cn("text-xs border ml-auto", cfg.bg, cfg.color)}>{cfg.label}</Badge>
                            </div>

                            <div className="space-y-3">
                                {[activeContra.claim_a, activeContra.claim_b].map((claim, i) => (
                                    <div key={i} className={cn("rounded-xl p-4 border", i === 0 ? "bg-blue-50 border-blue-100" : "bg-red-50 border-red-100")}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white", i === 0 ? "bg-blue-400" : "bg-red-400")}>{String.fromCharCode(65 + i)}</div>
                                            <span className="text-xs font-bold text-ink">{claim.paper}</span>
                                        </div>
                                        <p className="text-sm text-ink italic leading-relaxed">"{claim.text}"</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-bg2 rounded-xl p-4 space-y-2">
                                <p className="text-xs font-bold text-ink4 uppercase tracking-wider">AI Analysis</p>
                                <p className="text-sm text-ink leading-relaxed">{activeContra.reason}</p>
                            </div>

                            <div className="flex items-center gap-2 bg-teal-bg border border-teal/20 rounded-xl p-3">
                                <CheckCircle size={14} className="text-teal shrink-0" />
                                <p className="text-xs text-teal-text font-medium">{activeContra.resolution}</p>
                            </div>
                        </div>
                    )
                })()}
            </div>

            <div className="bg-accent-light border border-accent/10 rounded-xl p-4 flex gap-3">
                <Info size={15} className="text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-accent-text">Full analysis will compare claims across all papers in your project using AI reasoning, with citations and confidence scores.</p>
            </div>
        </div>
    )
}
