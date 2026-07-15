import { Navigate, useNavigate } from 'react-router';
import {
    Container,
    Stack,
    Group,
    Button,
    SimpleGrid,
    Paper,
    Text,
    Badge,
    ActionIcon,
    Center,
    Loader,
    ThemeIcon,
    Title,
    Divider,
} from '@mantine/core';
import { ArrowLeftIcon, IdentificationCardIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { useIsAuthenticated, useAuthLoading, useAuthStore } from '~/auth/store';
import { useMeSection } from '~/hooks/useProfileData';
import {
    ProfileHero,
    ProfileSkeleton,
    ProfileError,
    MeSectionEditor,
} from '~/components/profile';
import { AttributeLibraryModal } from '~/components/attributeLibrary';
import { useProfileAttributes, useDeleteProfileAttribute } from '~/components/attributeLibrary/useAttributes';
import { useState } from 'react';

export default function Profile() {
    const isAuthenticated = useIsAuthenticated();
    const authLoading = useAuthLoading();
    const { email, role } = useAuthStore();
    const navigate = useNavigate();
    const [attributeLibraryOpened, setAttributeLibraryOpened] = useState(false);

    const {
        data: meSection,
        isLoading,
        isError,
        error,
        refetch,
    } = useMeSection();

    const { data: profileAttributes, isLoading: isLoadingAttributes } = useProfileAttributes();
    const { mutate: removeAttribute, isPending: isRemovingAttribute } = useDeleteProfileAttribute();

    if (authLoading) {
        return (
            <Container size="md" py="xl">
                <ProfileSkeleton />
            </Container>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return (
            <Container size="md" py="xl">
                <ProfileSkeleton />
            </Container>
        );
    }

    if (isError || !meSection) {
        return (
            <Container size="md" py="xl">
                <ProfileError
                    message={(error as Error)?.message}
                    onRetry={() => refetch()}
                />
            </Container>
        );
    }

    const { meAttributes } = meSection;

    const formatValue = (value: any, typeName: string): string => {
        if (value === null || value === undefined || value === '') return '—';
        const name = typeName.toLowerCase();
        if (name.includes('boolean')) {
            return value === true || value === 'true' ? 'Yes' : 'No';
        }
        if (name.includes('period') && Array.isArray(value)) {
            return `${value[0]} → ${value[1]}`;
        }
        if (name.includes('one') && Array.isArray(value)) {
            return value.join(', ') || '—';
        }
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value);
            } catch {
                return String(value);
            }
        }
        return String(value);
    };

    return (
        <Container py="xl">
            <Stack gap="lg">
                <Group>
                    <Button
                        variant="subtle"
                        color="myColor"
                        leftSection={<ArrowLeftIcon size={18} />}
                        onClick={() => navigate('/app')}
                    >
                        Back to Dashboard
                    </Button>
                </Group>
                <ProfileHero
                    attributes={meAttributes}
                    email={email}
                    role={role}
                />
                
                <MeSectionEditor attributes={meAttributes} />

                {/* Info Section - Profile Attributes from Attribute Library */}
                <Paper p="xl" withBorder={false} shadow="none">
                    <Group justify="space-between" mb="md">
                        <Group gap="sm">
                            <ThemeIcon variant="light" size="lg" radius="md" color="myColor">
                                <IdentificationCardIcon size={20} />
                            </ThemeIcon>
                            <Title order={3} fw={600}>
                                Info
                            </Title>
                        </Group>
                        <Button
                            onClick={() => setAttributeLibraryOpened(true)}
                            leftSection={<PlusIcon size={16} />}
                            variant="light"
                            color="myColor"
                        >
                            Attribute Library
                        </Button>
                    </Group>
                    <Divider mb="md" />

                    {isLoadingAttributes ? (
                        <Center p="xl"><Loader /></Center>
                    ) : !profileAttributes || profileAttributes.length === 0 ? (
                        <Center p="xl">
                            <Stack align="center" gap="sm">
                                <Text c="dimmed" size="sm">
                                    No attributes added yet. Open the Attribute Library to add some.
                                </Text>
                            </Stack>
                        </Center>
                    ) : (
                        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3 }} spacing="md">
                            {profileAttributes.map((attr) => (
                                <Paper
                                    key={attr.id}
                                    withBorder
                                    p="md"
                                    radius="md"
                                    style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                                >
                                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                                        <Text fw={600} size="md" c="dimmed" lineClamp={2}>
                                            {attr.attributeName}
                                        </Text>
                                        <ActionIcon
                                            color="red"
                                            variant="subtle"
                                            size="sm"
                                            loading={isRemovingAttribute}
                                            onClick={() => {
                                                if (window.confirm(`Remove "${attr.attributeName}" from your profile?`)) {
                                                    removeAttribute(attr.id);
                                                }
                                            }}
                                        >
                                            <TrashIcon size={16} />
                                        </ActionIcon>
                                    </Group>

                                    <Text size="xl" fw={500} mt="xs" c={formatValue(attr.value, attr.typeName) === '—' ? 'red' : undefined}>
                                        {formatValue(attr.value, attr.typeName)}
                                    </Text>
                                </Paper>
                            ))}
                        </SimpleGrid>
                    )}
                </Paper>

                <AttributeLibraryModal
                    opened={attributeLibraryOpened}
                    onClose={() => setAttributeLibraryOpened(false)}
                />

            </Stack>
        </Container>
    );
}
