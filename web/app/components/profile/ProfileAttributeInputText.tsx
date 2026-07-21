import { TextInput } from '@mantine/core';
import type { AttributeDef } from './ProfileAttributeInput';

interface Props {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInputText({ attribute, value, onChange }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(attribute.id, e.target.value);

    return (
        <TextInput
            label={attribute.attributeName}
            value={value || ''}
            onChange={handleChange}
        />
    );
}
