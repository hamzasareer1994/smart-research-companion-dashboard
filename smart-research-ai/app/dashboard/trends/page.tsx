"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Minus, Search, Sparkles, Info, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const TRENDS = [
    { topic: "Multimodal LLMs", score: 94, delta: +38, velocity: "↑ Explosive", color: "#6366F1", desc: "GPT-4V, Gemini Ultra driving rapid growth in vision-language models." },
    { topic: "Mixture of Experts", score: 87, delta: +29, velocity: "↑ Surging", color: "#8B5CF6", desc: "MoE scaling laws showing 10× efficiency vs dense transformers." },
    { topic: "AI Safety & Alignment", score: 82, delta: +21, velocity: "↑ Rising", color: "#06B6D4", desc: "RLHF, Constitutional AI, and interpretability research accelerating." },
    { topic: "Retrieval-Augmented Gen", score: 78, delta: +18, velocity: "↑ Growing", color: "#10B981", desc: "RAG becoming standard architecture for enterprise LLM deployments." },
    { topic: "Neural Architecture Search", score: 51, delta: -4, velocity: "→ Stable", color: "#F59E0B", desc: "Interest plateauing as foundation models replace bespoke NAS." },
    { topic: "Graph Neural Networks", score: 44, delta: -12, velocity: "↓ Declining", color: "#EF4444", desc: "GNN research ceding ground to transformer-based approaches." },
]

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
const SPARKLINE_DATA: Record<string, number[]> = {
    "Multimodal LLMs": [40, 45, 52, 60, 68, 75, 82, 89, 94],
    "Mixture of Experts": [30, 35, 40, 50, 58, 65, 72, 80, 87],
    "AI Safety & Alignment": [45, 48, 52, 57, 62, 66, 71, 77, 82],
    "Retrieval-Augmented Gen": [38, 42, 48, 53, 58, 64, 68, 74, 78],
    "Neural Architecture Search": [58, 56, 55, 54, 53, 53, 52, 51, 51],
    "Graph Neural Networks": [60, 58, 56, 54, 52, 50, 48, 46, 44],
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
    const min = Math.min(...data), max = Math.max(...data)
    const norm = (v: number) => 1 - (v - min) / (max - min + 1)
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${norm(v) * 30}`).join(" ")
    return (
        <svg viewBox={`0 0 100 32`} className="w-24 h-8">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function TrendsPage() {
    const [query, setQuery] = useState("")
    const [selected, setSelected] = useState<string | null>("Multimodal LLMs")

    const selectedTrend = TRENDS.find(t => t.topic === selected)

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-serif text-ink">Trend <em className="italic">Predictor</em></h1>
                        <Badge variant="outline" className="text-gold border-gold/40 text-xs">20¢ per analysis</Badge>
                    </div>
                    <p className="text-ink3 text-sm max-w-xl">Analyzes citation velocity, arXiv submissions, and conference papers to surface emerging research directions in your field.</p>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4" size={16} />
                    <Input placeholder="Enter your research domain (e.g. 'large language models', 'computer vision')..." value={query} onChange={e => setQuery(e.target.value)} className="pl-10 h-11 bg-bg2 border-border rounded-xl" />
                </div>
                <Button className="h-11 px-6 rounded-xl bg-accent text-white font-bold gap-2 shadow-lg shadow-accent/20"
                    onClick={() => toast.info("Live trend analysis coming in Phase 2 — preview data shown below")}>
                    <Sparkles size={16} /> Analyze Trends
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-ink4 uppercase tracking-wider">Trending Topics — AI/ML (Preview)</h3>
                        <Badge className="bg-gold-bg text-gold border-0 text-xs">Live data in Phase 2</Badge>
                    </div>
                    {TRENDS.map((t, i) => (
                        <button key={i} onClick={() => setSelected(t.topic)}
                            className={cn("w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                                selected === t.topic ? "border-accent/30 bg-accent-light" : "border-border bg-surface hover:bg-bg2")}>
                            <div className="text-lg font-bold text-ink w-6 shrink-0 text-center">{i + 1}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-ink">{t.topic}</span>
                                    <span className={cn("text-xs font-bold", t.delta > 0 ? "text-teal" : t.delta < 0 ? "text-red-400" : "text-ink3")}>
                                        {t.delta > 0 ? `+${t.delta}%` : `${t.delta}%`}
                                    </span>
                                </div>
                                <span className="text-xs text-ink3">{t.velocity}</span>
                            </div>
                            <Sparkline data={SPARKLINE_DATA[t.topic] || []} color={t.color} />
                            <div className="w-12 text-right">
                                <span className="text-lg font-bold" style={{ color: t.color }}>{t.score}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {selectedTrend ? (
                        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={18} style={{ color: selectedTrend.color }} />
                                    <span className="font-bold text-ink">{selectedTrend.topic}</span>
                                </div>
                                <div className="text-4xl font-bold" style={{ color: selectedTrend.color }}>{selectedTrend.score}</div>
                                <div className="text-xs text-ink3 mt-1">Trend Score / 100</div>
                            </div>
                            <p className="text-sm text-ink3 leading-relaxed border-l-2 border-border pl-3 italic">{selectedTrend.desc}</p>
                            <div className="space-y-2">
                                {[["Momentum", selectedTrend.velocity], ["6-mo Change", `${selectedTrend.delta > 0 ? "+" : ""}${selectedTrend.delta}%`], ["Confidence", "87%"]].map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-sm">
                                        <span className="text-ink3">{k}</span><span className="font-bold text-ink">{v}</span>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full rounded-xl border-border gap-2" onClick={() => toast.info("Search papers for this topic in Search Papers")}>
                                <ArrowUpRight size={14} /> Find Related Papers
                            </Button>
                        </div>
                    ) : null}
                    <div className="bg-accent-light border border-accent/10 rounded-xl p-4 flex gap-3">
                        <Info size={15} className="text-accent shrink-0 mt-0.5" />
                        <p className="text-xs text-accent-text leading-relaxed">Live analysis will scan real-time arXiv, Semantic Scholar, and conference data for your domain.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
