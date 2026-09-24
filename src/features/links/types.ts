export interface TagItem {
    id: number;
    name: string;
    createdAt?: string;
}

export interface UrlItem {
    id: number;
    originalUrl: string;
    shortUrl: string;
    shortCode: string;
    clickCount: number;
    expiresAt: string | null;
    createdAt: string;
    tags: TagItem[];
}

export interface CreateUrlRequest {
    originalUrl: string;
    customAlias?: string;
    expiresAt?: string;
    tagIds?: number[];
}

export interface SpringPage<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // 0-based page index
    first: boolean;
    last: boolean;
    empty: boolean;
}