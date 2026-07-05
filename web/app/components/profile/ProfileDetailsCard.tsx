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
    attributes: ProfileAttributeDto[];
    /** Optional list of attribute names to display. If omitted, shows all. */
    include?: string[];
    /** Attribute names to exclude from display. */
    exclude?: string[];
}

export function ProfileDetailsCard({
    title,
    icon,
    attributes,
    include,
    exclude = [],
}: ProfileDetailsCardProps) {
    let items = attributes.filter((a) => !exclude.includes(a.attributeName));
    if (include) {
        items = items.filter((a) => include.includes(a.attributeName));
    }

    if (items.length === 0) return null;

    return (
        <Paper shadow="sm" radius="lg" p="xl" withBorder>
            <Group gap="sm" mb="md">
                <ThemeIcon variant="light" size="lg" radius="md" color="myColor">
                    {icon}
                </ThemeIcon>
                <Title order={4} fw={600}>
                    {title}
                </Title>
            </Group>

            <Divider mb="md" />

            <Stack gap="sm">
                {items.map((attr) => (
                    <Group key={attr.id} justify="space-between" wrap="wrap">
                        <Text size="sm" c="dimmed" fw={500}>
                            {attr.attributeName}
                        </Text>
                        <Text size="sm" fw={500} style={{ textAlign: 'right' }}>
                            {attr.value || '—'}
                        </Text>
                    </Group>
                ))}
            </Stack>
        </Paper>
    );
}
