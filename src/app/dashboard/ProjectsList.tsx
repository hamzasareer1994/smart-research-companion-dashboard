"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import {
    Box,
    Button,
    Card,
    Flex,
    Grid,
    Heading,
    Text,
    TextField,
    DropdownMenu,
    IconButton,
    SegmentedControl,
    Spinner,
    Link
} from "@radix-ui/themes";
import {
    PlusIcon,
    MagnifyingGlassIcon,
    FileTextIcon,
    DotsVerticalIcon,
    GridIcon,
    RowsIcon,
    CalendarIcon
} from "@radix-ui/react-icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";

interface Project {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export function ProjectsList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        fetch(`${API_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setProjects(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Flex direction="column" gap="6">
            <Flex direction={{ initial: "column", sm: "row" }} justify="between" align={{ initial: "start", sm: "center" }} gap="4">
                <Box>
                    <Heading size="6" weight="bold">Projects</Heading>
                    <Text color="gray" size="2">Manage your research workspaces and papers.</Text>
                </Box>
                <NextLink href="/dashboard?view=projects_new" passHref legacyBehavior>
                    <Button size="3" asChild style={{ cursor: 'pointer' }}>
                        <Link style={{ textDecoration: 'none', color: 'inherit' }}>
                            <PlusIcon /> New Project
                        </Link>
                    </Button>
                </NextLink>
            </Flex>

            <Flex direction={{ initial: "column", sm: "row" }} align="center" gap="4">
                <Box style={{ flexGrow: 1 }} width="100%">
                    <TextField.Root
                        placeholder="Search projects..."
                        size="3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    >
                        <TextField.Slot>
                            <MagnifyingGlassIcon />
                        </TextField.Slot>
                    </TextField.Root>
                </Box>
                <SegmentedControl.Root size="3" value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                    <SegmentedControl.Item value="grid">
                        <GridIcon />
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="list">
                        <RowsIcon />
                    </SegmentedControl.Item>
                </SegmentedControl.Root>
            </Flex>

            {loading ? (
                <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} size="3" style={{ height: "160px" }}>
                            <Flex align="center" justify="center" height="100%">
                                <Spinner />
                            </Flex>
                        </Card>
                    ))}
                </Grid>
            ) : filteredProjects.length > 0 ? (
                viewMode === "grid" ? (
                    <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="6">
                        {filteredProjects.map((project) => (
                            <ProjectGridItem key={project.id} project={project} />
                        ))}
                    </Grid>
                ) : (
                    <Box style={{ border: "1px solid var(--gray-5)", borderRadius: "var(--radius-3)", overflow: "hidden" }}>
                        {filteredProjects.map((project, i) => (
                            <ProjectListItem key={project.id} project={project} isLast={i === filteredProjects.length - 1} />
                        ))}
                    </Box>
                )
            ) : (
                <Card size="4">
                    <Flex direction="column" align="center" justify="center" p="9" gap="4">
                        <IconButton size="4" variant="soft" radius="full">
                            <FileTextIcon width="32" height="32" />
                        </IconButton>
                        <Heading size="4" align="center">No projects found</Heading>
                        <Box maxWidth="300px">
                            <Text color="gray" size="2" align="center" style={{ display: "block" }}>
                                {searchQuery ? `No projects matching "${searchQuery}"` : "Create your first project to organize your research papers."}
                            </Text>
                        </Box>
                        <NextLink href="/dashboard?view=projects_new" passHref legacyBehavior>
                            <Button variant="outline" asChild style={{ cursor: 'pointer' }}>
                                <Link style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <PlusIcon /> Create your first project
                                </Link>
                            </Button>
                        </NextLink>
                    </Flex>
                </Card>
            )}
        </Flex>
    );
}

function ProjectGridItem({ project }: { project: Project }) {
    const date = new Date(project.created_at).toLocaleDateString();

    return (
        <Card size="3" className="hover-lift">
            <Flex direction="column" gap="4" height="100%">
                <Flex justify="between" align="start">
                    <IconButton size="3" variant="soft" radius="medium">
                        <FileTextIcon width="24" height="24" />
                    </IconButton>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <IconButton variant="ghost" size="2" radius="full">
                                <DotsVerticalIcon />
                            </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content variant="soft">
                            <DropdownMenu.Item>Edit Project</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item color="red">Delete Project</DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </Flex>

                <Box style={{ flexGrow: 1 }}>
                    <NextLink href={`/dashboard/project/${project.id}`} passHref legacyBehavior>
                        <Link style={{ textDecoration: "none", color: "inherit" }}>
                            <Heading size="4" mb="2" className="hover:text-accent-11 transition-colors">
                                {project.name}
                            </Heading>
                        </Link>
                    </NextLink>
                    <Text size="2" color="gray" className="line-clamp-2">
                        {project.description || "No description provided for this work space."}
                    </Text>
                </Box>

                <Flex align="center" justify="between" pt="4" style={{ borderTop: "1px solid var(--gray-5)" }}>
                    <Flex align="center" gap="1">
                        <CalendarIcon style={{ color: "var(--gray-9)" }} />
                        <Text size="1" color="gray">{date}</Text>
                    </Flex>
                    <NextLink href={`/dashboard/project/${project.id}`} passHref legacyBehavior>
                        <Link style={{ textDecoration: "none" }}>
                            <Text size="1" weight="bold" className="hover:underline">Open Project</Text>
                        </Link>
                    </NextLink>
                </Flex>
            </Flex>
        </Card>
    );
}

function ProjectListItem({ project, isLast }: { project: Project, isLast: boolean }) {
    const date = new Date(project.created_at).toLocaleDateString();

    return (
        <Box p="4" style={{ borderBottom: isLast ? "none" : "1px solid var(--gray-5)" }} className="hover:bg-gray-2 transition-colors">
            <Flex align="center" gap="4">
                <IconButton size="4" variant="soft" radius="medium">
                    <FileTextIcon width="24" height="24" />
                </IconButton>
                <Box style={{ flexGrow: 1 }}>
                    <NextLink href={`/dashboard/project/${project.id}`} passHref legacyBehavior>
                        <Link style={{ textDecoration: "none", color: "inherit" }}>
                            <Heading size="3" mb="1" className="hover:text-accent-11 transition-colors">{project.name}</Heading>
                        </Link>
                    </NextLink>
                    <Text size="1" color="gray" className="truncate">{project.description || "No description provided"}</Text>
                </Box>
                <Flex direction="column" align="end" className="hidden md:flex">
                    <Text size="1" weight="bold" color="gray">Created</Text>
                    <Text size="1" color="gray">{date}</Text>
                </Flex>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <IconButton variant="ghost" size="2" radius="full">
                            <DotsVerticalIcon />
                        </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content variant="soft">
                        <DropdownMenu.Item>Edit</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Flex>
        </Box>
    );
}
