import Link from "next/link";
import { FileTextIcon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton, Text } from "@radix-ui/themes";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Flex
            align="center"
            justify="center"
            minHeight="100vh"
            className="relative overflow-hidden"
            style={{
                backgroundColor: "var(--gray-1)",
                backgroundImage: "radial-gradient(circle at 2px 2px, var(--gray-4) 1px, transparent 0)",
                backgroundSize: "40px 40px"
            }}
        >
            {/* Background elements */}
            <Box
                position="absolute"
                style={{ top: "25%", left: "-10%", width: "400px", height: "400px", filter: "blur(100px)", opacity: 0.1, backgroundColor: "var(--accent-9)", borderRadius: "100%" }}
            />
            <Box
                position="absolute"
                style={{ bottom: "25%", right: "-10%", width: "400px", height: "400px", filter: "blur(100px)", opacity: 0.1, backgroundColor: "var(--accent-9)", borderRadius: "100%" }}
            />

            {/* Logo */}
            <Box position="absolute" top="6" left="6">
                <Link href="/" className="flex items-center gap-2 no-underline">
                    <IconButton size="2" variant="solid">
                        <FileTextIcon />
                    </IconButton>
                    <Text size="3" weight="bold" color="gray" highContrast>Smart Research</Text>
                </Link>
            </Box>

            {children}
        </Flex>
    );
}
