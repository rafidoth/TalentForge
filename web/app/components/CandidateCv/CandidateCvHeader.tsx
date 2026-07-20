import { Title, Text, Stack, Group, Avatar } from '@mantine/core';
import { CvAttributeItem } from '~/components/CandidateCv/CvAttributeItem';
import type { ProfileAttributeDto } from '~/api/types';
import { useUserEmail, useUserId } from '~/auth/store';

interface CandidateCvHeaderProps {
    cvId?: string;
    meAttributes: ProfileAttributeDto[];
}

type AttributeLike = {
    attributeName: string;
    value: unknown;
};

export function getAttributeDictionary<T extends AttributeLike>(attributes: T[]): Record<string, T['value']> {
    return attributes.reduce<Record<string, T['value']>>((dictionary, attribute) => {
        dictionary[attribute.attributeName] = attribute.value;
        return dictionary;
    }, {});
}

export function CandidateCvHeader({ cvId, meAttributes }: CandidateCvHeaderProps) {
    const attributeDictionary = getAttributeDictionary(meAttributes);
    const email = useUserEmail();
    return (
        <Stack gap="xs" mb="xl" align="center">
            <Group>
                <Avatar size={60} radius={100} src={attributeDictionary['Profile Photo'] as string | undefined} alt="Profile Photo" />
                <Stack gap={0} align="flex-start">
                    <Title order={1} style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
                        {`${attributeDictionary['First Name'] || ''} ${attributeDictionary['Last Name'] || ''}`}
                    </Title>
                    <Group>
                        <Text>{email || ''}</Text>
                        ·
                        <Text>{attributeDictionary['Address'] || ''}</Text>
                    </Group>
                </Stack>

            </Group>
        </Stack>
    );
}
