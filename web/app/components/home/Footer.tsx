import { Container, Box, Text } from "@mantine/core";

export default function Footer() {
    return (
        <Box style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }} py={24} pb={40}>
            <Container size="lg">
                <Text fz="sm" c="dimmed">
                    © {new Date().getFullYear()} TalentForge
                </Text>
            </Container>
        </Box>
    );
}