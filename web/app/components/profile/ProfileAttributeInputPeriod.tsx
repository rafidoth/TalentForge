import { Group, TextInput } from '@mantine/core';
import type { AttributeDef } from './ProfileAttributeInput';

interface Props {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInputPeriod({ attribute, value, onChange }: Props) {
    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arr = Array.isArray(value) ? [...value] : ['', ''];
        arr[0] = e.currentTarget.value;
        onChange(attribute.id, arr);
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arr = Array.isArray(value) ? [...value] : ['', ''];
        arr[1] = e.currentTarget.value;
        onChange(attribute.id, arr);
    };

    return (
        <Group grow align="flex-start">
            <TextInput 
                type="date" 
                label={`${attribute.attributeName} (Start)`}
                value={value?.[0] || ''} 
                onChange={handleStartChange} 
            />
            <TextInput 
                type="date" 
                label={`${attribute.attributeName} (End)`}
                value={value?.[1] || ''} 
                onChange={handleEndChange} 
            />
        </Group>
    );
}
