"use client";

import { useSearchParams } from "next/navigation";
import { ProjectsList } from "./ProjectsList";
import { NewProjectForm } from "./NewProjectForm";
import { RecentActivity } from "./RecentActivity";
import { UploadZone } from "./UploadZone";
import { ChatInterface } from "./ChatInterface";
import { SettingsTabs } from "./SettingsTabs";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Suspense } from "react";

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardContent() {
    const searchParams = useSearchParams();
    const view = searchParams.get("view") || "overview";

    return (
        <div className="space-y-8">
            {renderView(view)}
        </div>
    );
}

function renderView(view: string) {
    switch (view) {
        case "overview":
            return <DashboardOverview />;
        case "projects":
            return <ProjectsList />;
        case "projects_new":
            return <NewProjectForm />;
        case "recent":
            return <RecentActivity />;
        case "upload":
            return <UploadZone />;
        case "chat":
            return <ChatInterface />;
        case "settings":
            return <SettingsTabs />;
        default:
            return <DashboardOverview />;
    }
}

function DashboardOverview() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, Researcher</h1>
                <p className="text-muted-foreground">Here is what is happening with your research projects today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Papers" value="12" change="+2 this week" />
                <StatCard title="AI Analysis" value="48" change="+12 this week" />
                <StatCard title="Projects" value="4" change="0 this week" />
                <StatCard title="Credits Left" value="840" change="of 1,000" />
            </div>

            <Card className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden relative border-none shadow-2xl overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" />
                            New Feature
                        </div>
                        <h2 className="text-3xl font-bold">Try the Knowledge Graph</h2>
                        <p className="text-blue-100/90 text-lg">
                            Visualize connections between your uploaded papers using our new semantic mapping engine.
                        </p>
                        <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 h-12 rounded-xl group-hover:scale-105 transition-transform">
                            Explore Graph
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                    <div className="hidden md:block opacity-20 group-hover:opacity-30 transition-opacity">
                        <Sparkles className="w-64 h-64" />
                    </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
            </Card>
        </div>
    );
}

function StatCard({ title, value, change }: { title: string, value: string, change: string }) {
    return (
        <Card className="p-6 hover:shadow-md transition-all border-border/50 bg-card/50 backdrop-blur-sm">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">{change}</p>
        </Card>
    );
}
