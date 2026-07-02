import { AppShell, Burger, Group, Title, Badge, Text, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MoonStarsIcon, SunDimIcon } from '@phosphor-icons/react';
import { Outlet } from 'react-router';
import { useUserId, useUserRole } from "~/auth/store";
import type { UserRole } from "~/types";

export default function Application() {
    const [opened, { toggle }] = useDisclosure();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const role = useUserRole();
    const userId = useUserId();
    console.log("User role in Application component:", role); // Debugging line
    console.log("User ID in Application component:", userId); // Debugging line
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
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Text size="sm" mb="xs" fw={500} c="dimmed">
                    Navigation
                </Text>
                {/* Sidebar navigation components will be added here later */}
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}