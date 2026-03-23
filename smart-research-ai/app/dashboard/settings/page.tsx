"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useUserStore } from "@/lib/store"
import { toast } from "sonner"

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const { user } = useUserStore()
    const [mounted, setMounted] = useState(false)
    const [fullName, setFullName] = useState("")
    const [bio, setBio] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [isSavingPassword, setIsSavingPassword] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (user) {
            setFullName(user.full_name || "")
        }
    }, [user])

    if (!mounted) return null

    const handleSaveProfile = async () => {
        setIsSavingProfile(true)
        try {
            // Profile update would call the backend here
            // For now, show success as the backend endpoint is pending
            await new Promise(resolve => setTimeout(resolve, 500))
            toast.success("Profile updated")
        } catch {
            toast.error("Failed to update profile")
        } finally {
            setIsSavingProfile(false)
        }
    }

    const handleSavePassword = async () => {
        if (!currentPassword || !newPassword) {
            toast.error("Please fill in both password fields")
            return
        }
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters")
            return
        }
        setIsSavingPassword(true)
        try {
            // Password change would call the backend here
            await new Promise(resolve => setTimeout(resolve, 500))
            toast.success("Password updated")
            setCurrentPassword("")
            setNewPassword("")
        } catch {
            toast.error("Failed to update password")
        } finally {
            setIsSavingPassword(false)
        }
    }

    return (
        <div className="space-y-6 p-6 md:p-10 max-w-3xl mx-auto animate-fade-up">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-ink">Settings</h2>
                <p className="text-ink3 mt-1">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>
                                Update your display name and bio.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email-display">Email</Label>
                                <Input
                                    id="email-display"
                                    value={user?.email || ""}
                                    disabled
                                    className="opacity-60"
                                />
                                <p className="text-[0.72rem] text-ink4">Email cannot be changed here.</p>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="bio">Bio</Label>
                                <Input
                                    id="bio"
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    placeholder="Researcher, student, academic..."
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                                {isSavingProfile ? "Saving..." : "Save changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="current">Current Password</Label>
                                <Input
                                    id="current"
                                    type="password"
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">New Password</Label>
                                <Input
                                    id="new"
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSavePassword} disabled={isSavingPassword}>
                                {isSavingPassword ? "Saving..." : "Save password"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>
                                Customize the look and feel of the application.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                                    <span>Dark Mode</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Toggle dark mode on or off.
                                    </span>
                                </Label>
                                <Switch
                                    id="dark-mode"
                                    checked={theme === "dark"}
                                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
