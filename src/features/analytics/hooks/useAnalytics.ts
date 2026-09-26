import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

export const ANALYTICS_KEYS = {
    all: ['analytics'] as const,
    overview: (days: number) => [...ANALYTICS_KEYS.all, 'overview', days] as const,
    link: (shortCode: string, days: number) => [...ANALYTICS_KEYS.all, 'link', shortCode, days] as const,
};

export function useAnalytics(shortCode?: string | null, days = 7) {
    const isOverview = !shortCode || shortCode === 'all';

    return useQuery({
        queryKey: isOverview ? ANALYTICS_KEYS.overview(days) : ANALYTICS_KEYS.link(shortCode, days),
        queryFn: () => isOverview ? analyticsApi.getOverviewAnalytics(days) : analyticsApi.getLinkAnalytics(shortCode!, days),
        staleTime: 1000 * 60, // 1 minute
    });
}
