import { useState } from 'react';
import { Text, Image, Box, Group, Badge, Modal } from '@mantine/core';
import type { ProfileAttributeDto } from '~/api/types';
import { MarkdownRenderer } from '~/components/common/MarkdownRenderer';

export interface FullCvAttributeDisplayProps {
    attribute: ProfileAttributeDto;
}

export function FullCvAttributeDisplay({ attribute }: FullCvAttributeDisplayProps) {
    const [imageModalOpened, setImageModalOpened] = useState(false);
    const { attributeName, typeName, value, dropdownOptions } = attribute;

    if (value === null || value === undefined || value === '') {
        return (
            <Group gap="xs" mb="xs" style={{ padding: '2px 4px' }} align="baseline">
                <Text fw={500} size="lg">{attributeName}:</Text>
                <Text size="md" c="dimmed">—</Text>
            </Group>
        );
    }

    const name = typeName.toLowerCase();

    const renderValue = () => {
        if (name.includes('image')) {
            if (typeof value === 'string' && value.startsWith('http')) {
                return (
                    <>
                        <Box mt="xs" onClick={() => setImageModalOpened(true)} style={{ cursor: 'pointer', display: 'inline-block' }}>
                            <Image
                                src={value}
                                alt={attributeName}
                                radius="md"
                                h={120}
                                w="auto"
                                fit="contain"
                                fallbackSrc="https://placehold.co/120x120?text=Invalid+Image"
                            />
                        </Box>
                        <Modal
                            opened={imageModalOpened}
                            onClose={() => setImageModalOpened(false)}
                            size="auto"
                            centered
                            withCloseButton={false}
                            styles={{
                                content: { backgroundColor: 'transparent', boxShadow: 'none' },
                                body: { padding: 0 }
                            }}
                        >
                            <Image
                                src={value}
                                alt={attributeName}
                                fit="contain"
                                fallbackSrc="https://placehold.co/120x120?text=Invalid+Image"
                                style={{ maxHeight: '80vh', maxWidth: '100%' }}
                            />
                        </Modal>
                    </>
                );
            }
            return <Text size="md" c="red">Invalid Image URL</Text>;
        }

        if (name.includes('boolean')) {
            const isTrue = value === true || value === 'true';
            return (
                <Badge color={isTrue ? 'teal' : 'gray'} size="md" variant="light">
                    {isTrue ? 'Yes' : 'No'}
                </Badge>
            );
        }

        if (name.includes('period') && Array.isArray(value)) {
            const start = value[0] || '—';
            const end = value[1] || 'Present';
            return (
                <Text size="md" fw={500}>
                    {start} &rarr; {end}
                </Text>
            );
        }

        if (dropdownOptions && dropdownOptions.length > 0) {
            if (Array.isArray(value)) {
                const labels = value.map(val => {
                    const opt = dropdownOptions.find(o => o.id === val);
                    return opt ? opt.label : String(val);
                });
                return (
                    <Group gap={6}>
                        {labels.map((lbl, idx) => (
                            <Badge key={idx} variant="light" color="blue" size="md">{lbl}</Badge>
                        ))}
                    </Group>
                );
            } else {
                const option = dropdownOptions.find(o => o.id === value);
                return <Text size="md">{option ? option.label : String(value)}</Text>;
            }
        }

        if (name.includes('date') || name.includes('numeric')) {
            return <Text size="md">{String(value)}</Text>;
        }

        if (name.includes('text')) {
            return (
                <Box mt="4px" style={{ width: '100%' }}>
                    <MarkdownRenderer content={String(value)} />
                </Box>
            );
        }

        let displayValue = String(value);
        if (typeof value === 'object') {
            try {
                displayValue = JSON.stringify(value);
            } catch {
                displayValue = String(value);
            }
        }

        return (
            <Text size="md" style={{ wordBreak: 'break-word' }}>
                {displayValue}
            </Text>
        );
    };

    const isBlock = name.includes('text') || name.includes('image');

    if (isBlock) {
        return (
            <Box mb="sm" style={{ padding: '2px 4px' }}>
                <Text fw={600} size="lg" mb={4}>{attributeName}</Text>
                {renderValue()}
            </Box>
        );
    }

    return (
        <Group gap="xs" mb="xs" style={{ padding: '2px 4px' }} align="baseline">
            <Text fw={500} size="lg">{attributeName}:</Text>
            {renderValue()}
        </Group>
    );
}
