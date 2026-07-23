import { Divider, Stack, Title } from '@mantine/core';
import { CvAttributeItem } from '~/components/CandidateCv/CvAttributeItem';
import type { ProfileAttributeDto, AttributeDto } from '~/api/types';

interface CandidateCvPositionAttributesProps {
    groupedAttributes: Record<string, { filled: ProfileAttributeDto[], missing: AttributeDto[] }>;
}

export function CandidateCvPositionAttributes({ groupedAttributes }: CandidateCvPositionAttributesProps) {
    return (
        <Stack gap="sm">
            {Object.entries(groupedAttributes).map(([category, { filled, missing }]) => (
                <div key={category}>
                    <Title order={3} mb="sm" style={{
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: '1.2rem',
                        color: 'var(--mantine-color-text)',
                        borderBottom: '2px solid var(--mantine-color-text)',
                        paddingBottom: '4px'
                    }}>
                        {category}
                    </Title>
                    <Stack gap={0} >
                        {filled.map(attr => (
                            <CvAttributeItem
                                key={`filled-${attr.id}`}
                                attributeId={attr.attributeId}
                                attributeName={attr.attributeName}
                                typeName={attr.typeName}
                                isMissing={false}
                                value={attr.value}
                                version={attr.version}
                                dropdownOptions={attr.dropdownOptions}
                                profileAttributeId={attr.id}
                            />
                        ))}
                        {missing.map(attr => (
                            <CvAttributeItem
                                key={`missing-${attr.id}`}
                                attributeId={attr.id}
                                attributeName={attr.name}
                                typeName={attr.typeName}
                                isMissing={true}
                                dropdownOptions={attr.dropdownOptions}
                            />
                        ))}
                    </Stack>
                </div>
            ))}
        </Stack>
    );
}
