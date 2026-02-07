"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search as SearchIcon, Filter } from "lucide-react"

export default function SearchPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Search</h2>
                    <p className="text-muted-foreground">
                        Find papers, projects, and insights.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search for research papers, authors, or topics..." className="pl-9" />
                        </div>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                        <Button>Search</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent / Results Placeholder */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recent Searches</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="text-base">Quantum Computing Advances {i}</CardTitle>
                                <CardDescription>Last searched 2 days ago</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
