import { format } from 'date-fns';

/**
 * Formats a given date into a specified string format.
 * @param date The date to format (can be a string, Date object, or number).
 * @param formatStr The format string (defaults to 'MMM d, yyyy').
 * @returns The formatted date string.
 */
export function formatDate(date: string | Date | number | null | undefined, formatStr: string = 'MMM d, yyyy'): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  // Check for invalid dates
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return format(dateObj, formatStr);
}
