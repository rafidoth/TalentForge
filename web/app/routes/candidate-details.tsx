import { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Container, Stack, Group, Skeleton, Center, Text, Paper, Tabs } from '@mantine/core';
import { TagIcon, FolderSimpleIcon, FileTextIcon, IdentificationCardIcon } from '@phosphor-icons/react';
import { fetchCandidateFullProfile } from '~/api/profile';
import {
    CandidateProfileHeader,
    CandidateProfileAttributes,
    CandidateProfileProjects,
    CandidateProfileCvs,
} from '~/components/candidate-details';

export default function CandidateDetailsRoute() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<string | null>('attributes');

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['candidateProfile', id],
        queryFn: () => fetchCandidateFullProfile(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <Container size="md" py="xl">
                <Stack gap="lg">
                    <Paper p="xl" radius="md" withBorder>
                        <Group align="flex-start" gap="xl">
                            <Skeleton height={100} circle />
                            <Stack gap="sm" style={{ flex: 1 }}>
                                <Skeleton height={28} width="60%" />
                                <Skeleton height={16} width="40%" />
                                <Skeleton height={20} width={80} />
                            </Stack>
                        </Group>
                    </Paper>
                    <Skeleton height={40} />
                    <Skeleton height={200} />
                </Stack>
            </Container>
        );
    }

    if (error || !profile) {
        return (
            <Container size="md" py="xl">
                <Center h={400}>
                    <Text c="red" size="lg">Failed to load candidate profile.</Text>
                </Center>
            </Container>
        );
    }

    return (
        <Container size="md" py="xl">
            <Stack gap="lg">
                <CandidateProfileHeader
                    meAttributes={profile.meSection.meAttributes}
                    email={profile.infoSection.email}
                    status={profile.infoSection.status}
                    joinedAt={profile.infoSection.joinedAt}
                />

                <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
                    <Tabs.List>
                        <Tabs.Tab value="attributes" leftSection={<TagIcon size={16} />}>
                            Info ({profile.attributes.length})
                        </Tabs.Tab>
                        <Tabs.Tab value="projects" leftSection={<FolderSimpleIcon size={16} />}>
                            Projects ({profile.projects.length})
                        </Tabs.Tab>
                        <Tabs.Tab value="cvs" leftSection={<FileTextIcon size={16} />}>
                            CVs ({profile.cvs.length})
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="attributes" pt="md">
                        <CandidateProfileAttributes attributes={profile.attributes} />
                    </Tabs.Panel>

                    <Tabs.Panel value="projects" pt="md">
                        <CandidateProfileProjects projects={profile.projects} />
                    </Tabs.Panel>

                    <Tabs.Panel value="cvs" pt="md">
                        <CandidateProfileCvs cvs={profile.cvs} />
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </Container>
    );
}
