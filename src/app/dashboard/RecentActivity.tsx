"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Clock,
    FileText,
    MessageSquare,
    Search as SearchIcon,
    ArrowRight,
    Search
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

// Mock data for UI/UX
const MOCK_ACTIVITY = [
    {
        id: "1",
        type: "upload",
        title: "Deep Learning Foundations.pdf",
        timestamp: "2 hours ago",
        project: "Machine Learning Concepts"
    },
    {
        id: "2",
        type: "chat",
        title: "Briefing document for Quantum Erasing",
        timestamp: "5 hours ago",
        project: "Physics Paper Review"
    },
    {
        id: "3",
        type: "search",
        title: "Recent advances in NLP transformers",
        timestamp: "Yesterday",
        project: "NLP Master Thesis"
    }
];

export function RecentActivity() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Recent Activity</h1>
                <p className="text-muted-foreground">Keep track of your latest research steps and discussions.</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search activity logs..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {MOCK_ACTIVITY.map((activity) => (
                    <Card key={activity.id} className="p-4 bg-card/40 hover-lift backdrop-blur-sm transition-all group">
                        <div className="flex items-center gap-4">
                            <ActivityIcon type={activity.type} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                                        {activity.title}
                                    </h3>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {activity.timestamp}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                                        {activity.project}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center">
                                        <ActivityTypeText type={activity.type} />
                                    </span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-4 h-4 text-primary" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="pt-8 text-center border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-4">You've reached the end of your recent activity.</p>
                <Link href="/dashboard">
                    <Button variant="outline">Back to Dashboard Home</Button>
                </Link>
            </div>
        </div>
    );
}

function ActivityIcon({ type }: { type: string }) {
    switch (type) {
        case "upload": return <div className="p-2 rounded-lg bg-primary/10 text-primary"><FileText className="w-5 h-5" /></div>;
        case "chat": return <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"><MessageSquare className="w-5 h-5" /></div>;
        case "search": return <div className="p-2 rounded-lg bg-accent/20 text-accent-foreground border border-accent/20"><SearchIcon className="w-5 h-5" /></div>;
        default: return <div className="p-2 rounded-lg bg-muted text-muted-foreground"><Clock className="w-5 h-5" /></div>;
    }
}

function ActivityTypeText({ type }: { type: string }) {
    switch (type) {
        case "upload": return "Uploaded file";
        case "chat": return "Generated AI briefing";
        case "search": return "Research search";
        default: return "Activity";
    }
}
