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

    const heroAttributeNames = ['First Name', 'Last Name', 'Location', 'Profile Image'];

    const detailAttributes = meAttributes.filter(
        (a) => !heroAttributeNames.includes(a.attributeName)
    );

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
                <ProfileDetailsCard
                    title="Info"
                    icon={<IdentificationCardIcon size={20} />}
                />

            </Stack>
        </Container>
    );
}
