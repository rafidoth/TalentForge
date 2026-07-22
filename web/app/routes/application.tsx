import { AppShell, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router';
import { AppHeader } from '~/components/layout';
import type { RouteHandle } from '~/auth/types';

export const handle: RouteHandle = {
    requireAuth: true
};

export default function Application() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
        >
            <AppHeader opened={opened} toggle={toggle} />
            <AppShell.Main>
                <Container size="md" py="xl">
                    <Outlet />
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}