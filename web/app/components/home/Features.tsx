import { Box, SimpleGrid, Text, Title } from "@mantine/core";

const FEATURES = [
    {
        title: "Attribute Library",
        body: "Define a skill, score, or certification once. Reuse it across every position and every profile.",
    },
    {
        title: "Position Templates",
        body: "Recruiters assemble positions from attributes and access rules — no duplicated forms, no busywork.",
    },
    {
        title: "Automatic CVs",
        body: "Candidates fill their profile once. A tailored CV is generated for every position they qualify for.",
    },
];

export default function FeaturesSection() {
    return (
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" pb={80}>
            {FEATURES.map((f) => (
                <Box key={f.title} style={{ borderTop: "2px solid var(--mantine-color-blue-6)" }} pt="md">
                    <Title order={3} ff="Fraunces, serif" fw={600} fz={18} mb={8} c="dark.9">
                        {f.title}
                    </Title>
                    <Text fz="sm" lh={1.6} c="dimmed">
                        {f.body}
                    </Text>
                </Box>
            ))}
        </SimpleGrid>
    );
}