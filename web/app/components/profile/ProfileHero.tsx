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
import RoleBadge from '../common/RoleBadge';
import type { UserRole } from '~/auth/types';

interface ProfileHeroProps {
    attributes: ProfileAttributeDto[];
    email: string | null;
    role: string | null;
}


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

                <Stack align='center' style={{ flex: 1, minWidth: 200 }}>
                    <Avatar
                        src={imageUrl}
                        alt={displayName}
                        size={120}
                        style={{
                            border: '4px solid var(--mantine-color-myColor-6)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                        }}
                    />
                    <Title order={1} fw={900}>
                        {displayName}
                    </Title>
                    {email && (
                        <Text size="sm" c="dimmed">
                            {email}
                        </Text>
                    )}

                    <Group gap="sm" mt={4}>
                        {role && (
                            RoleBadge({ role: role as UserRole })
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
