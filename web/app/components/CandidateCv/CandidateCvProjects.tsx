import { Title, Text, Stack, MultiSelect, Loader, Center } from '@mantine/core';
import { useProjects } from '~/hooks/useProjects';

interface CandidateCvProjectsProps {
    maxProjects: number;
    selectedProjectIds: string[];
    setSelectedProjectIds: (ids: string[]) => void;
}

export function CandidateCvProjects({ maxProjects, selectedProjectIds, setSelectedProjectIds }: CandidateCvProjectsProps) {
    const { data: projects, isLoading } = useProjects();

    if (isLoading) {
        return (
            <Center py="xl">
                <Loader color="blue" />
            </Center>
        );
    }

    const projectOptions = projects?.map(p => ({
        value: p.id,
        label: p.name
    })) || [];

    return (
        <Stack >
            <Title order={3} mb="sm" style={{
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '1.2rem',
                color: '#1a1a1a',
                borderBottom: '2px solid #333',
                paddingBottom: '4px'
            }}>
                Projects
            </Title>
            <Text fs="italic" c="dimmed" size="sm">
                Projects selected here will be included when you publish your CV. You can select up to {maxProjects} projects.
            </Text>
            <MultiSelect
                description={`Select up to ${maxProjects} projects to highlight on your CV.`}
                placeholder={selectedProjectIds.length < maxProjects ? "Select projects" : `Maximum of ${maxProjects} reached`}
                data={projectOptions}
                value={selectedProjectIds}
                onChange={setSelectedProjectIds}
                searchable
                clearable
                maxValues={maxProjects}
                nothingFoundMessage="No projects available."
            />

        </Stack>
    );
}
