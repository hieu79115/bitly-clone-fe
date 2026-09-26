import { useEffect } from 'react';

/**
 * Hook to lock background body scrolling when a modal or dialog is open.
 */
export function useLockBodyScroll(isLocked: boolean): void {
    useEffect(() => {
        if (!isLocked) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [isLocked]);
}
