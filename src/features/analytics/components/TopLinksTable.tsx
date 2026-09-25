import { Globe, ArrowUpRight, BarChart3 } from 'lucide-react';
import type { TopUrlItem } from '../types';
import { getDomain, getFaviconUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TopLinksTableProps {
    urls: TopUrlItem[];
    onSelectLink: (shortCode: string) => void;
}

export default function TopLinksTable({ urls, onSelectLink }: TopLinksTableProps) {
    if (!urls || urls.length === 0) {
        return (
            <div className="p-8 text-center text-sm text-slate-400">
                No active links with clicks yet.
            </div>
        );
    }

    return (
        <div className="divide-y divide-slate-100">
            {urls.map((url, idx) => {
                const domain = getDomain(url.originalUrl);
                const faviconUrl = getFaviconUrl(url.originalUrl);
                const displayTitle = url.title?.trim() || domain || url.originalUrl;

                return (
                    <div
                        key={url.id}
                        className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                    >
                        {/* Rank & Link Info */}
                        <div className="flex items-center gap-3 min-w-0">
                            <span
                                className={`size-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                                    idx === 0
                                        ? 'bg-amber-100 text-amber-700'
                                        : idx === 1
                                        ? 'bg-slate-200 text-slate-700'
                                        : idx === 2
                                        ? 'bg-amber-50 text-amber-800'
                                        : 'bg-slate-100 text-slate-500'
                                }`}
                            >
                                #{idx + 1}
                            </span>

                            <div className="size-8 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                                <img
                                    src={faviconUrl}
                                    alt={domain}
                                    className="size-4.5 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                        (e.target as HTMLElement).nextElementSibling?.removeAttribute('style');
                                    }}
                                />
                                <Globe className="size-4 text-slate-400 hidden" />
                            </div>

                            <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-slate-900 truncate max-w-xs sm:max-w-md" title={displayTitle}>
                                    {displayTitle}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span className="font-mono text-primary font-medium">{url.shortCode}</span>
                                    <span>•</span>
                                    <a
                                        href={url.originalUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="truncate hover:text-slate-600 hover:underline max-w-[200px]"
                                    >
                                        {domain}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Clicks & Action */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                                <span className="text-sm font-bold text-slate-900 block">{url.clickCount}</span>
                                <span className="text-[11px] text-slate-400 block -mt-0.5">clicks</span>
                            </div>

                            <Button
                                size="xs"
                                variant="outline"
                                className="gap-1 hidden sm:flex"
                                onClick={() => onSelectLink(url.shortCode)}
                            >
                                <BarChart3 className="size-3 text-primary" />
                                <span>Inspect</span>
                                <ArrowUpRight className="size-3 text-slate-400" />
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
