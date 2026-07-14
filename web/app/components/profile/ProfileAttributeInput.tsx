import { Select, Textarea, TextInput } from '@mantine/core';
import type { ProfileAttributeDto } from '~/api/types';

interface ProfileAttributeInputProps {
    attribute: ProfileAttributeDto;
    value: string;
    onChange: (id: string, value: string) => void;
}

export function ProfileAttributeInput({ attribute, value, onChange }: ProfileAttributeInputProps) {
    const handleChange = (val: string) => onChange(attribute.id, val);

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

    if (attribute.typeName.toLowerCase().includes('text') && attribute.attributeName.toLowerCase().includes('description')) {
        return (
            <Textarea
                label={attribute.attributeName}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                minRows={3}
            />
        );
    }

    return (
        <TextInput
            label={attribute.attributeName}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
        />
    );
}
