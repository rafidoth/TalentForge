import { Title, Text, Stack, MultiSelect, Loader, Center } from '@mantine/core';
import { useSearchProjects } from '~/hooks/useProjects';
import { usePositionTags } from '~/hooks/usePositions';

interface CandidateCvProjectsProps {
    positionId: string;
    maxProjects: number;
    selectedProjectIds: string[];
    setSelectedProjectIds: (ids: string[]) => void;
}

export function CandidateCvProjects({ positionId, maxProjects, selectedProjectIds, setSelectedProjectIds }: CandidateCvProjectsProps) {
    const { data: positionTags, isLoading: isLoadingTags } = usePositionTags(positionId);
    
    // We only want projects that match the position's tags.
    // If the position has no tags, it currently fetches all projects, which might be acceptable.
    const tagIds = positionTags?.map(t => t.id) || [];
    
    const { data: searchResponse, isLoading: isLoadingProjects } = useSearchProjects({
        tagIds,
        page: 1,
        pageSize: 100, // Fetch a large enough page for the dropdown
    });

    const isLoading = isLoadingTags || isLoadingProjects;

    if (isLoading) {
        return (
            <Center py="xl">
                <Loader color="blue" />
            </Center>
        );
    }

    const projectOptions = searchResponse?.data?.map(p => ({
        value: p.id,
        label: p.name
    })) || [];

    return (
        <Stack >
            <Title order={3} mb="sm" style={{
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '1.2rem',
                color: 'var(--mantine-color-text)',
                borderBottom: '2px solid var(--mantine-color-text)',
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
