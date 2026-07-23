import type { AttributeDef } from './ProfileAttributeInput';
import { MarkdownEditor } from '~/components/common/MarkdownEditor';

interface Props {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInputTextarea({ attribute, value, onChange }: Props) {
    const handleChange = (newValue: string) => onChange(attribute.id, newValue);

    return (
        <MarkdownEditor
            label={attribute.attributeName}
            value={value || ''}
            onChange={handleChange}
        />
    );
}

