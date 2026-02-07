"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const logs = [
    {
        id: "LOG-1234",
        action: "Uploaded Document",
        details: "research_paper_v1.pdf",
        status: "Success",
        date: "2024-02-07 10:23 AM",
    },
    {
        id: "LOG-1235",
        action: "Created Project",
        details: "AI in Healthcare",
        status: "Success",
        date: "2024-02-06 04:15 PM",
    },
    {
        id: "LOG-1236",
        action: "Exported Chat",
        details: "Conversation #42",
        status: "Pending",
        date: "2024-02-06 02:00 PM",
    },
    {
        id: "LOG-1237",
        action: "Login",
        details: "User login via Email",
        status: "Success",
        date: "2024-02-06 09:00 AM",
    },
]

export default function LogsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
                <p className="text-muted-foreground">
                    View recent system activity and user actions.
                </p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="font-medium">{log.id}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.details}</TableCell>
                                <TableCell>
                                    <Badge variant={log.status === "Success" ? "default" : "secondary"}>
                                        {log.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{log.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
