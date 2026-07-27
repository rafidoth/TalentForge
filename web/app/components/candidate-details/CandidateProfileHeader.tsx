import { Group, Avatar, Stack, Title, Text, Badge, Paper } from '@mantine/core';
import { EnvelopeSimpleIcon, MapPinIcon, CalendarBlankIcon } from '@phosphor-icons/react';
import type { ProfileAttributeDto } from '~/api/types';

function getBuiltinValue(meAttributes: ProfileAttributeDto[], name: string): any {
    const attr = meAttributes.find(a => a.attributeName === name);
    return attr?.value ?? null;
}

interface CandidateProfileHeaderProps {
    meAttributes: ProfileAttributeDto[];
    email: string;
    status: string;
    joinedAt: string;
}

export function CandidateProfileHeader({ meAttributes, email, status, joinedAt }: CandidateProfileHeaderProps) {
    const firstName = getBuiltinValue(meAttributes, 'First Name') || '';
    const lastName = getBuiltinValue(meAttributes, 'Last Name') || '';
    const address = getBuiltinValue(meAttributes, 'Address') || '';
    const profilePhoto = getBuiltinValue(meAttributes, 'Profile Photo') || '';

    const fullName = `${firstName} ${lastName}`.trim();
    const joinedDate = new Date(joinedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <Paper radius="md">
            <Group align="flex-start" gap="xl">
                <Avatar
                    size={100}
                    radius={100}
                    src={profilePhoto || undefined}
                    alt="Profile Photo"
                    color="blue"
                >
                    {firstName?.[0]}{lastName?.[0]}
                </Avatar>

                <Stack gap={2} style={{ flex: 1 }}>
                    <Title order={2} style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                        {fullName || 'Unknown Candidate'}
                    </Title>

                    <Group gap="sm" mt={4}>
                        {email && (
                            <Group gap={6}>
                                <EnvelopeSimpleIcon size={16} />
                                <Text size="sm" c="dimmed">{email}</Text>
                            </Group>
                        )}
                        {address && (
                            <Group gap={6}>
                                <MapPinIcon size={16} />
                                <Text size="sm" c="dimmed">{address}</Text>
                            </Group>
                        )}
                        <Group gap={6}>
                            <CalendarBlankIcon size={16} />
                            <Text size="sm" c="dimmed">Joined {joinedDate}</Text>
                        </Group>
                    </Group>

                    <Group gap="xs" mt="sm">
                        <Badge
                            color={status === 'Active' ? 'teal' : 'gray'}
                            variant="light"
                            size="md"
                        >
                            {status}
                        </Badge>
                    </Group>
                </Stack>
            </Group>
        </Paper>
    );
}
