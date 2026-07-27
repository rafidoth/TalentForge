import { useMemo } from 'react';
import { Stack, Title, Text } from '@mantine/core';
import type { ProfileAttributeDto } from '~/api/types';
import { FullCvAttributeDisplay } from '~/components/CandidateCv/FullCvAttributeDisplay';

interface CandidateProfileAttributesProps {
    attributes: ProfileAttributeDto[];
}

export function CandidateProfileAttributes({ attributes }: CandidateProfileAttributesProps) {
    const grouped = useMemo(() => {
        const map: Record<string, ProfileAttributeDto[]> = {};
        attributes.forEach(attr => {
            const cat = attr.categoryName || 'Other';
            if (!map[cat]) map[cat] = [];
            map[cat].push(attr);
        });
        return map;
    }, [attributes]);

    if (attributes.length === 0) {
        return <Text c="dimmed">No attributes found.</Text>;
    }

    return (
        <Stack gap="lg">
            {Object.entries(grouped).map(([category, attrs]) => (
                <div key={category}>
                    <Text fw={600} size="md" c="dimmed" tt="uppercase" mb="xs"
                        style={{ letterSpacing: '0.5px', borderBottom: '1px solid var(--mantine-color-default-border)', paddingBottom: 4 }}
                    >
                        {category}
                    </Text>
                    <Stack gap={0}>
                        {attrs.map(attr => (
                            <FullCvAttributeDisplay key={attr.id} attribute={attr} />
                        ))}
                    </Stack>
                </div>
            ))}
        </Stack>
    );
}
