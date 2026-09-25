import { useState, useMemo } from 'react';
import {
    Search,
    ChevronDown,
    Check,
    BarChart3,
    Globe,
    X,
    MousePointerClick,
} from 'lucide-react';
import type { UrlItem } from '@/features/links/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getDomain, getFaviconUrl } from '@/lib/utils';

interface SearchableLinkSelectorProps {
    urls: UrlItem[];
    selectedShortCode: string;
    onSelect: (shortCode: string) => void;
}

export default function SearchableLinkSelector({
    urls,
    selectedShortCode,
    onSelect,
}: SearchableLinkSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const selectedUrl = useMemo(
        () => urls.find((u) => u.shortCode === selectedShortCode),
        [urls, selectedShortCode]
    );

    const filteredUrls = useMemo(() => {
        if (!searchQuery.trim()) return urls;
        const query = searchQuery.trim().toLowerCase();
        return urls.filter((u) => {
            const titleMatch = u.title?.toLowerCase().includes(query);
            const codeMatch = u.shortCode.toLowerCase().includes(query);
            const urlMatch = u.originalUrl.toLowerCase().includes(query);
            return titleMatch || codeMatch || urlMatch;
        });
    }, [urls, searchQuery]);

    const handleSelect = (code: string) => {
        onSelect(code);
        setIsOpen(false);
        setSearchQuery('');
    };

    const isAll = selectedShortCode === 'all';

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger
                type="button"
                className="h-9 px-3 min-w-[220px] max-w-[320px] flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white shadow-xs text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-left cursor-pointer"
            >
                <div className="flex items-center gap-2 truncate min-w-0">
                    {isAll ? (
                        <>
                            <BarChart3 className="size-3.5 text-primary shrink-0" />
                            <span className="font-semibold text-slate-900 truncate">
                                All Links (Account-wide)
                            </span>
                        </>
                    ) : selectedUrl ? (
                        <>
                            <div className="size-4 rounded bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                <img
                                    src={getFaviconUrl(selectedUrl.originalUrl)}
                                    alt=""
                                    className="size-3.5 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                    }}
                                />
                            </div>
                            <span className="font-semibold text-slate-900 truncate">
                                {selectedUrl.title || getDomain(selectedUrl.originalUrl) || selectedUrl.shortCode}
                            </span>
                            <span className="text-[11px] font-mono text-primary font-semibold shrink-0">
                                /{selectedUrl.shortCode}
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="text-slate-400">/{selectedShortCode}</span>
                        </>
                    )}
                </div>
                <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
            </PopoverTrigger>

            <PopoverContent
                align="end"
                className="w-80 sm:w-96 p-0 border border-slate-200 shadow-xl rounded-xl bg-white overflow-hidden"
            >
                {/* Search Bar Input */}
                <div className="p-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/70">
                    <Search className="size-3.5 text-slate-400 shrink-0 ml-1" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, code or URL..."
                        className="w-full text-xs bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                        autoFocus
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="p-0.5 rounded text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Option: All Links */}
                <div className="p-1">
                    <button
                        type="button"
                        onClick={() => handleSelect('all')}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                            isAll
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'hover:bg-slate-100 text-slate-700'
                        }`}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="size-6 rounded-md bg-indigo-50 text-primary flex items-center justify-center shrink-0">
                                <BarChart3 className="size-3.5" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 leading-tight">
                                    All Links (Account-wide)
                                </p>
                                <p className="text-[10px] text-slate-400">
                                    Consolidated overview across all shortened links
                                </p>
                            </div>
                        </div>
                        {isAll && <Check className="size-4 text-primary shrink-0 ml-2" />}
                    </button>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Scrollable Links List */}
                <div className="max-h-64 overflow-y-auto p-1 divide-y divide-slate-50">
                    {filteredUrls.length > 0 ? (
                        filteredUrls.map((u) => {
                            const isSelected = selectedShortCode === u.shortCode;
                            const domain = getDomain(u.originalUrl);
                            const title = u.title || domain || u.shortCode;

                            return (
                                <button
                                    key={u.id}
                                    type="button"
                                    onClick={() => handleSelect(u.shortCode)}
                                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                                        isSelected
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'hover:bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <div className="size-6 rounded-md bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden">
                                            <img
                                                src={getFaviconUrl(u.originalUrl)}
                                                alt=""
                                                className="size-3.5 object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLElement).style.display = 'none';
                                                }}
                                            />
                                            <Globe className="size-3 text-slate-300 hidden only:block" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="font-medium text-slate-900 truncate max-w-[170px] sm:max-w-[210px] leading-tight">
                                                    {title}
                                                </p>
                                                <span className="font-mono text-[10px] font-semibold text-primary bg-primary/10 px-1 py-0.2 rounded">
                                                    /{u.shortCode}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
                                                {u.originalUrl}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                                            <MousePointerClick className="size-2.5 text-slate-400" />
                                            <span>{u.clickCount}</span>
                                        </span>
                                        {isSelected && <Check className="size-4 text-primary" />}
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="py-6 text-center text-xs text-slate-400">
                            No links found matching &ldquo;{searchQuery}&rdquo;
                        </div>
                    )}
                </div>

                {/* Footer Count */}
                <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                        {filteredUrls.length} of {urls.length} links
                    </span>
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="text-primary hover:underline font-medium"
                        >
                            Reset filter
                        </button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
