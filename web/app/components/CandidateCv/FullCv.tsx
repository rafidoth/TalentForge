import { Paper, Stack, Title, Group, Avatar, Text, Box } from '@mantine/core';
import type { FullCvDetailDto } from '~/api/cvs';
import type { ProfileAttributeDto, AttributeDto } from '~/api/types';
import { getAttributeDictionary } from './CandidateCvHeader';
import classes from './CandidateCv.module.css';
import { MarkdownRenderer } from '~/components/common/MarkdownRenderer';

interface FullCvProps {
    cv: FullCvDetailDto;
}

export function FullCv({ cv }: FullCvProps) {
    const attributeDictionary = getAttributeDictionary(cv.filledAttributes);

    const { filledAttributes, missingAttributes } = cv;

    const groupedAttributes: Record<string, { filled: ProfileAttributeDto[], missing: AttributeDto[] }> = {};

    filledAttributes.forEach(attr => {
        if (attr.isBuiltin) return;
        const cat = attr.categoryName || 'Other';
        if (!groupedAttributes[cat]) groupedAttributes[cat] = { filled: [], missing: [] };
        groupedAttributes[cat].filled.push(attr);
    });

    missingAttributes.forEach(attr => {
        if (attr.isBuiltin) return; // Skip builtin missing attributes from groups
        const cat = attr.categoryName || 'Other';
        if (!groupedAttributes[cat]) groupedAttributes[cat] = { filled: [], missing: [] };
        groupedAttributes[cat].missing.push(attr);
    });

    return (
        <Paper
            shadow="0px -10px 12px rgba(0, 0, 0, 0.1)"
            p="xl"
            radius="md"
            className={classes.cvWrapper}
            style={{ minHeight: '800px', color: 'var(--mantine-color-text)' }}
        >
            <Stack gap="xs" mb="xl" align="center">
                <Group>
                    <Avatar size={60} radius={100} src={attributeDictionary['Profile Photo'] as string | undefined} alt="Profile Photo" />
                    <Stack gap={0} align="flex-start">
                        <Title order={1} style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
                            {`${attributeDictionary['First Name'] || ''} ${attributeDictionary['Last Name'] || ''}`}
                        </Title>
                        <Group>
                            <Text>{attributeDictionary['Email'] || ''}</Text>
                            {attributeDictionary['Email'] && attributeDictionary['Address'] && '·'}
                            <Text>{attributeDictionary['Address'] || ''}</Text>
                        </Group>
                    </Stack>
                </Group>
            </Stack>

            {/* Attributes */}
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
                            {filled.map(attr => {
                                let displayValue = attr.value;
                                if (attr.dropdownOptions && attr.dropdownOptions.length > 0) {
                                    if (Array.isArray(attr.value)) {
                                        displayValue = attr.value.map((v: any) => {
                                            const option = attr.dropdownOptions!.find(o => o.id === v);
                                            return option ? option.label : v;
                                        }).join(', ');
                                    } else {
                                        const option = attr.dropdownOptions.find(o => o.id === attr.value);
                                        if (option) displayValue = option.label;
                                    }
                                } else if (attr.typeName === 'Boolean') {
                                    displayValue = attr.value ? 'Yes' : 'No';
                                } else if (typeof attr.value === 'object' && attr.value !== null) {
                                    displayValue = JSON.stringify(attr.value);
                                }

                                return (
                                    <Group
                                        key={`filled-${attr.id}`}
                                        gap="xs"
                                        mb="xs"
                                        style={{ padding: '2px 4px' }}
                                    >
                                        <Text fw={500} size="lg">{attr.attributeName} </Text>
                                        <Text size="md">{displayValue as string}</Text>
                                    </Group>
                                );
                            })}
                            {missing.map(attr => (
                                <Box
                                    key={`missing-${attr.id}`}
                                    mb="xs"
                                    className={classes.missingAttribute}
                                >
                                    <Text size="sm" fw={600}>Missing: {attr.name}</Text>
                                </Box>
                            ))}
                        </Stack>
                    </div>
                ))}
            </Stack>

            {cv.projects && cv.projects.length > 0 && (
                <Stack mt="xl">
                    <Title order={3} mb="sm" style={{
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: '1.2rem',
                        color: 'var(--mantine-color-text)',
                        borderBottom: '2px solid var(--mantine-color-text)',
                        paddingBottom: '4px'
                    }}>
                        Projects
                    </Title>
                    <Stack gap="md">
                        {cv.projects.map(proj => (
                            <div key={proj.id}>
                                <Text fw={700} size="xl">{proj.name}</Text>
                                {proj.description && (
                                    <Box mt={4}>
                                        <MarkdownRenderer content={proj.description} />
                                    </Box>
                                )}
                            </div>
                        ))}
                    </Stack>
                </Stack>
            )}
        </Paper>
    );
}
