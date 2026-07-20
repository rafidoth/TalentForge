import { useState } from 'react';
import { Group, ActionIcon, TextInput, Select, NumberInput, Checkbox, Text, Button, Box, Tooltip, TooltipFloating } from '@mantine/core';
import { IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import type { DropdownOptionDto } from '~/api/types';
import { useAddProfileAttribute, useUpdateProfileAttribute } from '~/hooks/useProfileData';

interface CvAttributeItemProps {
    attributeId: string;
    attributeName: string;
    typeName: string;
    isMissing: boolean;
    value?: any;
    version?: number;
    dropdownOptions?: DropdownOptionDto[] | null;
    profileAttributeId?: string;
}

export function CvAttributeItem({
    attributeId,
    attributeName,
    typeName,
    isMissing,
    value,
    version,
    dropdownOptions,
    profileAttributeId
}: CvAttributeItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState<any>(value ?? '');

    const addMutation = useAddProfileAttribute();
    const updateMutation = useUpdateProfileAttribute();

    const handleSave = () => {
        let finalValue = editValue;
        if (typeName === 'Numeric' && typeof finalValue !== 'number') {
            finalValue = Number(finalValue);
        }

        if (isMissing) {
            addMutation.mutate({
                attributeId,
                value: finalValue
            }, {
                onSuccess: () => setIsEditing(false)
            });
        } else if (profileAttributeId && version !== undefined) {
            updateMutation.mutate({
                profileAttributeId,
                value: finalValue,
                version
            }, {
                onSuccess: () => setIsEditing(false)
            });
        }
    };

    const handleCancel = () => {
        setEditValue(value ?? '');
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <Group gap="sm" align="flex-end" mb="xs">
                <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={500} mb={4}>{attributeName}</Text>
                    {dropdownOptions && dropdownOptions.length > 0 ? (
                        <Select
                            data={dropdownOptions.map(d => ({ value: d.label, label: d.label }))}
                            value={editValue?.toString()}
                            onChange={(v) => setEditValue(v)}
                            searchable
                        />
                    ) : typeName === 'Boolean' ? (
                        <Checkbox
                            checked={!!editValue}
                            onChange={(e) => setEditValue(e.currentTarget.checked)}
                            label="Yes"
                        />
                    ) : typeName === 'Numeric' ? (
                        <NumberInput
                            value={editValue}
                            onChange={(v) => setEditValue(v)}
                        />
                    ) : (
                        <TextInput
                            value={editValue}
                            onChange={(e) => setEditValue(e.currentTarget.value)}
                        />
                    )}
                </Box>
                <ActionIcon
                    color="green"
                    size="lg"
                    variant="light"
                    onClick={handleSave}
                    loading={addMutation.isPending || updateMutation.isPending}
                >
                    <IconCheck size={18} />
                </ActionIcon>
                <ActionIcon color="red" size="lg" variant="light" onClick={handleCancel}>
                    <IconX size={18} />
                </ActionIcon>
            </Group>
        );
    }

    if (isMissing) {
        return (
            <TooltipFloating label="Click to fill in this missing attribute">
                <Box
                    onClick={() => setIsEditing(true)}
                    mb="xs"
                    style={{
                        backgroundColor: 'var(--mantine-color-red-1)',
                        border: '1px dashed var(--mantine-color-red-5)',
                        color: 'var(--mantine-color-red-8)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'inline-block'
                    }}
                >
                    <Text size="sm" fw={600}>Missing: {attributeName}</Text>
                </Box>
            </TooltipFloating>
        );
    }

    let displayValue = value;
    if (typeName === 'Boolean') {
        displayValue = value ? 'Yes' : 'No';
    } else if (typeof value === 'object' && value !== null) {
        displayValue = JSON.stringify(value);
    }

    return (
        <Group
            gap="xs"
            mb="xs"
            style={{
                cursor: 'pointer',
                position: 'relative',
                padding: '2px 4px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => setIsEditing(true)}
        >
            <Text fw={500} size="lg" >{attributeName} </Text>
            <Text size="md" style={{ color: 'var(--mantine-color-dark-8)' }}>{displayValue}</Text>
            <ActionIcon
                variant="transparent"
                color="gray"
                size="sm"
                style={{ opacity: 0.5 }}
                title="Edit attribute"
            >
                <IconEdit size={14} />
            </ActionIcon>
        </Group>
    );
}
