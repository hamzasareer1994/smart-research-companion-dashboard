"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/lib/store"
import { userService } from "@/services/user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Shield, CreditCard, Calendar } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const { user, updateCredits } = useUserStore()
    const [profileData, setProfileData] = useState<any>(null)

    useEffect(() => {
        if (!user?.access_token) return
        const fetch = async () => {
            try {
                const data = await userService.getMe(user.access_token)
                setProfileData(data)
                if (data.credit_balance_cents !== undefined) {
                    updateCredits(data.credit_balance_cents)
                }
            } catch (e) {
                console.error("Failed to load profile", e)
            }
        }
        fetch()
    }, [user?.access_token, updateCredits])

    const initials = user?.email
        ? user.email.substring(0, 2).toUpperCase()
        : "SC"

    const tier = profileData?.tier || user?.tier || "payg"
    const balanceCents = user?.credit_balance_cents ?? 0
    const balanceDollars = (balanceCents / 100).toFixed(2)
    const joinedDate = profileData?.created_at
        ? new Date(profileData.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "Recently"

    return (
        <div className="p-6 md:p-10 space-y-8 animate-fade-up">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                <p className="text-muted-foreground">View and manage your account information.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="text-2xl bg-accent-light text-accent-text">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">
                                {user?.full_name || user?.email?.split("@")[0] || "Researcher"}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                <Badge variant="secondary" className="capitalize">
                                    {tier === "pro" ? "Pro Plan" : "Pay As You Go"}
                                </Badge>
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span>{tier === "pro" ? "Pro — Unlimited access" : "Pay As You Go"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {tier === "pro"
                                    ? "Unlimited credits"
                                    : `$${balanceDollars} credit balance`}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Joined {joinedDate}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>Manage your plan and settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {tier !== "pro" && (
                            <div className="rounded-lg bg-accent-light border border-accent/20 p-4 space-y-2">
                                <p className="text-sm font-medium text-accent-text">Upgrade to Pro</p>
                                <p className="text-xs text-ink3">Get unlimited access + 7 exclusive AI features for $35/month.</p>
                                <Button className="w-full bg-accent text-white hover:opacity-90 rounded-lg" asChild>
                                    <Link href="/dashboard/billing">Upgrade Now</Link>
                                </Button>
                            </div>
                        )}
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/settings">Edit Profile</Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/logs">View Activity Logs</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
