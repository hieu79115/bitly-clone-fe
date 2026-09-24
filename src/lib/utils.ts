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

export function isDateExpired(dateStr: string | Date | null | undefined): boolean {
    if (!dateStr) return false;
    const date = parseUtcDate(dateStr);
    return date ? date.getTime() <= Date.now() : false;
}

/**
 * Extracts the domain name (hostname) from a given URL string.
 */
export function getDomain(urlStr: string): string {
    try {
        const url = new URL(urlStr.startsWith('http://') || urlStr.startsWith('https://') ? urlStr : `https://${urlStr}`);
        return url.hostname.replace(/^www\./, '');
    } catch {
        return urlStr;
    }
}

/**
 * Returns a high-res favicon URL from Google's favicon service for a given website URL.
 */
export function getFaviconUrl(urlStr: string): string {
    const domain = getDomain(urlStr);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

