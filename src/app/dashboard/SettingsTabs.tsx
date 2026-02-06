"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CreditCard,
    Lock,
    Shield
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsTabs() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your account, preferences, and security.</p>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-8">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <Card className="divide-y border-border/50 overflow-hidden">
                        <div className="p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-xl border-4 border-background">
                                    H
                                </div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <h3 className="font-bold text-xl">Hamza Researcher</h3>
                                    <p className="text-sm text-muted-foreground">PhD Candidate @ University</p>
                                    <Button variant="outline" size="sm" className="mt-2 text-xs h-8">Change Avatar</Button>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Full Name</label>
                                    <Input defaultValue="Hamza Researcher" className="h-11" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Email Address</label>
                                    <Input defaultValue="hamza@university.edu" className="h-11" />
                                </div>
                            </div>
                        </div>
                        <div className="p-8 flex justify-end">
                            <Button className="btn-primary hover-lift">Save Profile Changes</Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <div className="space-y-6">
                        <Card className="p-8 border-border/50 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600"><Lock className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="font-bold">Password Management</h3>
                                    <p className="text-sm text-muted-foreground">Keep your account secure with a strong password.</p>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t">
                                <Button variant="outline">Update Password</Button>
                            </div>
                        </Card>

                        <Card className="p-8 border-border/50 space-y-6 glass">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary"><Shield className="w-6 h-6" /></div>
                                <div>
                                    <h3 className="font-bold">Two-Factor Authentication</h3>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-border/50">
                                <Button className="btn-primary hover-lift">Enable 2FA</Button>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="billing">
                    <Card className="p-12 text-center border-border/50 glass">
                        <CreditCard className="w-16 h-16 mx-auto mb-6 text-primary opacity-20" />
                        <h3 className="text-xl font-bold mb-2">No active subscription</h3>
                        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                            Upgrade to Academic Pro to unlock unlimited PDF processing and knowledge graph generation.
                        </p>
                        <Button className="btn-primary px-12 h-12 rounded-full font-bold hover-lift">
                            View Pricing Plans
                        </Button>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
