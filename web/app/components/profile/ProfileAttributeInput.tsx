import type { DropdownOptionDto } from '~/api/types';
import { ProfileAttributeInputDropdown } from './ProfileAttributeInputDropdown';
import { ProfileAttributeInputTextarea } from './ProfileAttributeInputTextarea';
import { ProfileAttributeInputNumeric } from './ProfileAttributeInputNumeric';
import { ProfileAttributeInputBoolean } from './ProfileAttributeInputBoolean';
import { ProfileAttributeInputDate } from './ProfileAttributeInputDate';
import { ProfileAttributeInputPeriod } from './ProfileAttributeInputPeriod';
import { ProfileAttributeInputText } from './ProfileAttributeInputText';
import { ProfileAttributeInputImage } from './ProfileAttributeInputImage';

export interface AttributeDef {
    id: string;
    attributeName: string;
    typeName: string;
    dropdownOptions: DropdownOptionDto[] | null;
}

export interface ProfileAttributeInputProps {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInput(props: ProfileAttributeInputProps) {
    const { attribute } = props;
    const isDropdown = attribute.dropdownOptions && attribute.dropdownOptions.length > 0;

    if (isDropdown) {
        return <ProfileAttributeInputDropdown {...props} />;
    }

    const typeNameLower = attribute.typeName.toLowerCase();

    if (typeNameLower.includes('image')) {
        return <ProfileAttributeInputImage {...props} />;
    }

    if (typeNameLower.includes('text') && attribute.attributeName.toLowerCase().includes('description')) {
        return <ProfileAttributeInputTextarea {...props} />;
    }

    if (typeNameLower.includes('numeric')) {
        return <ProfileAttributeInputNumeric {...props} />;
    }

    if (typeNameLower.includes('boolean')) {
        return <ProfileAttributeInputBoolean {...props} />;
    }

    if (typeNameLower.includes('date')) {
        return <ProfileAttributeInputDate {...props} />;
    }

    if (typeNameLower.includes('period')) {
        return <ProfileAttributeInputPeriod {...props} />;
    }

    return <ProfileAttributeInputText {...props} />;
}
