"use client"

export function FeaturesStrip() {
    const features = [
        "PDF Analysis & Processing",
        "Semantic Vector Search",
        "RAG-Powered Chat",
        "Literature Mapping",
        "Contradiction Finder",
        "SLR Automation",
        "Hypothesis Generator",
        "Grant Proposal Writer",
        "Peer Review Simulator"
    ];

    return (
        <div className="bg-accent py-4 overflow-hidden relative">
            <div className="flex gap-12 items-center whitespace-nowrap animate-scroll-left w-max pr-12">
                {[...features, ...features].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-[0.8rem] font-medium text-white/70 flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4" fill="white" fillOpacity="0.5"/></svg>
                        {feature}
                    </div>
                ))}
            </div>
        </div>
    )
}
