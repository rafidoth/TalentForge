import { Navigate, useNavigate } from 'react-router';
import {
    Container,
    Stack,
    Group,
    Button,
} from '@mantine/core';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useIsAuthenticated, useAuthLoading, useAuthStore } from '~/auth/store';
import { useMeSection } from '~/hooks/useProfileData';
import {
    ProfileHero,
    ProfileSkeleton,
    ProfileError,
    MeSectionEditor,
    ProjectsSection,
    ProfileInfoSection,
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

    return (
        <Container py="xl">
            <Stack gap="lg">
                <ProfileHero
                    attributes={meAttributes}
                    email={email}
                    role={role}
                />
                <MeSectionEditor attributes={meAttributes} />
                <ProfileInfoSection />
                <ProjectsSection />
            </Stack>
        </Container>
    );
}
