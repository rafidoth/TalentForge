import { TextInput } from '@mantine/core';
import type { AttributeDef } from './ProfileAttributeInput';

interface Props {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInputDate({ attribute, value, onChange }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(attribute.id, e.currentTarget.value);

    return (
        <TextInput
            type="date"
            label={attribute.attributeName}
            value={value || ''}
            onChange={handleChange}
        />
    );
}
