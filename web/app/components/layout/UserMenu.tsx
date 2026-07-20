import { useState } from 'react';
import { Menu, Avatar, Text, UnstyledButton, Group, useMantineTheme, Skeleton, useMantineColorScheme } from '@mantine/core';
import { CaretDown, Heart, Star, Chat, Gear, ArrowsLeftRight, SignOut, Pause, Trash, GearIcon, SignOutIcon, CaretDownIcon, Moon, Sun } from '@phosphor-icons/react';
import classes from './AppHeader/AppHeader.module.css';
import { useNavigate } from 'react-router';

export interface UserMenuProps {
    avatarUrl: string;
    displayName: string;
    email: string;
    isLoading?: boolean;
    onLogout: () => void;
}

export function UserMenu({ avatarUrl, displayName, isLoading, onLogout }: UserMenuProps) {
    const theme = useMantineTheme();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const navigate = useNavigate();

    if (isLoading) {
        return <Skeleton height={38} circle />;
    }

    return (
        <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton
                    className={`${classes.user} ${userMenuOpened ? classes.userActive : ''}`}
                >
                    <Group gap={7}>
                        <Avatar src={avatarUrl} alt="" radius="xl" size={20} />
                        <Text fw={500} size="sm" lh={1} mr={3}>
                            {displayName}
                        </Text>
                        <CaretDownIcon size={12} weight="bold" />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item leftSection={<GearIcon size={16} weight="bold" />} onClick={() => navigate('/app/profile')}>
                    Profile settings
                </Menu.Item>
                <Menu.Item
                    leftSection={colorScheme === 'dark' ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
                    onClick={() => toggleColorScheme()}
                >
                    {colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}
                </Menu.Item>
                <Menu.Item leftSection={<SignOutIcon size={16} weight="bold" />} onClick={onLogout}>
                    Logout
                </Menu.Item>

            </Menu.Dropdown>
        </Menu>
    );
}
