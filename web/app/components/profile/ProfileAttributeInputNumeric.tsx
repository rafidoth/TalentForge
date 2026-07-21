import { NumberInput } from '@mantine/core';
import type { AttributeDef } from './ProfileAttributeInput';

interface Props {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInputNumeric({ attribute, value, onChange }: Props) {
    const handleChange = (val: string | number) => onChange(attribute.id, val);

    return (
        <NumberInput
            label={attribute.attributeName}
            value={value === '' ? '' : value}
            onChange={handleChange}
        />
    );
}
