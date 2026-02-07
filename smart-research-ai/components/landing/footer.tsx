import Link from "next/link"
import { FlaskConical, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <FlaskConical className="h-6 w-6" />
                            <span className="font-bold">Smart Research</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Empowering the next generation of researchers with AI-driven insights.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/#features" className="hover:text-foreground">Features</Link></li>
                            <li><Link href="/#pricing" className="hover:text-foreground">Pricing</Link></li>
                            <li><Link href="/changelog" className="hover:text-foreground">Changelog</Link></li>
                            <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
                            <li><Link href="/cookies" className="hover:text-foreground">Cookie Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-foreground">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Smart Research Companion. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
