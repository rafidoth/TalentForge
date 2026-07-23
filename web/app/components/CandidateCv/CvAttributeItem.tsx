import { useState } from 'react';
import { Group, ActionIcon, TextInput, Select, NumberInput, Checkbox, Text, Button, Box, Tooltip, TooltipFloating } from '@mantine/core';
import { IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import type { DropdownOptionDto } from '~/api/types';
import { useAddProfileAttribute, useUpdateProfileAttribute } from '~/hooks/useProfileData';
import { ProfileAttributeInput } from '~/components/profile/ProfileAttributeInput';
import classes from './CandidateCv.module.css';

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
                    <ProfileAttributeInput
                        attribute={{
                            id: attributeId,
                            attributeName,
                            typeName,
                            dropdownOptions: dropdownOptions || null
                        }}
                        value={editValue}
                        onChange={(_id, v) => setEditValue(v)}
                    />
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
                    className={classes.missingAttribute}
                >
                    <Text size="sm" fw={600}>Missing: {attributeName}</Text>
                </Box>
            </TooltipFloating>
        );
    }

    let displayValue = value;
    if (dropdownOptions && dropdownOptions.length > 0) {
        const option = dropdownOptions.find(o => o.id === value);
        if (option) {
            displayValue = option.label;
        }
    } else if (typeName === 'Boolean') {
        displayValue = value ? 'Yes' : 'No';
    } else if (typeof value === 'object' && value !== null) {
        displayValue = JSON.stringify(value);
    }

    return (
        <Group
            gap="xs"
            mb="xs"
            className={classes.attributeItem}
            onClick={() => setIsEditing(true)}
        >
            <Text fw={500} size="lg" >{attributeName} </Text>
            <Text size="md" >{displayValue}</Text>
            <ActionIcon
                variant="transparent"
                color="gray"
                size="sm"
                className={classes.editIcon}
                title="Edit attribute"
            >
                <IconEdit size={14} />
            </ActionIcon>
        </Group>
    );
}
