import Link from "next/link"

export function Footer() {
    return (
        <footer className="px-[5%] py-12 bg-paper-mid border-t border-paper-border">
            <div className="flex flex-wrap justify-between items-start gap-8">
                <div className="max-w-[260px]">
                    <Link href="/" className="flex items-center gap-2 text-xl tracking-tight text-accent no-underline font-serif mb-3">
                        <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                        Research<em className="italic">AI</em>
                    </Link>
                    <p className="text-[0.8rem] text-ink-faint leading-[1.65]">
                        The AI research assistant designed for elite academics. Built in collaboration with PhD researchers.
                    </p>
                </div>

                <div className="flex gap-12 text-ink">
                    <div className="flex flex-col gap-2">
                        <h4 className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-ink-faint mb-2">Product</h4>
                        <Link href="#features" className="text-[0.85rem] text-ink-muted no-underline hover:text-ink">Features</Link>
                        <Link href="#pipeline" className="text-[0.85rem] text-ink-muted no-underline hover:text-ink">How it works</Link>
                        <Link href="#pricing" className="text-[0.85rem] text-ink-muted no-underline hover:text-ink">Pricing</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-ink-faint mb-2">Legal</h4>
                        <Link href="#" className="text-[0.85rem] text-ink-muted no-underline hover:text-ink">Privacy</Link>
                        <Link href="#" className="text-[0.85rem] text-ink-muted no-underline hover:text-ink">Terms</Link>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-12 pt-6 border-t border-paper-border text-[0.75rem] text-ink-faint">
                <p>© {new Date().getFullYear()} ResearchAI. Built for academics.</p>
                <div className="flex gap-4">
                    <Link href="#" className="hover:text-ink">Twitter</Link>
                    <Link href="#" className="hover:text-ink">LinkedIn</Link>
                    <Link href="#" className="hover:text-ink">GitHub</Link>
                </div>
            </div>
        </footer>
    )
}
