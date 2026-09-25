export interface ClicksByDate {
    date: string;
    count: number;
}

export interface ClicksByBrowser {
    browser: string;
    count: number;
}

export interface ClicksByOs {
    os: string;
    count: number;
}

export interface ClicksByDevice {
    device: string;
    count: number;
}

export interface TopUrlItem {
    id: number;
    title?: string | null;
    shortCode: string;
    shortUrl: string;
    originalUrl: string;
    clickCount: number;
}

export interface AnalyticsSummary {
    shortCode?: string | null;
    originalUrl?: string | null;
    title?: string | null;
    totalClicks: number;
    clicksByDate: ClicksByDate[];
    clicksByBrowser: ClicksByBrowser[];
    clicksByOs: ClicksByOs[];
    clicksByDevice: ClicksByDevice[];
    topUrls?: TopUrlItem[];
}
