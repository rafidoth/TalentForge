import type { ProfileAttributeDto } from '~/api/types';

/**
 * Extract a specific attribute value from the meAttributes array by name.
 */
export function getAttributeValue(
    attributes: ProfileAttributeDto[],
    name: string
): string {
    return attributes.find((a) => a.attributeName === name)?.value ?? '';
}

/**
 * Extract the profile image URL. Falls back to a DiceBear placeholder.
 */
export function getProfileImageUrl(attributes: ProfileAttributeDto[]): string {
    const url = getAttributeValue(attributes, 'Profile Image');
    return url || `https://api.dicebear.com/9.x/initials/svg?seed=User`;
}

/**
 * Build a display name from first + last name attributes.
 */
export function getDisplayName(attributes: ProfileAttributeDto[]): string {
    const first = getAttributeValue(attributes, 'First Name');
    const last = getAttributeValue(attributes, 'Last Name');
    return [first, last].filter(Boolean).join(' ') || 'Unknown User';
}
