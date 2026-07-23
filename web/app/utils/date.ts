import { format } from 'date-fns';

export function formatDate(date: string | Date | number | null | undefined, formatStr: string = 'MMM d, yyyy'): string {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  return format(dateObj, formatStr);
}

export function formatDateTime(date: string | Date | number | null | undefined, formatStr: string = 'MMM d, yyyy h:mm a'): string {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  return format(dateObj, formatStr);
}
