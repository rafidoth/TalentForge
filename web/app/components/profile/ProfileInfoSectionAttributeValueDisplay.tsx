import { useState } from 'react';
import { Text, Image, Box, Group, Badge, Modal, Stack } from '@mantine/core';
import type { DropdownOptionDto } from '~/api/types';
import { MarkdownRenderer } from '~/components/common/MarkdownRenderer';

interface Props {
    value: any;
    typeName: string;
    dropdownOptions?: DropdownOptionDto[] | null;
}

export function ProfileInfoSectionAttributeValueDisplay({ value, typeName, dropdownOptions }: Props) {
    const [imageModalOpened, setImageModalOpened] = useState(false);

    if (value === null || value === undefined || value === '') {
        return <Text size="xl" fw={500} mt="xs" c="red">—</Text>;
    }

    const name = typeName.toLowerCase();
    console.log(name)

    if (name.includes('image')) {
        if (typeof value === 'string' && value.startsWith('http')) {
            return (
                <>
                    <Box mt="sm" onClick={() => setImageModalOpened(true)} style={{ cursor: 'pointer' }}>
                        <Image
                            src={value}
                            alt="Attribute Image"
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
                            alt="Attribute Image"
                            fit="contain"
                            fallbackSrc="https://placehold.co/120x120?text=Invalid+Image"
                            style={{ maxHeight: '80vh', maxWidth: '100%' }}
                        />
                    </Modal>
                </>
            );
        }
        return <Text size="xl" fw={500} mt="xs" c="red">Invalid Image URL</Text>;
    }

    if (name.includes('boolean')) {
        const isTrue = value === true || value === 'true';
        return (
            <Badge color={isTrue ? 'teal' : 'gray'} mt="sm" size="lg" variant="light">
                {isTrue ? 'Yes' : 'No'}
            </Badge>
        );
    }

    if (name.includes('period') && Array.isArray(value)) {
        const start = value[0] || '—';
        const end = value[1] || '—';
        return (
            <Text size="md" fw={500} mt="xs">
                {start} &rarr; {end}
            </Text>
        );
    }

    if (name === "One Of Many".toLowerCase() && dropdownOptions) {
        return (
            <Group mt="sm">
                {
                    dropdownOptions.map((opt) => (
                        <Badge
                            key={opt.id}
                            color={opt.id === value ? 'var(--mantine-color-blue-4)' : 'gray'}
                        >
                            <b>{opt.label}</b>
                        </Badge>
                    ))
                }
            </Group >
        );
    }

    if (name.includes('date')) {
        return <Text size="xl" fw={500} mt="xs">{String(value)}</Text>;
    }

    if (name.includes('numeric')) {
        return <Text size="xl" fw={500} mt="xs">{String(value)}</Text>;
    }

    if (name.includes('text')) {
        return (
            <Box mt="xs">
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
        <Text size="xl" fw={500} mt="xs" style={{ wordBreak: 'break-word' }}>
            {displayValue}
        </Text>
    );
}
