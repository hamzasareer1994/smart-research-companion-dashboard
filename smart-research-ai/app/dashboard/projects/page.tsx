"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MoreHorizontal, Folder, Loader2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { projectService, ProjectResponse } from "@/services/project"
import { useUserStore, UserTier } from "@/lib/store"
import { UpgradeModal } from "@/components/upgrade-modal"
import { PaperDeleteModal } from "@/components/projects/paper-delete-modal"
import { toast } from "sonner"
import Link from "next/link"

const TIER_LIMITS: Record<UserTier, number> = {
    student: 1,
    professor: 5,
    researcher: 99999, // Essentially unlimited
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<ProjectResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newProjectName, setNewProjectName] = useState("")
    const [newProjectDesc, setNewProjectDesc] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
    const [isDeletePapersModalOpen, setIsDeletePapersModalOpen] = useState(false)
    const [selectedProjectForDelete, setSelectedProjectForDelete] = useState<ProjectResponse | null>(null)

    const { user } = useUserStore()
    const userTier = user?.tier || "student"
    const limit = TIER_LIMITS[userTier]
    const currentCount = projects.length
    const isAtLimit = currentCount >= limit

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setIsLoading(true)
        try {
            const data = await projectService.getProjects()
            console.log("Fetched projects:", data)
            console.log("Projects length:", data.length)
            console.log("Projects type:", typeof data, Array.isArray(data))
            setProjects(data)
        } catch (error: any) {
            console.error("Error fetching projects:", error)
            toast.error(error.message || "Failed to load projects")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return

        setIsCreating(true)
        try {
            await projectService.createProject({
                name: newProjectName,
                description: newProjectDesc
            })
            toast.success("Project created successfully")
            setIsCreateDialogOpen(false)
            setNewProjectName("")
            setNewProjectDesc("")
            fetchProjects()
        } catch (error: any) {
            toast.error(error.message || "Failed to create project")
        } finally {
            setIsCreating(false)
        }
    }

    const handleDeleteProject = async (id: string) => {
        try {
            await projectService.deleteProject(id)
            toast.success("Project deleted")
            setProjects(projects.filter(p => p.id !== id))
        } catch (error: any) {
            toast.error(error.message || "Delete failed")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                        <Badge variant="outline" className="h-6">
                            {currentCount} / {userTier === 'researcher' ? '∞' : limit} Used
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Manage your research workspaces and organized papers.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={() => {
                            if (isAtLimit) {
                                setIsUpgradeModalOpen(true)
                            } else {
                                setIsCreateDialogOpen(true)
                            }
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                    </Button>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Project</DialogTitle>
                            <DialogDescription>
                                Start a new workspace for your research topic.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Project Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Quantum Material Analysis"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Input
                                    id="description"
                                    placeholder="Brief summary of the research goal"
                                    value={newProjectDesc}
                                    onChange={(e) => setNewProjectDesc(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateProject} disabled={isCreating || !newProjectName}>
                                {isCreating ? "Creating..." : "Create Project"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : projects.length === 0 ? (
                <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
                    <Folder className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <CardTitle>No projects yet</CardTitle>
                    <CardDescription className="mt-2 max-w-[300px]">
                        Create your first project to start organizing papers and generating insights.
                    </CardDescription>
                    <Button
                        variant="outline"
                        className="mt-6"
                        onClick={() => {
                            if (isAtLimit) {
                                setIsUpgradeModalOpen(true)
                            } else {
                                setIsCreateDialogOpen(true)
                            }
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id} className="flex flex-col group hover:border-primary/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-semibold">
                                    <Link href={`/dashboard/projects/${project.id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                        <Folder className="h-5 w-5 text-primary" />
                                        {project.name}
                                    </Link>
                                </CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard/projects/${project.id}`} className="cursor-pointer">
                                                View Workspace
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setSelectedProjectForDelete(project)
                                                setIsDeletePapersModalOpen(true)
                                            }}
                                        >
                                            Delete Papers
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
                                                    handleDeleteProject(project.id)
                                                }
                                            }}
                                        >
                                            Delete Project
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <CardDescription className="line-clamp-2">
                                    {project.description || "No description provided."}
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
                                <span>{project.paper_count} Papers</span>
                                <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {isAtLimit && (
                <div className="bg-primary/5 rounded-lg p-5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <p className="font-semibold">Project Limit Reached</p>
                        <p className="text-sm text-muted-foreground">You've used all {limit} project slots on the <span className="capitalize">{userTier}</span> plan.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsUpgradeModalOpen(true)}>
                        Upgrade to {userTier === 'student' ? 'Professor' : 'Researcher'}
                    </Button>
                </div>
            )}

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onOpenChange={setIsUpgradeModalOpen}
                title="Unlock More Projects"
                description={`The ${userTier} plan is limited to ${limit} projects. Upgrade to create more workspaces and organize your research better.`}
                requiredTier={userTier === 'student' ? 'professor' : 'researcher'}
                feature="unlimited project workspaces"
            />

            <PaperDeleteModal
                isOpen={isDeletePapersModalOpen}
                onOpenChange={setIsDeletePapersModalOpen}
                papers={selectedProjectForDelete?.papers || []}
                projectId={selectedProjectForDelete?.id || ""}
                onDeleteComplete={() => {
                    fetchProjects()
                }}
            />
        </div>
    )
}
