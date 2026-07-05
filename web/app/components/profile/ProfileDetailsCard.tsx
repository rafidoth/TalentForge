import {
    Paper,
    Title,
    Text,
    Stack,
    Group,
    ThemeIcon,
    Divider,
} from '@mantine/core';
import type { ProfileAttributeDto } from '~/api/types';

interface ProfileDetailsCardProps {
    title: string;
    icon: React.ReactNode;
}

export function ProfileDetailsCard({
    title,
    icon,
}: ProfileDetailsCardProps) {

    return (
        <Paper p="xl" withBorder={false} shadow="none">
            <Group gap="sm" mb="md">
                <ThemeIcon variant="light" size="lg" radius="md" color="myColor">
                    {icon}
                </ThemeIcon>
                <Title order={3} fw={600}>
                    {title}
                </Title>
            </Group>
            <Divider mb="md" />

        </Paper>
    );
}
