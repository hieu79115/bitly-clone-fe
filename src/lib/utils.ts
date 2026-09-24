export { cn } from "cn";

/**
 * Parses a date string from the backend into a local Date object.
 * If the string does not have timezone information (e.g., standard LocalDateTime format "2026-09-24T10:00:00"),
 * it appends 'Z' so the browser accurately interprets it as UTC and displays it in the user's local timezone.
 */
export function parseUtcDate(dateStr: string | Date | null | undefined): Date | null {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return dateStr;
    const isWithZone = dateStr.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateStr);
    const parsed = new Date(isWithZone ? dateStr : `${dateStr}Z`);
    return isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(dateStr: string | Date | null | undefined): string {
    const date = parseUtcDate(dateStr);
    return date ? date.toLocaleDateString() : '';
}

export function formatDateTime(dateStr: string | Date | null | undefined): string {
    const date = parseUtcDate(dateStr);
    return date ? date.toLocaleString() : '';
}
