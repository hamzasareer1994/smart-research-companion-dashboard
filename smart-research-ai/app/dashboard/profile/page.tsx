"use client"

import { useUserStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Shield, Calendar } from "lucide-react"

export default function ProfilePage() {
    const { user } = useUserStore()

    const initials = user?.email
        ? user.email.substring(0, 2).toUpperCase()
        : "SC"

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                <p className="text-muted-foreground">
                    View and manage your personal information.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-1">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="" alt={user?.full_name || "User"} />
                            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">
                                {user?.full_name || user?.email?.split('@')[0] || "User"}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <Badge variant="secondary" className="capitalize">
                                    {user?.tier || "Student"} Plan
                                </Badge>
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{user?.email || "guest@example.com"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">{user?.tier || "Student"} Tier</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Joined recently</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>About Me</CardTitle>
                        <CardDescription>
                            Your professional bio and research interests.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground italic">
                            "No biography provided yet. You can add one in Settings."
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button variant="outline" asChild>
                    <a href="/dashboard/settings">Edit Profile</a>
                </Button>
            </div>
        </div>
    )
}
