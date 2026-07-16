import type { ProfileAttributeDto } from '~/api/types';

export function getAttributeValue(
    attributes: ProfileAttributeDto[],
    name: string
): string {
    if (!attributes || !name) return '';
    return attributes.find((a) => a.attributeName === name)?.value ?? '';
}

export function getProfileImageUrl(attributes: ProfileAttributeDto[]): string {
    const url = getAttributeValue(attributes, 'Profile Photo');
    return url || `https://api.dicebear.com/9.x/initials/svg?seed=User`;
}

export function getDisplayName(attributes: ProfileAttributeDto[]): string {
    const first = getAttributeValue(attributes, 'First Name');
    const last = getAttributeValue(attributes, 'Last Name');
    return [first, last].filter(Boolean).join(' ') || 'Unknown User';
}

export function formatMonthYear(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatTimePeriod(startDate: string | null, endDate: string | null): string {
    if (!startDate && !endDate) return '';
    const start = formatMonthYear(startDate);
    const end = endDate ? formatMonthYear(endDate) : 'Present';
    if (!start) return end;
    return `${start} — ${end}`;
}

