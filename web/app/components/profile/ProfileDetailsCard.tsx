import { useState, useEffect } from 'react';
import {
    Paper,
    Title,
    Text,
    Stack,
    Group,
    ThemeIcon,
    Divider,
    ActionIcon,
    Popover,
    Center,
    Loader,
    TextInput,
    Textarea,
    FileInput,
    NumberInput,
    Checkbox,
    Select,
    Button
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Plus, SquaresFour, Tag, IdentificationBadge } from '@phosphor-icons/react';
import type { ProfileAttributeDto, AttributeType } from '~/api/types';
import { useAttributeStore } from '~/store/attributeStore';

interface ProfileDetailsCardProps {
    title: string;
    icon: React.ReactNode;
}

export function ProfileDetailsCard({
    title,
    icon,
}: ProfileDetailsCardProps) {
    const [opened, { open, close }] = useDisclosure(false);
    const { categories, types, fetchLookups, isLoading } = useAttributeStore();
    
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [typeId, setTypeId] = useState<string | null>(null);
    const [value, setValue] = useState<any>('');

    useEffect(() => {
        if (opened) {
            fetchLookups();
        } else {
            // Reset state when modal is closed
            setTimeout(() => {
                setName('');
                setCategoryId(null);
                setTypeId(null);
                setValue('');
            }, 300);
        }
    }, [opened, fetchLookups]);

    const selectedType = types.find(t => t.id.toString() === typeId);

    const isFormValid = () => {
        if (!name.trim()) return false;
        if (!categoryId || !typeId) return false;
        if (!selectedType) return false;
        
        const typeName = selectedType.name.toLowerCase();
        if (typeName.includes('boolean')) return value !== null && value !== undefined;
        if (typeName.includes('period')) return !!(value?.start && value?.end);
        return !!value;
    };

    const renderInputForType = (typeName: string) => {
        const nameLower = typeName.toLowerCase();
        
        if (nameLower.includes('string')) {
            return <TextInput label="Value" placeholder="Enter text..." value={value || ''} onChange={(e) => setValue(e.currentTarget.value)} data-autofocus />;
        }
        if (nameLower.includes('text')) {
            return <Textarea label="Value" placeholder="Markdown supported..." minRows={4} value={value || ''} onChange={(e) => setValue(e.currentTarget.value)} data-autofocus />;
        }
        if (nameLower.includes('image')) {
            return <FileInput label="Upload Image" placeholder="Drag and drop or click" accept="image/*" value={value} onChange={setValue} data-autofocus />;
        }
        if (nameLower.includes('numeric')) {
            return <NumberInput label="Value" placeholder="Enter number..." value={value === '' ? '' : value} onChange={setValue} data-autofocus />;
        }
        if (nameLower.includes('period')) {
            return (
                <Group grow align="flex-start">
                    <TextInput type="date" label="Start Date" value={value?.start || ''} onChange={(e) => setValue({...value, start: e.currentTarget.value})} data-autofocus />
                    <TextInput type="date" label="End Date" value={value?.end || ''} onChange={(e) => setValue({...value, end: e.currentTarget.value})} />
                </Group>
            );
        }
        if (nameLower.includes('date')) {
            return <TextInput type="date" label="Date" value={value || ''} onChange={(e) => setValue(e.currentTarget.value)} data-autofocus />;
        }
        if (nameLower.includes('boolean')) {
            return <Checkbox label="Enabled / Yes" mt="xs" checked={!!value} onChange={(e) => setValue(e.currentTarget.checked)} />;
        }
        if (nameLower.includes('one of many') || nameLower.includes('dropdown')) {
            return <Select label="Value" placeholder="Select an option" data={['Option 1', 'Option 2', 'Option 3']} value={value || null} onChange={setValue} data-autofocus />;
        }
        
        // Fallback
        return <TextInput label="Value" placeholder="Enter value..." value={value || ''} onChange={(e) => setValue(e.currentTarget.value)} data-autofocus />;
    };

    return (
        <Paper p="xl" withBorder={false} shadow="none">
            <Group justify="space-between" mb="md">
                <Group gap="sm">
                    <ThemeIcon variant="light" size="lg" radius="md" color="myColor">
                        {icon}
                    </ThemeIcon>
                    <Title order={3} fw={600}>
                        {title}
                    </Title>
                </Group>
                <Popover 
                    opened={opened} 
                    onChange={(o) => (o ? open() : close())}
                    position="bottom-end" 
                    withArrow 
                    shadow="md"
                    width={360}
                >
                    <Popover.Target>
                        <ActionIcon variant="light" radius="xl" color="blue" onClick={open} size="lg">
                            <Plus size={20} />
                        </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown p="md">
                        <Title order={5} mb="md">Add Attribute</Title>
                        {isLoading ? (
                            <Center p="xl"><Loader /></Center>
                        ) : (
                            <Stack gap="md">
                                <TextInput
                                    label="Name"
                                    placeholder="e.g. My Custom Attribute"
                                    value={name}
                                    onChange={(e) => setName(e.currentTarget.value)}
                                    leftSection={<IdentificationBadge size={16} />}
                                    required
                                />

                                <Select 
                                    label="Category"
                                    placeholder="Select a category"
                                    data={categories.map(c => ({ value: c.id.toString(), label: c.name }))}
                                    value={categoryId}
                                    onChange={setCategoryId}
                                    leftSection={<SquaresFour size={16} />}
                                    searchable
                                    required
                                    comboboxProps={{ withinPortal: true }}
                                />

                                <Select 
                                    label="Attribute Type"
                                    placeholder="Select a type"
                                    data={types.map(t => ({ value: t.id.toString(), label: t.name }))}
                                    value={typeId}
                                    onChange={(val) => {
                                        setTypeId(val);
                                        setValue(''); // reset value when type changes
                                    }}
                                    leftSection={<Tag size={16} />}
                                    searchable
                                    required
                                    comboboxProps={{ withinPortal: true }}
                                />

                                {selectedType && (
                                    <Stack gap="xs">
                                        {renderInputForType(selectedType.name)}
                                    </Stack>
                                )}

                                <Group justify="flex-end" mt="md">
                                    <Button variant="default" onClick={close}>Cancel</Button>
                                    <Button 
                                        disabled={!isFormValid()}
                                        onClick={() => {
                                            alert(`Created Attribute!\nName: ${name}\nCategory: ${categoryId}\nType: ${typeId}\nValue: ${JSON.stringify(value)}`);
                                            close();
                                        }}
                                    >
                                        Create
                                    </Button>
                                </Group>
                            </Stack>
                        )}
                    </Popover.Dropdown>
                </Popover>
            </Group>
            <Divider mb="md" />
        </Paper>
    );
}
