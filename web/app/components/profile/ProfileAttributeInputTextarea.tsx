import { Textarea } from '@mantine/core';
import type { AttributeDef } from './ProfileAttributeInput';

interface Props {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInputTextarea({ attribute, value, onChange }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(attribute.id, e.target.value);

    return (
        <Textarea
            label={attribute.attributeName}
            value={value || ''}
            onChange={handleChange}
            minRows={3}
        />
    );
}
