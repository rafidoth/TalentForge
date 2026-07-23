import { Radio, Group } from '@mantine/core';
import type { AttributeDef } from './ProfileAttributeInput';

interface Props {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInputBoolean({ attribute, value, onChange }: Props) {
    const handleChange = (val: string) => {
        onChange(attribute.id, val === 'true');
    };

    let radioValue = '';
    if (value === true || value === 'true') radioValue = 'true';
    if (value === false || value === 'false') radioValue = 'false';

    return (
        <Radio.Group
            label={attribute.attributeName}
            value={radioValue}
            onChange={handleChange}
        >
            <Group mt="xs">
                <Radio value="true" label="Yes" />
                <Radio value="false" label="No" />
            </Group>
        </Radio.Group>
    );
}
