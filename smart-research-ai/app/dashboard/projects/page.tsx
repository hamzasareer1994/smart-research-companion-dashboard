"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MoreHorizontal, Folder } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ProjectsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">
                        Manage your research workspaces.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-semibold">
                                <div className="flex items-center gap-2">
                                    <Folder className="h-5 w-5 text-primary" />
                                    Research Project {i}
                                </div>
                            </CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="line-clamp-2">
                                Analysis of recent trends in machine learning and their impact on software engineering practices.
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="mt-auto text-sm text-muted-foreground">
                            Updated 2 hours ago
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
