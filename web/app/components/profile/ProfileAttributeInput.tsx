import { Select, Textarea, TextInput, NumberInput, Checkbox, Group } from '@mantine/core';
import type { DropdownOptionDto } from '~/api/types';

export interface AttributeDef {
    id: string;
    attributeName: string;
    typeName: string;
    dropdownOptions: DropdownOptionDto[] | null;
}

interface ProfileAttributeInputProps {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInput({ attribute, value, onChange }: ProfileAttributeInputProps) {
    const handleChange = (val: any) => onChange(attribute.id, val);

    const isDropdown = attribute.dropdownOptions && attribute.dropdownOptions.length > 0;

    if (isDropdown) {
        return (
            <Select
                label={attribute.attributeName}
                data={attribute.dropdownOptions!.map(opt => ({ value: opt.id, label: opt.label }))}
                value={value}
                onChange={(val) => handleChange(val || '')}
                searchable
                clearable
            />
        );
    }
    
    const typeNameLower = attribute.typeName.toLowerCase();

    if (typeNameLower.includes('text') && attribute.attributeName.toLowerCase().includes('description')) {
        return (
            <Textarea
                label={attribute.attributeName}
                value={value || ''}
                onChange={(e) => handleChange(e.target.value)}
                minRows={3}
            />
        );
    }

    if (typeNameLower.includes('numeric')) {
        return (
            <NumberInput
                label={attribute.attributeName}
                value={value === '' ? '' : value}
                onChange={handleChange}
            />
        );
    }

    if (typeNameLower.includes('boolean')) {
        return (
            <Checkbox
                label={attribute.attributeName}
                checked={!!value}
                onChange={(e) => handleChange(e.currentTarget.checked)}
                mt="md"
            />
        );
    }

    if (typeNameLower.includes('date')) {
        return (
            <TextInput
                type="date"
                label={attribute.attributeName}
                value={value || ''}
                onChange={(e) => handleChange(e.currentTarget.value)}
            />
        );
    }

    if (typeNameLower.includes('period')) {
        return (
            <Group grow align="flex-start">
                <TextInput 
                    type="date" 
                    label={`${attribute.attributeName} (Start)`}
                    value={value?.[0] || ''} 
                    onChange={(e) => {
                        const arr = Array.isArray(value) ? [...value] : ['', ''];
                        arr[0] = e.currentTarget.value;
                        handleChange(arr);
                    }} 
                />
                <TextInput 
                    type="date" 
                    label={`${attribute.attributeName} (End)`}
                    value={value?.[1] || ''} 
                    onChange={(e) => {
                        const arr = Array.isArray(value) ? [...value] : ['', ''];
                        arr[1] = e.currentTarget.value;
                        handleChange(arr);
                    }} 
                />
            </Group>
        );
    }

    return (
        <TextInput
            label={attribute.attributeName}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
        />
    );
}
