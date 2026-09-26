import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true, // Auto-refresh data when user switches back to this tab
            retry: 1,
            staleTime: 10 * 1000, // Consider data fresh for 10 seconds
        },
    },
});
