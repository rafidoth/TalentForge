import { Checkbox } from '@mantine/core';
import type { AttributeDef } from './ProfileAttributeInput';

interface Props {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInputBoolean({ attribute, value, onChange }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(attribute.id, e.currentTarget.checked);

    return (
        <Checkbox
            label={attribute.attributeName}
            checked={!!value}
            onChange={handleChange}
            mt="md"
        />
    );
}
