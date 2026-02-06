"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    Plus,
    Search,
    FileText,
    MoreVertical,
    Grid,
    List as ListIcon,
    Calendar
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";

interface Project {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export function ProjectsList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        fetch(`${API_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Manage your research workspaces and papers.</p>
                </div>
                <Link href="/dashboard?view=projects_new">
                    <Button className="btn-primary hover-lift">
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-10 h-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 border bg-muted/50 p-1 rounded-lg">
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setViewMode("grid")}
                    >
                        <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setViewMode("list")}
                    >
                        <ListIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : filteredProjects.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <ProjectGridItem key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="border rounded-xl divide-y overflow-hidden">
                        {filteredProjects.map((project) => (
                            <ProjectListItem key={project.id} project={project} />
                        ))}
                    </div>
                )
            ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold">No projects found</h3>
                    <p className="text-muted-foreground mb-6 max-w-xs">
                        {searchQuery ? `No projects matching "${searchQuery}"` : "Create your first project to organize your research papers."}
                    </p>
                    <Link href="/dashboard/projects/new">
                        <Button variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Create your first project
                        </Button>
                    </Link>
                </Card>
            )}
        </div>
    );
}

function ProjectGridItem({ project }: { project: Project }) {
    const date = new Date(project.created_at).toLocaleDateString();

    return (
        <Card className="group hover-lift transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">Edit Project</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-600">Delete Project</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex-1">
                    <Link href={`/dashboard/project/${project.id}`}>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                            {project.name}
                        </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {project.description || "No description provided for this work space."}
                    </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {date}
                    </div>
                    <Link href={`/dashboard/project/${project.id}`} className="text-xs font-semibold hover:underline">
                        Open Project
                    </Link>
                </div>
            </div>
        </Card>
    );
}

function ProjectListItem({ project }: { project: Project }) {
    const date = new Date(project.created_at).toLocaleDateString();

    return (
        <div className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <Link href={`/dashboard/project/${project.id}`}>
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {project.name}
                    </h3>
                </Link>
                <p className="text-xs text-muted-foreground truncate max-w-md">
                    {project.description || "No description provided"}
                </p>
            </div>
            <div className="hidden md:flex flex-col items-end text-xs text-muted-foreground pr-4">
                <span className="font-medium">Created</span>
                <span>{date}</span>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
