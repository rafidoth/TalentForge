import {
    Paper,
    Avatar,
    Title,
    Text,
    Badge,
    Group,
    Stack,
} from '@mantine/core';
import { MapPinIcon } from '@phosphor-icons/react';
import type { ProfileAttributeDto } from '~/api/types';
import { getDisplayName, getProfileImageUrl, getAttributeValue } from './profileUtils';

interface ProfileHeroProps {
    attributes: ProfileAttributeDto[];
    email: string | null;
    role: string | null;
}

const roleBadgeColor: Record<string, string> = {
    Candidate: 'myColor',
    Recruiter: 'teal',
    Administrator: 'red',
};

export function ProfileHero({ attributes, email, role }: ProfileHeroProps) {
    const displayName = getDisplayName(attributes);
    const imageUrl = getProfileImageUrl(attributes);
    const location = getAttributeValue(attributes, 'Address');

    return (
        <Paper
            shadow="none"
            p="xl"
            withBorder={false}
        >
            <Group align="flex-start" gap="xl" wrap="wrap">
                <Avatar
                    src={imageUrl}
                    alt={displayName}
                    size={120}
                    radius="sm"
                    style={{
                        border: '4px solid var(--mantine-color-myColor-6)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    }}
                />

                <Stack gap={6} style={{ flex: 1, minWidth: 200 }}>
                    <Title order={2} fw={700}>
                        {displayName}
                    </Title>

                    {email && (
                        <Text size="sm" c="dimmed">
                            {email}
                        </Text>
                    )}

                    <Group gap="sm" mt={4}>
                        {role && (
                            <Badge
                                size="lg"
                                variant="light"
                                color={roleBadgeColor[role] ?? 'gray'}
                                radius="sm"
                            >
                                {role}
                            </Badge>
                        )}

                        {location && (
                            <Group gap={4}>
                                <MapPinIcon
                                    size={16}
                                    weight="fill"
                                />
                                <Text  >
                                    {location}
                                </Text>
                            </Group>
                        )}
                    </Group>
                </Stack>
            </Group>
        </Paper>
    );
}
