import { Stack, Group, Text, Badge, Paper, Box } from '@mantine/core';
import type { ProjectDto } from '~/api/types';
import { MarkdownRenderer } from '~/components/common/MarkdownRenderer';

function formatProjectDate(date: string | null): string {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

interface CandidateProfileProjectsProps {
    projects: ProjectDto[];
}

export function CandidateProfileProjects({ projects }: CandidateProfileProjectsProps) {
    if (projects.length === 0) {
        return <Text c="dimmed">No projects found.</Text>;
    }

    return (
        <Stack gap="lg">
            {projects.map(proj => (
                <Paper key={proj.id}>
                    <Group justify="space-between" align="flex-start" mb="xs">
                        <Text fw={700} size="lg" style={{ flex: 1 }}>{proj.name}</Text>
                        <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                            {formatProjectDate(proj.startDate)} — {formatProjectDate(proj.endDate)}
                        </Text>
                    </Group>

                    {proj.tags && proj.tags.length > 0 && (
                        <Group gap={6} mb="sm">
                            {proj.tags.map(tag => (
                                <Badge key={tag.id} variant="light" size="sm">{tag.name}</Badge>
                            ))}
                        </Group>
                    )}

                    {proj.description && (
                        <Box>
                            <MarkdownRenderer content={proj.description} />
                        </Box>
                    )}
                </Paper>
            ))}
        </Stack>
    );
}
