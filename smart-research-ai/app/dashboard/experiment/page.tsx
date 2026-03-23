"use client"

import { useState } from "react"
import { FlaskConical, Database, BarChart2, Target, Cpu, ChevronRight, Sparkles, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SECTIONS = [
    {
        icon: Database, color: "teal", label: "Datasets",
        items: ["ImageNet-1K (1.2M images, MIT License)", "CIFAR-100 (60K images, 100 classes)", "MS-COCO (330K images, multi-label)"],
        badge: "3 recommended",
    },
    {
        icon: Cpu, color: "accent", label: "Baseline Models",
        items: ["ResNet-50 (Baseline — 76.1% top-1)", "ViT-B/16 (Prior SOTA — 81.8%)", "EfficientNet-B4 (Efficiency focus)"],
        badge: "3 baselines",
    },
    {
        icon: BarChart2, color: "gold", label: "Evaluation Metrics",
        items: ["Top-1 / Top-5 Accuracy", "mAP (Mean Average Precision)", "FLOPs & parameter count", "Latency (ms/image)"],
        badge: "4 metrics",
    },
    {
        icon: Target, color: "ink", label: "Ablations",
        items: ["w/o data augmentation", "w/o pre-training", "Depth variants (L, M, S)"],
        badge: "3 ablations",
    },
]

export default function ExperimentPage() {
    const [idea, setIdea] = useState("")
    const [generated, setGenerated] = useState(true)
    const [activeSection, setActiveSection] = useState(0)

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-serif text-ink">Experiment <em className="italic">Planner</em></h1>
                        <Badge variant="outline" className="text-gold border-gold/40 text-xs">25¢ per plan</Badge>
                    </div>
                    <p className="text-ink3 text-sm max-w-xl">Describe your research idea — AI recommends datasets, baselines, metrics, and a full reproducible experiment design from your project papers.</p>
                </div>
            </div>

            {/* Input */}
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4">
                <label className="text-xs font-bold text-ink4 uppercase tracking-wider">Research Hypothesis</label>
                <div className="flex gap-2">
                    <Input
                        placeholder="e.g. 'A hybrid CNN-Transformer achieves better accuracy on medical image segmentation...'"
                        value={idea}
                        onChange={e => setIdea(e.target.value)}
                        className="h-11 bg-bg2 border-border rounded-xl flex-1"
                    />
                    <Button className="h-11 px-6 rounded-xl bg-accent text-white font-bold gap-2 shadow-lg shadow-accent/20"
                        onClick={() => toast.info("AI experiment planner coming in Phase 2 — preview shown below")}>
                        <Sparkles size={16} /> Plan Experiment
                    </Button>
                </div>
            </div>

            {/* Generated Plan */}
            {generated && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Section tabs */}
                    <div className="space-y-2">
                        {SECTIONS.map((s, i) => {
                            const SIcon = s.icon
                            return (
                            <button
                                key={i}
                                onClick={() => setActiveSection(i)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                                    activeSection === i ? "border-accent/30 bg-accent-light" : "border-border bg-surface hover:bg-bg2"
                                )}
                            >
                                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                    activeSection === i ? "bg-accent text-white" : "bg-bg2 text-ink3")}>
                                    <SIcon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn("font-bold text-sm", activeSection === i ? "text-accent" : "text-ink")}>{s.label}</p>
                                    <p className="text-xs text-ink4">{s.badge}</p>
                                </div>
                                <ChevronRight size={14} className={cn("shrink-0", activeSection === i ? "text-accent" : "text-ink4")} />
                            </button>
                        )})}
                    </div>

                    {/* Detail */}
                    <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {(() => { const Icon = SECTIONS[activeSection].icon; return <Icon size={18} className="text-accent" /> })()}
                                <h3 className="font-bold text-ink">{SECTIONS[activeSection].label}</h3>
                            </div>
                            <Badge className="bg-gold-bg text-gold border-0 text-xs">AI Preview</Badge>
                        </div>
                        <div className="space-y-3">
                            {SECTIONS[activeSection].items.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-bg2/50 rounded-xl border border-border">
                                    <div className="w-6 h-6 rounded-full bg-accent-light text-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                                    <span className="text-sm text-ink">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" className="rounded-xl border-border flex-1" onClick={() => toast.info("Export coming in Phase 2")}>Export Plan</Button>
                            <Button className="rounded-xl bg-accent text-white flex-1" onClick={() => toast.info("Full AI generation coming in Phase 2")}>Regenerate Section</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-accent-light border border-accent/10 rounded-xl p-4 flex gap-3">
                <Info size={15} className="text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-accent-text">Full AI generation will analyze your project papers to recommend domain-specific datasets, baselines, and metrics.</p>
            </div>
        </div>
    )
}
