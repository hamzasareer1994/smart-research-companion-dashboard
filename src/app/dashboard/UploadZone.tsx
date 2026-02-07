"use client";

import { useState } from "react";
import {
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Text,
    IconButton,
    Progress,
    Grid,
    Callout
} from "@radix-ui/themes";
import {
    UploadIcon,
    FileTextIcon,
    Cross2Icon,
    CheckCircledIcon,
    UpdateIcon,
    LockClosedIcon,
    InfoCircledIcon
} from "@radix-ui/react-icons";

export function UploadZone() {
    const [files, setFiles] = useState<{ name: string; size: string; status: 'idle' | 'uploading' | 'done', progress: number }[]>([]);
    const [dragging, setDragging] = useState(false);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');

        const newFiles = droppedFiles.map(f => ({
            name: f.name,
            size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
            status: 'idle' as const,
            progress: 0
        }));
        setFiles([...files, ...newFiles]);
    };

    const startUpload = () => {
        setFiles(prev => prev.map(f => f.status === 'idle' ? { ...f, status: 'uploading', progress: 0 } : f));

        // Mock upload progress
        setTimeout(() => {
            setFiles(prev => prev.map(f => f.status === 'uploading' ? { ...f, status: 'done', progress: 100 } : f));
        }, 2000);
    };

    return (
        <Flex direction="column" gap="8" maxWidth="1000px" mx="auto">
            <Box>
                <Heading size="8" mb="2" weight="bold" align="center">Upload Research Papers</Heading>
                <Text color="gray" size="3" align="center" style={{ display: "block" }}>Add PDFs to your research engine to enable intelligent chat and analysis.</Text>
            </Box>

            <Callout.Root color="blue" variant="soft">
                <Callout.Icon>
                    <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>
                    Large files may take a few moments to vectorize for semantic search.
                </Callout.Text>
            </Callout.Root>

            <Box
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                p="9"
                style={{
                    border: "2px dashed var(--gray-5)",
                    borderRadius: "var(--radius-4)",
                    backgroundColor: dragging ? "var(--accent-3)" : "var(--gray-2)",
                    transition: "all 0.3s ease"
                }}
            >
                <Flex direction="column" align="center" gap="4">
                    <IconButton size="4" variant="soft" radius="full">
                        <UploadIcon width="32" height="32" />
                    </IconButton>
                    <Box>
                        <Heading size="5" mb="1" align="center">Drag & Drop Documents</Heading>
                        <Text color="gray" size="2" align="center" style={{ display: "block" }}>Support for PDF only. Max file size 50MB.</Text>
                    </Box>
                    <label style={{ cursor: "pointer" }}>
                        <input type="file" className="hidden" multiple accept=".pdf" />
                        <Button variant="outline" size="3" radius="full" asChild>
                            <Box as="span">Select Files</Box>
                        </Button>
                    </label>
                </Flex>
            </Box>

            <Grid columns={{ initial: "1", md: "3" }} gap="4">
                <Card size="2">
                    <Flex gap="3" align="start">
                        <Box mt="1">
                            <LockClosedIcon style={{ color: "var(--green-9)" }} />
                        </Box>
                        <Box>
                            <Text size="2" weight="bold" style={{ display: "block" }}>Privacy First</Text>
                            <Text size="1" color="gray">Your papers are private to your workspace.</Text>
                        </Box>
                    </Flex>
                </Card>
                <Card size="2">
                    <Flex gap="3" align="start">
                        <Box mt="1">
                            <UpdateIcon style={{ color: "var(--blue-9)" }} />
                        </Box>
                        <Box>
                            <Text size="2" weight="bold" style={{ display: "block" }}>Smart Vectorization</Text>
                            <Text size="1" color="gray">Semantic embedding for high-precision search.</Text>
                        </Box>
                    </Flex>
                </Card>
                <Card size="2">
                    <Flex gap="3" align="start">
                        <Box mt="1">
                            <CheckCircledIcon style={{ color: "var(--orange-9)" }} />
                        </Box>
                        <Box>
                            <Text size="2" weight="bold" style={{ display: "block" }}>Bulk Processing</Text>
                            <Text size="1" color="gray">Upload and process entire folders at once.</Text>
                        </Box>
                    </Flex>
                </Card>
            </Grid>

            {files.length > 0 && (
                <Flex direction="column" gap="4" pt="6" style={{ borderTop: "1px solid var(--gray-5)" }}>
                    <Flex align="center" justify="between">
                        <Heading size="4">{files.length} Document(s) pending</Heading>
                        <Button
                            size="3"
                            onClick={startUpload}
                            disabled={files.some(f => f.status === 'uploading')}
                        >
                            Process Documents
                        </Button>
                    </Flex>

                    <Flex direction="column" gap="3">
                        {files.map((file, idx) => (
                            <Card key={idx} size="2">
                                <Flex align="center" gap="4">
                                    <IconButton variant="soft" size="3">
                                        <FileTextIcon />
                                    </IconButton>
                                    <Box style={{ flexGrow: 1 }}>
                                        <Flex justify="between" align="center" mb="1">
                                            <Text size="2" weight="bold">{file.name}</Text>
                                            <Text size="1" color="gray">{file.size}</Text>
                                        </Flex>
                                        {file.status === 'uploading' && (
                                            <Progress value={file.progress} size="1" />
                                        )}
                                        {file.status === 'done' && (
                                            <Flex align="center" gap="1">
                                                <CheckCircledIcon style={{ color: "var(--green-9)" }} />
                                                <Text size="1" weight="bold" style={{ color: "var(--green-9)" }}>Ready for analysis</Text>
                                            </Flex>
                                        )}
                                    </Box>
                                    <IconButton
                                        variant="ghost"
                                        color="red"
                                        onClick={() => setFiles(f => f.filter((_, i) => i !== idx))}
                                    >
                                        <Cross2Icon />
                                    </IconButton>
                                </Flex>
                            </Card>
                        ))}
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
}
