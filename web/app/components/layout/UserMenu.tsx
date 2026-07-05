import { Menu, Avatar, Text, UnstyledButton, useMantineColorScheme, Skeleton, Badge, Title } from '@mantine/core';
import { MoonStarsIcon, SunDimIcon, UserCircleIcon, SignOutIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router';
import { useUserRole } from '~/auth/store';

export interface UserMenuProps {
    avatarUrl: string;
    displayName: string;
    email: string;
    isLoading?: boolean;
    onLogout: () => void;
}

export function UserMenu({ avatarUrl, displayName, email, isLoading, onLogout }: UserMenuProps) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const role = useUserRole();
    const navigate = useNavigate();

    if (isLoading) {
        return <Skeleton height={38} circle />;
    }

    return (
        <Menu shadow="md" width={240} position="bottom-end">
            <Menu.Target>
                <UnstyledButton>
                    <Avatar src={avatarUrl} radius="xl" size="md" />
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>
                    <Title order={2} fw={700}>
                        {displayName}
                    </Title>
                    <Text>{email}</Text>
                    {role && (
                        <Badge color="blue" variant="outline" size="sm" mt={4}>
                            {role}
                        </Badge>
                    )}
                </Menu.Label>

                <Menu.Divider />

                <Menu.Item
                    leftSection={<UserCircleIcon size={16} />}
                    onClick={() => navigate('/app/profile')}
                >
                    Profile
                </Menu.Item>

                <Menu.Item
                    leftSection={colorScheme === 'dark' ? <SunDimIcon size={16} /> : <MoonStarsIcon size={16} />}
                    onClick={() => toggleColorScheme()}
                >
                    {colorScheme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    leftSection={<SignOutIcon size={16} />}
                    onClick={onLogout}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
