import { Select } from '@mantine/core';
import type { AttributeDef } from './ProfileAttributeInput';

interface Props {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInputDropdown({ attribute, value, onChange }: Props) {
    const handleChange = (val: string | null) => onChange(attribute.id, val || '');

    return (
        <Select
            label={attribute.attributeName}
            data={attribute.dropdownOptions!.map(opt => ({ value: opt.id, label: opt.label }))}
            value={value}
            onChange={handleChange}
            searchable
            clearable
        />
    );
}
