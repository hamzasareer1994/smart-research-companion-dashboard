"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Rocket, LayoutDashboard, Globe } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";

export function NewProjectForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) {
                throw new Error("Failed to create project");
            }

            const data = await response.json();
            router.push(`/dashboard/project/${data.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard?view=projects">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create New Project</h1>
                    <p className="text-muted-foreground">Set up a new workspace for your research phase.</p>
                </div>
            </div>

            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Project Name
                            </label>
                            <Input
                                placeholder="e.g., Quantum Computing Research"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12"
                                required
                            />
                            <p className="text-xs text-muted-foreground">Keep it descriptive and concise.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Description (Optional)
                            </label>
                            <Textarea
                                placeholder="Briefly describe what this project is about..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[120px] resize-none pb-8"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-dashed border-border flex flex-col items-center text-center gap-2 hover:border-primary/50 transition-colors group cursor-pointer">
                            <LayoutDashboard className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                            <div className="text-sm font-semibold">Standard Workspace</div>
                            <div className="text-xs text-muted-foreground">Clean slate for your organization.</div>
                        </div>
                        <div className="p-4 rounded-xl border border-dashed border-border flex flex-col items-center text-center gap-2 opacity-50 cursor-not-allowed bg-muted/20">
                            <Globe className="w-8 h-8 text-purple-500" />
                            <div className="text-sm font-semibold">Shared Project</div>
                            <div className="text-xs text-muted-foreground text-purple-600 font-medium">Coming Soon</div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t mt-8">
                        <Link href="/dashboard/projects">
                            <Button variant="ghost" type="button">Cancel</Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={loading || !name}
                            className="btn-primary min-w-[140px] hover-lift"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-4 h-4 mr-2" />
                                    Start Project
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
