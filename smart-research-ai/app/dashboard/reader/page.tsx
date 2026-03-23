"use client"

import { useState } from "react"
import { BookOpen, Lightbulb, Hash, BarChart2, AlertCircle, ChevronRight, Sparkles, Info, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const MOCK_PAPER = {
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: 2017,
    contributions: [
        "Introduced the Transformer architecture based solely on attention mechanisms, eliminating recurrence and convolutions.",
        "Proposed multi-head attention enabling the model to jointly attend to information from different representation subspaces.",
        "Demonstrated superior performance on WMT 2014 En-De (28.4 BLEU) with 3.5× less training time than prior SOTA.",
    ],
    equations: [
        { label: "Scaled Dot-Product Attention", tex: "Attention(Q,K,V) = softmax(QKᵀ / √dₖ)V" },
        { label: "Multi-Head Attention", tex: "MultiHead(Q,K,V) = Concat(head₁,...,headₕ)Wᴼ" },
    ],
    methodology: "Encoder-decoder Transformer. Encoder: 6 layers, each with multi-head self-attention (8 heads, d_model=512) + FFN (d_ff=2048). Decoder: additional cross-attention sub-layer. Positional encodings (sinusoidal) added to input embeddings. Trained with Adam optimizer, 100K steps, 8 P100 GPUs.",
    limitations: [
        "O(n²) memory complexity limits context to short sequences without modifications.",
        "Lacks inherent positional bias — must inject positional encodings explicitly.",
        "Requires large amounts of training data; poor sample efficiency compared to RNNs.",
    ],
}

const TABS = [
    { id: "contributions", label: "Key Contributions", icon: Lightbulb },
    { id: "equations", label: "Core Equations", icon: Hash },
    { id: "methodology", label: "Methodology", icon: BarChart2 },
    { id: "limitations", label: "Limitations", icon: AlertCircle },
]

export default function SmartReaderPage() {
    const [activeTab, setActiveTab] = useState("contributions")

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-up">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-serif text-ink">Smart <em className="italic">Reader</em></h1>
                    <Badge variant="outline" className="text-gold border-gold/40 text-xs">15¢ per paper</Badge>
                </div>
                <p className="text-ink3 text-sm max-w-xl">Instantly extracts key contributions, equations, methodology, figures, and limitations from any paper in your library.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Paper selector */}
                <div className="space-y-4">
                    <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
                        <h3 className="text-xs font-bold text-ink4 uppercase tracking-wider mb-3">Select Paper</h3>
                        {[
                            { title: "Attention Is All You Need", year: 2017, active: true },
                            { title: "BERT: Pre-training of Deep Bidirectional...", year: 2019, active: false },
                            { title: "Language Models are Few-Shot Learners", year: 2020, active: false },
                        ].map((p, i) => (
                            <div key={i} className={cn("p-3 rounded-xl border cursor-pointer transition-all mb-2",
                                p.active ? "border-accent/30 bg-accent-light" : "border-border hover:bg-bg2")}>
                                <p className="text-xs font-bold text-ink line-clamp-2">{p.title}</p>
                                <p className="text-xs text-ink4 mt-1">{p.year}</p>
                                {p.active && <Badge className="bg-accent text-white border-0 text-[10px] mt-1">Active</Badge>}
                            </div>
                        ))}
                        <Button variant="outline" className="w-full h-9 rounded-xl border-border text-xs mt-2 gap-2"
                            onClick={() => toast.info("Select from your uploaded papers in Phase 2")}>
                            <FileText size={12} /> Add from Library
                        </Button>
                    </div>
                    <Button className="w-full h-10 rounded-xl bg-accent text-white font-bold text-sm gap-2 shadow-lg shadow-accent/20"
                        onClick={() => toast.info("AI smart reading coming in Phase 2 — preview shown below")}>
                        <Sparkles size={15} /> Analyze Paper
                    </Button>
                </div>

                {/* Reading pane */}
                <div className="lg:col-span-3 bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
                    {/* Paper header */}
                    <div className="p-5 border-b border-border bg-bg2/30">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="font-bold text-ink text-lg leading-tight">{MOCK_PAPER.title}</h2>
                                <p className="text-sm text-ink3 mt-1 italic">{MOCK_PAPER.authors} • {MOCK_PAPER.year}</p>
                            </div>
                            <Badge className="bg-gold-bg text-gold border-0 text-xs shrink-0">AI Preview</Badge>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-border px-5 overflow-x-auto">
                        {TABS.map(tab => {
                            const TabIcon = tab.icon
                            return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={cn("flex items-center gap-1.5 py-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap",
                                    activeTab === tab.id ? "border-accent text-accent" : "border-transparent text-ink4 hover:text-ink")}>
                                <TabIcon size={13} /> {tab.label}
                            </button>
                        )})}
                    </div>

                    {/* Tab content */}
                    <div className="p-6">
                        {activeTab === "contributions" && (
                            <div className="space-y-3">
                                {MOCK_PAPER.contributions.map((c, i) => (
                                    <div key={i} className="flex gap-3 p-4 bg-bg2/50 rounded-xl border border-border">
                                        <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                                        <p className="text-sm text-ink leading-relaxed">{c}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === "equations" && (
                            <div className="space-y-4">
                                {MOCK_PAPER.equations.map((eq, i) => (
                                    <div key={i} className="p-5 bg-bg2/50 rounded-xl border border-border">
                                        <p className="text-xs font-bold text-ink4 uppercase tracking-wider mb-3">{eq.label}</p>
                                        <div className="bg-surface rounded-lg p-4 font-mono text-sm text-ink text-center border border-border">{eq.tex}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === "methodology" && (
                            <div className="p-5 bg-bg2/50 rounded-xl border border-border">
                                <p className="text-sm text-ink leading-relaxed">{MOCK_PAPER.methodology}</p>
                            </div>
                        )}
                        {activeTab === "limitations" && (
                            <div className="space-y-3">
                                {MOCK_PAPER.limitations.map((l, i) => (
                                    <div key={i} className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                                        <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-sm text-ink leading-relaxed">{l}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-accent-light border border-accent/10 rounded-xl p-4 flex gap-3">
                <Info size={15} className="text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-accent-text">Smart Reader will process any paper in your library and extract structured insights using AI, saving hours of manual reading.</p>
            </div>
        </div>
    )
}
