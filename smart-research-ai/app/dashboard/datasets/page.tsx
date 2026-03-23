"use client"

import { useState } from "react"
import { Database, Search, ExternalLink, Download, Filter, Sparkles, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const MOCK_DATASETS = [
    { name: "ImageNet-1K", source: "HuggingFace", size: "150 GB", format: "JPEG / tar", license: "Custom (Non-Commercial)", tasks: ["Image Classification", "Transfer Learning"], stars: 4800, url: "#" },
    { name: "MS COCO 2017", source: "Kaggle", size: "25 GB", format: "JPEG + JSON", license: "CC BY 4.0", tasks: ["Object Detection", "Segmentation"], stars: 3200, url: "#" },
    { name: "SQuAD 2.0", source: "HuggingFace", size: "35 MB", format: "JSON", license: "CC BY-SA 4.0", tasks: ["Question Answering", "NLP Benchmark"], stars: 5100, url: "#" },
    { name: "OpenWebText", source: "HuggingFace", size: "40 GB", format: "txt", license: "MIT", tasks: ["Language Modeling", "Pre-training"], stars: 2900, url: "#" },
    { name: "MIMIC-III Clinical", source: "PhysioNet", size: "6.7 GB", format: "CSV", license: "DUA (Restricted)", tasks: ["Clinical NLP", "EHR Analysis"], stars: 1800, url: "#" },
    { name: "Common Crawl 2024", source: "Zenodo", size: "2.7 TB", format: "WARC / WET", license: "Open Access", tasks: ["Web NLP", "Large-scale Training"], stars: 6200, url: "#" },
]

const SOURCES = ["HuggingFace", "Kaggle", "Zenodo", "Figshare", "PhysioNet"]

export default function DatasetsPage() {
    const [query, setQuery] = useState("")
    const [activeSources, setActiveSources] = useState(["HuggingFace", "Kaggle", "Zenodo"])
    const [saved, setSaved] = useState<string[]>([])

    const filtered = MOCK_DATASETS.filter(d => activeSources.includes(d.source))

    const toggleSource = (s: string) => setActiveSources(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-up">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-serif text-ink">Dataset <em className="italic">Discovery</em></h1>
                    <Badge variant="outline" className="text-gold border-gold/40 text-xs">10¢ per search</Badge>
                </div>
                <p className="text-ink3 text-sm max-w-xl">Search across Kaggle, HuggingFace, Zenodo, Figshare, and more. Returns dataset metadata, size, license, and direct download links.</p>
            </div>

            {/* Search */}
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4" size={16} />
                        <Input placeholder="Search for datasets (e.g. 'medical image segmentation', 'NLP question answering')..." value={query} onChange={e => setQuery(e.target.value)} className="pl-10 h-11 bg-bg2 border-border rounded-xl" />
                    </div>
                    <Button className="h-11 px-6 rounded-xl bg-accent text-white font-bold gap-2 shadow-lg shadow-accent/20"
                        onClick={() => toast.info("Live dataset search coming in Phase 2 — preview results shown below")}>
                        <Sparkles size={16} /> Discover
                    </Button>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border">
                    <span className="text-xs font-bold text-ink4 uppercase tracking-wider">Sources:</span>
                    {SOURCES.map(s => (
                        <div key={s} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSource(s)}>
                            <Checkbox checked={activeSources.includes(s)} />
                            <span className="text-sm text-ink2">{s}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-ink4 uppercase tracking-wider">{filtered.length} datasets found (preview)</h3>
                    <Badge className="bg-gold-bg text-gold border-0 text-xs">Preview Data</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((d, i) => (
                        <div key={i} className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-accent/20 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-ink">{d.name}</h4>
                                        {saved.includes(d.name) && <CheckCircle size={14} className="text-teal" />}
                                    </div>
                                    <Badge variant="outline" className="mt-1 text-xs text-ink4 border-border">{d.source}</Badge>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-ink3">{d.size}</div>
                                    <div className="text-xs text-ink4">{d.format}</div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {d.tasks.map(t => <Badge key={t} className="bg-accent-light text-accent border-0 text-xs">{t}</Badge>)}
                            </div>
                            <div className="text-xs text-ink4 mb-3 flex items-center gap-1">
                                <span className="font-bold">License:</span> {d.license}
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="rounded-lg border-border flex-1 gap-1.5 text-xs"
                                    onClick={() => { setSaved(s => s.includes(d.name) ? s.filter(x => x !== d.name) : [...s, d.name]); toast.success(saved.includes(d.name) ? "Removed from saved" : "Saved to project"); }}>
                                    {saved.includes(d.name) ? "Saved ✓" : "Save to Project"}
                                </Button>
                                <Button size="sm" className="rounded-lg bg-accent text-white gap-1.5 text-xs"
                                    onClick={() => toast.info("Direct download links available after Phase 2 launch")}>
                                    <Download size={12} /> Download
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-accent-light border border-accent/10 rounded-xl p-4 flex gap-3">
                <Info size={15} className="text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-accent-text">Live search will query real-time APIs from HuggingFace, Kaggle, Zenodo, Figshare, and Google Datasets simultaneously.</p>
            </div>
        </div>
    )
}
