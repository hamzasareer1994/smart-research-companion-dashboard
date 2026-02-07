"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"

export default function ChatPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between pb-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Chat Assistant</h2>
                    <p className="text-sm text-muted-foreground">
                        Ask questions about your research.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Clear History</Button>
                    <Button variant="outline" size="sm">Export Chat</Button>
                </div>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {/* Bot Message */}
                    <div className="flex gap-3">
                        <Avatar className="h-8 w-8 border">
                            <AvatarImage src="/bot.png" />
                            <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-lg max-w-[80%] text-sm">
                            Hello! I'm your research assistant. How can I help you today?
                        </div>
                    </div>

                    {/* User Message */}
                    <div className="flex gap-3 flex-row-reverse">
                        <Avatar className="h-8 w-8 border">
                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] text-sm">
                            Can you summarize the findings of the latest paper I uploaded?
                        </div>
                    </div>

                    {/* Bot Message */}
                    <div className="flex gap-3">
                        <Avatar className="h-8 w-8 border">
                            <AvatarImage src="/bot.png" />
                            <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-lg max-w-[80%] text-sm">
                            Certainly. The paper "Deep Learning in 2024" discusses...
                        </div>
                    </div>
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="pt-4 border-t">
                <div className="flex gap-2">
                    <Input placeholder="Type your message..." className="flex-1" />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
