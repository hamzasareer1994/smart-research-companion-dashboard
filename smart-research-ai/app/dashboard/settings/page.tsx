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

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
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
                                This is how others will see you on the site.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue="Hamza Zakir" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="bio">Bio</Label>
                                <Input id="bio" placeholder="Researcher at IMSciences" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>
                                Make changes to your account here. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue="humxazakir@gmail.com" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="current">Current Password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">New Password</Label>
                                <Input id="new" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save password</Button>
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
                                <Switch id="dark-mode" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
