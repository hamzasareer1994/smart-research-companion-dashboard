"use client"

import { useState } from "react"
import { PenTool, FileText, Quote, Bold, Italic, List, AlignLeft, Sparkles, Info, BookOpen, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SECTIONS = ["Introduction", "Literature Review", "Methodology", "Results & Discussion", "Conclusion"]
const PAPERS = [
    { title: "Attention Is All You Need", authors: "Vaswani et al.", year: 2017 },
    { title: "BERT: Pre-training of Deep Bidirectional Transformers", authors: "Devlin et al.", year: 2019 },
    { title: "Language Models are Few-Shot Learners", authors: "Brown et al.", year: 2020 },
]

const SAMPLE_TEXT = `The field of natural language processing has undergone a paradigm shift with the introduction of transformer-based architectures. Vaswani et al. (2017) demonstrated that attention mechanisms alone, without recurrent or convolutional operations, achieve superior performance on sequence-to-sequence tasks. Subsequently, Devlin et al. (2019) leveraged this architecture to develop BERT, a bidirectional encoder that established new benchmarks across a wide range of NLP tasks through a self-supervised pre-training regime.

Building upon these foundational works, Brown et al. (2020) demonstrated that scaling transformer models to unprecedented sizes enables few-shot learning capabilities, challenging assumptions about the necessity of task-specific fine-tuning. This work introduced GPT-3, which with 175 billion parameters, achieves competitive performance across diverse tasks with minimal examples.`

export default function WritingPage() {
    const [activeSection, setActiveSection] = useState("Literature Review")
    const [selectedPapers, setSelectedPapers] = useState<string[]>(["Attention Is All You Need", "BERT: Pre-training of Deep Bidirectional Transformers"])

    const togglePaper = (title: string) => setSelectedPapers(p => p.includes(title) ? p.filter(x => x !== title) : [...p, title])

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-serif text-ink">Writing <em className="italic">Assistant</em></h1>
                        <Badge variant="outline" className="text-gold border-gold/40 text-xs">50¢ per section</Badge>
                    </div>
                    <p className="text-ink3 text-sm max-w-xl">Generate full paper sections with proper citations pulled from your project library. Introduction, methodology, literature review, and more.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[580px]">
                {/* Left: Context + Section picker */}
                <div className="space-y-4 flex flex-col">
                    <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex-1 overflow-y-auto space-y-3">
                        <h3 className="text-xs font-bold text-ink4 uppercase tracking-wider flex items-center gap-2">
                            <BookOpen size={12} /> Paper Context
                        </h3>
                        {PAPERS.map(p => (
                            <div key={p.title} onClick={() => togglePaper(p.title)}
                                className={cn("p-3 rounded-xl border cursor-pointer transition-all",
                                    selectedPapers.includes(p.title) ? "border-accent/30 bg-accent-light" : "border-border bg-bg2/50 hover:bg-bg2")}>
                                <p className="text-xs font-bold text-ink line-clamp-2">{p.title}</p>
                                <p className="text-xs text-ink4 mt-1">{p.authors} • {p.year}</p>
                                {selectedPapers.includes(p.title) && <Badge className="bg-accent text-white border-0 text-[10px] mt-1">Active Context</Badge>}
                            </div>
                        ))}
                    </div>

                    <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm space-y-2">
                        <h3 className="text-xs font-bold text-ink4 uppercase tracking-wider mb-3">Section</h3>
                        {SECTIONS.map(s => (
                            <button key={s} onClick={() => setActiveSection(s)}
                                className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                                    activeSection === s ? "bg-accent text-white font-bold" : "text-ink3 hover:bg-bg2")}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Editor */}
                <div className="lg:col-span-3 bg-surface border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1">
                            {[Bold, Italic, List, AlignLeft, Quote].map((Icon, i) => (
                                <Button key={i} variant="ghost" size="icon" className="h-7 w-7 rounded-md text-ink3 hover:text-ink hover:bg-bg2">
                                    <Icon size={14} />
                                </Button>
                            ))}
                            <div className="w-px h-5 bg-border mx-1" />
                            <Badge className="bg-gold-bg text-gold border-0 text-xs">{selectedPapers.length} sources active</Badge>
                        </div>
                        <Button className="h-8 px-4 rounded-xl bg-accent text-white font-bold text-xs gap-1.5 shadow-lg shadow-accent/20"
                            onClick={() => toast.info("AI writing generation coming in Phase 2 — preview text shown below")}>
                            <Sparkles size={13} /> Generate Section
                        </Button>
                    </div>

                    {/* Section label */}
                    <div className="px-6 pt-5 pb-2 border-b border-border">
                        <div className="flex items-center gap-2">
                            <FileText size={14} className="text-accent" />
                            <span className="text-xs font-bold text-ink4 uppercase tracking-wider">{activeSection}</span>
                            <Badge className="bg-gold-bg text-gold border-0 text-xs ml-auto">AI Preview</Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 font-serif text-[1rem] leading-[1.9] text-ink">
                        <div className="max-w-3xl">
                            {SAMPLE_TEXT.split("\n\n").map((para, i) => (
                                <p key={i} className="mb-6 text-justify">{para}</p>
                            ))}
                            <div className="flex items-center gap-2 mt-4 opacity-40">
                                <div className="w-1 h-5 bg-accent animate-pulse rounded-full" />
                                <span className="text-xs text-ink3 italic">AI continues writing here...</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-ink4">{SAMPLE_TEXT.split(" ").length} words • {selectedPapers.length} citations</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-lg text-xs border-border" onClick={() => toast.info("Export as DOCX/LaTeX coming in Phase 2")}>Export LaTeX</Button>
                            <Button size="sm" className="rounded-lg text-xs bg-accent text-white" onClick={() => toast.info("Copy to clipboard works in Phase 2")}>Copy Section</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-accent-light border border-accent/10 rounded-xl p-4 flex gap-3">
                <Info size={15} className="text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-accent-text">AI will generate cited sections using your project papers as grounding context, ensuring every claim is traceable to a source.</p>
            </div>
        </div>
    )
}
