import { Navigate, useNavigate } from 'react-router';
import {
    Container,
    Stack,
    Group,
    Button,
    SimpleGrid,
} from '@mantine/core';
import { ArrowLeftIcon, UserIcon, IdentificationCardIcon } from '@phosphor-icons/react';
import { useIsAuthenticated, useAuthLoading, useAuthStore } from '~/auth/store';
import { useMeSection } from '~/hooks/useProfileData';
import {
    ProfileHero,
    ProfileDetailsCard,
    ProfileSkeleton,
    ProfileError,
} from '~/components/profile';

export default function Profile() {
    const isAuthenticated = useIsAuthenticated();
    const authLoading = useAuthLoading();
    const { email, role } = useAuthStore();
    const navigate = useNavigate();

    const {
        data: meSection,
        isLoading,
        isError,
        error,
        refetch,
    } = useMeSection();

    // Wait for the async auth check to finish before redirecting
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

    // Attributes shown in the hero card — excluded from the details card
    const heroAttributeNames = ['First Name', 'Last Name', 'Location', 'Profile Image'];

    // Remaining attributes go into the details card
    const detailAttributes = meAttributes.filter(
        (a) => !heroAttributeNames.includes(a.attributeName)
    );

    return (
        <Container size="md" py="xl">
            <Stack gap="lg">
                {/* Back navigation */}
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

                {/* Hero card with avatar, name, role, location */}
                <ProfileHero
                    attributes={meAttributes}
                    email={email}
                    role={role}
                />

                {/* Attribute detail cards */}
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                    <ProfileDetailsCard
                        title="Personal Information"
                        icon={<UserIcon size={20} weight="duotone" />}
                        attributes={meAttributes}
                        include={['First Name', 'Last Name']}
                    />

                    {detailAttributes.length > 0 && (
                        <ProfileDetailsCard
                            title="Additional Details"
                            icon={<IdentificationCardIcon size={20} weight="duotone" />}
                            attributes={detailAttributes}
                        />
                    )}
                </SimpleGrid>
            </Stack>
        </Container>
    );
}
