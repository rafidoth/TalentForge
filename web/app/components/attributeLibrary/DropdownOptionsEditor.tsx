import { useState } from 'react';
import { Stack, Group, TextInput, Button, Text, ActionIcon, Paper } from '@mantine/core';
import { TrashIcon, PlusIcon } from '@phosphor-icons/react';

interface DropdownOptionsEditorProps {
    value?: string[];
    onChange?: (value: string[]) => void;
}

export function DropdownOptionsEditor({ value = [], onChange }: DropdownOptionsEditorProps) {
    const [newValue, setNewValue] = useState('');

    const handleAdd = () => {
        if (newValue.trim().length > 0 && !value.includes(newValue.trim())) {
            onChange?.([...value, newValue.trim()]);
            setNewValue('');
        }
    };

    const handleRemove = (indexToRemove: number) => {
        onChange?.(value.filter((_, index) => index !== indexToRemove));
    };

    return (
        <Stack gap="sm">
            <Text fw={500} size="sm">Dropdown Options</Text>
            
            {value.length > 0 && (
                <Paper withBorder p="xs" radius="md">
                    <Stack gap="xs">
                        {value.map((opt, idx) => (
                            <Group key={idx} justify="space-between" wrap="nowrap">
                                <Text size="sm">{opt}</Text>
                                <ActionIcon color="red" variant="subtle" onClick={() => handleRemove(idx)}>
                                    <TrashIcon size={16} />
                                </ActionIcon>
                            </Group>
                        ))}
                    </Stack>
                </Paper>
            )}

            <Group align="flex-end">
                <TextInput
                    style={{ flex: 1 }}
                    placeholder="Type a new option..."
                    value={newValue}
                    onChange={(e) => setNewValue(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                />
                <Button onClick={handleAdd} leftSection={<PlusIcon size={16} />} variant="light">
                    Add
                </Button>
            </Group>
        </Stack>
    );
}
