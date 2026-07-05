import { AppShell, Burger, Group, Title, Badge, Text, ActionIcon, useMantineColorScheme, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MoonStarsIcon, SunDimIcon } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router';
import { useIsAuthenticated, useUserId, useUserRole, useLogout } from "~/auth/store";

interface AppHeaderProps {
    opened: boolean;
    toggle: () => void;
}

function AppHeader({ opened, toggle }: AppHeaderProps) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const role = useUserRole();
    const logout = useLogout();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <AppShell.Header>
            <Group h="100%" px="md" justify="space-between">
                <Group>
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Title order={4}>TalentForge</Title>
                </Group>

                <Group>
                    {role && (
                        <Badge color="blue" variant="light">
                            {role}
                        </Badge>
                    )}
                    <ActionIcon
                        variant="subtle"
                        onClick={() => toggleColorScheme()}
                        size="lg"
                        title="Toggle color scheme"
                        aria-label="Toggle color scheme"
                    >
                        {colorScheme === 'dark' ? <SunDimIcon size={24} /> : <MoonStarsIcon size={24} />}
                    </ActionIcon>
                    <Button variant="light" color="red" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </Group>
            </Group>
        </AppShell.Header>
    );
}

// function AppNavbar() {
//     return (
//         <AppShell.Navbar p="md">
//             <Text size="sm" mb="xs" fw={500} c="dimmed">
//                 Navigation
//             </Text>
//             {/* Sidebar navigation components will be added here later */}
//         </AppShell.Navbar>
//     );
// }

export default function Application() {
    const [opened, { toggle }] = useDisclosure();
    const isAuthenticated = useIsAuthenticated();



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