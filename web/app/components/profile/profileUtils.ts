import type { ProfileAttributeDto } from '~/api/types';

export function getAttributeValue(
    attributes: ProfileAttributeDto[],
    name: string
): string {
    return attributes.find((a) => a.attributeName === name)?.value ?? '';
}

export function getProfileImageUrl(attributes: ProfileAttributeDto[]): string {
    const url = getAttributeValue(attributes, 'Profile Image');
    return url || `https://api.dicebear.com/9.x/initials/svg?seed=User`;
}

export function getDisplayName(attributes: ProfileAttributeDto[]): string {
    const first = getAttributeValue(attributes, 'First Name');
    const last = getAttributeValue(attributes, 'Last Name');
    return [first, last].filter(Boolean).join(' ') || 'Unknown User';
}
