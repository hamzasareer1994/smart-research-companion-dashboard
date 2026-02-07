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
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
    {
        title: "Student",
        price: "$0",
        description: "Essential tools for coursework.",
        features: [
            "128K Credits/mo",
            "1 Project (10 PDFs)",
            "100 Papers Search/mo",
            "Basic Chat",
        ],
        cta: "Get Started",
        variant: "outline",
    },
    {
        title: "Professor",
        price: "$12",
        description: "For serious academic work.",
        features: [
            "512K Credits/mo",
            "5 Projects (10 PDFs each)",
            "500 Papers Search/mo",
            "Citation Manager",
            "Priority Support",
        ],
        cta: "Upgrade to Pro",
        variant: "default", // Highlighted
        popular: true,
    },
    {
        title: "Researcher",
        price: "$30",
        description: "Unlimited power for labs.",
        features: [
            "2M Credits/mo",
            "Unlimited Projects",
            "Unlimited Search",
            "API Access",
            "Team Collaboration",
        ],
        cta: "Contact Sales",
        variant: "outline",
    },
]

export function PricingSection() {
    return (
        <section id="pricing" className="container py-24 space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <Badge variant="outline" className="rounded-full">Simple Pricing</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Invest in Your Intelligence
                </h2>
                <p className="text-muted-foreground text-lg">
                    Choose the plan that fits your research needs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card
                        key={plan.title}
                        className={`flex flex-col relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
                    >
                        {plan.popular && (
                            <div className="absolute left-0 right-0 flex justify-center">
                                <Badge className="bg-primary hover:bg-primary">Most Popular</Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.title}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-4xl font-bold mb-6">
                                {plan.price}
                                <span className="text-base font-normal text-muted-foreground">/month</span>
                            </div>
                            <ul className="space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                                        <Check className="mr-2 h-4 w-4 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant={plan.variant as "default" | "outline" | "secondary" | "ghost" | "link" | null | undefined}
                                className="w-full"
                            >
                                {plan.cta}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    )
}
