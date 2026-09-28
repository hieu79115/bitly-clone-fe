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

/**
 * Resolves the short link domain prefix for display in forms (e.g. Dashboard, Create Link).
 * Uses VITE_SHORT_DOMAIN or VITE_API_BASE_URL if set, falls back to window.location.host in production, or localhost:8080/ in local dev.
 */
export function getShortDomainDisplay(): string {
    const customDomain = import.meta.env.VITE_SHORT_DOMAIN;
    if (customDomain) {
        return customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '') + '/';
    }
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    if (apiUrl) {
        try {
            const parsed = new URL(apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`);
            return parsed.host + '/';
        } catch {
            return apiUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') + '/';
        }
    }
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return window.location.host + '/';
    }
    return 'localhost:8080/';
}

/**
 * Resolves the full clickable/copyable URL for a short code (e.g. http://localhost:8080/abc or https://sho.rt/abc)
 */
export function getFullShortUrl(shortCode: string): string {
    const customDomain = import.meta.env.VITE_SHORT_DOMAIN;
    if (customDomain) {
        const base = customDomain.startsWith('http') ? customDomain : `https://${customDomain}`;
        return `${base.replace(/\/$/, '')}/${shortCode}`;
    }
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    if (apiUrl) {
        const base = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`;
        return `${base.replace(/\/$/, '')}/${shortCode}`;
    }
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return `${window.location.origin}/${shortCode}`;
    }
    return `http://localhost:8080/${shortCode}`;
}


