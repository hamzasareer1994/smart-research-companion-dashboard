"use client"

import { useState } from "react"
import { Network, Search, ZoomIn, ZoomOut, RotateCcw, Download, Info, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const MOCK_NODES = [
    { id: 1, label: "Transformer", x: 50, y: 38, r: 5.5, color: "#6366F1", citations: 54000 },
    { id: 2, label: "BERT", x: 25, y: 22, r: 4.5, color: "#8B5CF6", citations: 38000 },
    { id: 3, label: "GPT-4", x: 72, y: 20, r: 4.5, color: "#8B5CF6", citations: 29000 },
    { id: 4, label: "Attention", x: 50, y: 62, r: 4, color: "#06B6D4", citations: 21000 },
    { id: 5, label: "Fine-tuning", x: 20, y: 55, r: 3.5, color: "#06B6D4", citations: 15000 },
    { id: 6, label: "Prompting", x: 78, y: 55, r: 3.5, color: "#06B6D4", citations: 12000 },
    { id: 7, label: "RLHF", x: 38, y: 80, r: 3, color: "#F59E0B", citations: 8000 },
    { id: 8, label: "RAG", x: 62, y: 80, r: 3, color: "#F59E0B", citations: 7000 },
]

const MOCK_EDGES = [
    [1, 2], [1, 3], [1, 4], [2, 5], [3, 6], [4, 7], [4, 8], [5, 7], [6, 8],
]

export default function LitMapPage() {
    const [query, setQuery] = useState("")
    const [activeNode, setActiveNode] = useState<number | null>(1)
    const [zoom, setZoom] = useState(100)

    const activeData = MOCK_NODES.find(n => n.id === activeNode)

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-serif text-ink">Literature <em className="italic">Map</em></h1>
                        <Badge variant="outline" className="text-gold border-gold/40 text-xs">40¢ per map</Badge>
                    </div>
                    <p className="text-ink3 text-sm max-w-xl">Visualize citation relationships, theme clusters, and contradictions across your papers as an interactive knowledge graph.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-bg2 border border-border rounded-xl p-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setZoom(z => Math.min(150, z + 10))}><ZoomIn size={14} /></Button>
                        <span className="text-xs font-bold text-ink3 w-10 text-center">{zoom}%</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setZoom(z => Math.max(50, z - 10))}><ZoomOut size={14} /></Button>
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" onClick={() => setZoom(100)}><RotateCcw size={14} /></Button>
                    <Button variant="outline" className="h-10 rounded-xl gap-2" onClick={() => toast.info("Export available after Phase 2 launch")}><Download size={14} /> Export</Button>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4" size={16} />
                    <Input placeholder="Enter topic to map (e.g. 'transformer attention mechanisms')..." value={query} onChange={e => setQuery(e.target.value)} className="pl-10 h-11 bg-bg2 border-border rounded-xl" onKeyDown={e => e.key === "Enter" && toast.info("AI mapping coming in Phase 2")} />
                </div>
                <Button className="h-11 px-6 rounded-xl bg-accent text-white font-bold shadow-lg shadow-accent/20 gap-2" onClick={() => toast.info("AI mapping engine coming in Phase 2 — preview shown below")}>
                    <Sparkles size={16} /> Generate Map
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Network size={16} className="text-accent" />
                            <span className="text-sm font-bold text-ink">Citation Network — AI & NLP</span>
                        </div>
                        <Badge className="bg-gold-bg text-gold border-0 text-xs font-bold">Preview</Badge>
                    </div>
                    <div className="relative bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" style={{ height: 420 }}>
                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center", transition: "transform 0.2s" }}>
                            {MOCK_EDGES.map(([f, t], i) => {
                                const from = MOCK_NODES.find(n => n.id === f)!
                                const to = MOCK_NODES.find(n => n.id === t)!
                                return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#cbd5e1" strokeWidth="0.35" strokeDasharray={activeNode === f || activeNode === t ? "none" : "none"} opacity={activeNode && activeNode !== f && activeNode !== t ? 0.3 : 0.8} />
                            })}
                            {MOCK_NODES.map(node => (
                                <g key={node.id} onClick={() => setActiveNode(node.id)} style={{ cursor: "pointer" }}>
                                    <circle cx={node.x} cy={node.y} r={node.r + 1.5} fill="transparent" />
                                    <circle cx={node.x} cy={node.y} r={node.r}
                                        fill={activeNode === node.id ? node.color : node.color + "BB"}
                                        stroke={activeNode === node.id ? "white" : "transparent"}
                                        strokeWidth="0.6"
                                        opacity={activeNode && activeNode !== node.id ? 0.5 : 1}
                                        style={{ filter: activeNode === node.id ? `drop-shadow(0 0 4px ${node.color}88)` : "none", transition: "all 0.2s" }}
                                    />
                                    <text x={node.x} y={node.y + node.r + 2.5} textAnchor="middle" fontSize="2.2" fill="#64748b" fontWeight="600">
                                        {node.label}
                                    </text>
                                </g>
                            ))}
                        </svg>
                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 text-xs text-ink3">
                            {[["#6366F1", "Core"], ["#8B5CF6", "Foundational"], ["#06B6D4", "Applied"], ["#F59E0B", "Emerging"]].map(([color, label]) => (
                                <div key={label} className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-ink4 uppercase tracking-wider mb-4">Node Details</h3>
                        {activeData ? (
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: activeData.color + "22" }}>
                                    <Network size={18} style={{ color: activeData.color }} />
                                </div>
                                <p className="font-bold text-ink">{activeData.label}</p>
                                <p className="text-xs text-ink4">{activeData.citations.toLocaleString()} citations</p>
                                <div className="text-xs text-ink3 bg-bg2 rounded-lg p-3 leading-relaxed">
                                    Connected to {MOCK_EDGES.filter(([f, t]) => f === activeData.id || t === activeData.id).length} related clusters in network.
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-ink4 italic">Click a node to inspect</p>
                        )}
                    </div>
                    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3">
                        <h3 className="text-xs font-bold text-ink4 uppercase tracking-wider">Stats</h3>
                        {[["Nodes", "8"], ["Edges", "9"], ["Clusters", "4"], ["Max Depth", "3"]].map(([k, v]) => (
                            <div key={k} className="flex justify-between text-sm">
                                <span className="text-ink3">{k}</span><span className="font-bold text-ink">{v}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-accent-light border border-accent/10 rounded-2xl p-4 flex gap-3">
                        <Info size={15} className="text-accent shrink-0 mt-0.5" />
                        <p className="text-xs text-accent-text leading-relaxed">Live map will use your project papers to build a real citation network.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
