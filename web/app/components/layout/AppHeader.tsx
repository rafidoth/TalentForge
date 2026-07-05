import { AppShell, Burger, Group, Title, Badge } from '@mantine/core';
import { useUserRole } from '~/auth/store';
import { UserMenuContainer } from './UserMenuContainer';

interface AppHeaderProps {
    opened: boolean;
    toggle: () => void;
}

export function AppHeader({ opened, toggle }: AppHeaderProps) {
    const role = useUserRole();

    return (
        <AppShell.Header>
            <Group h="100%" px="md" justify="space-between">
                <Group>
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Title order={4}>TalentForge</Title>
                </Group>

                <Group>
                    <UserMenuContainer />
                </Group>
            </Group>
        </AppShell.Header>
    );
}
