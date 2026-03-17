"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loginSchema, LoginValues } from "@/lib/schema"

import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import Cookies from "js-cookie"
import { authService } from "@/services/auth"

import { useUserStore, User, UserTier } from "@/lib/store"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const setUser = useUserStore((state) => state.setUser)

    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: LoginValues) {
        setIsLoading(true)
        try {
            const response = await authService.login(data)

            // Set cookie for middleware
            Cookies.set("auth-token", response.access_token, { 
                expires: 7, // 7 days
                path: "/",
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production"
            })

            // Initialize Store
            const user: User = {
                id: response.user_id,
                email: response.email,
                tier: response.tier as UserTier,
                credits: response.credits,
                access_token: response.access_token
            }
            setUser(user)

            toast.success("Login successful", {
                description: `Welcome back, ${response.email.split('@')[0]}!`,
            })
            router.push(callbackUrl)
        } catch (error) {
            toast.error("Login failed", {
                description: error instanceof Error ? error.message : "Something went wrong",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Sign in</CardTitle>
                <CardDescription>
                    Enter your email and password to access your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </form>
                </Form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
