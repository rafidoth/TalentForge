import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router';
import { AppHeader } from '~/components/layout';

export default function Application() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 250,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppHeader opened={opened} toggle={toggle} />
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}