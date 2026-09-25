import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Plus,
    Link2,
    ChevronLeft,
    ChevronRight,
    Filter,
    RotateCcw,
    Tag as TagIcon,
    Search,
    X,
    ArrowUpDown,
} from 'lucide-react';
import { useUrls } from '../hooks/useUrls';
import UrlCard from '../components/UrlCard';
import CreateUrlModal from '../components/CreateUrlModal';
import ManageTagsModal from '../components/ManageTagsModal';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function LinksPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(0);
    const [selectedTagId, setSelectedTagId] = useState<number | undefined>(undefined);
    const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);

    // Search, Status, and Sort states (Server-side)
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
    const [sortBy, setSortBy] = useState<string>('createdAt,desc');

    // Debounce search query to prevent excessive API requests
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(0); // Reset to first page when search changes
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const isCreateOpen = searchParams.get('action') === 'create';
    const setIsCreateOpen = (open: boolean) => {
        if (open) {
            searchParams.set('action', 'create');
        } else {
            searchParams.delete('action');
        }
        setSearchParams(searchParams);
    };

    // Server-side query with pagination, tagId, search, status, and sort
    const { urlsData, isLoadingUrls, tags, deleteUrl, refetchUrls, isRefetching } = useUrls(
        page,
        10,
        selectedTagId,
        debouncedSearch,
        statusFilter,
        sortBy
    );

    const urls = urlsData?.content || [];
    const hasActiveFilters = Boolean(
        debouncedSearch.trim() || statusFilter !== 'all' || selectedTagId !== undefined
    );

    const handleClearFilters = () => {
        setSearchQuery('');
        setDebouncedSearch('');
        setStatusFilter('all');
        setSelectedTagId(undefined);
        setPage(0);
    };

    return (
        <div className="space-y-6">
            {/* Header: Title & Create Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Links</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage and track your shortened URLs</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetchUrls()}
                        disabled={isRefetching}
                        className="gap-1.5"
                        title="Refresh link list"
                    >
                        <RotateCcw className={`size-4 ${isRefetching ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsManageTagsOpen(true)}
                        className="gap-1.5"
                        title="Manage tags"
                    >
                        <TagIcon className="size-4 text-slate-500" />
                        <span className="hidden sm:inline">Manage Tags</span>
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-sm">
                        <Plus className="size-4" />
                        <span>Create link</span>
                    </Button>
                </div>
            </div>

            {/* Controls Bar: Search, Status Filter & Sort Dropdown */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="size-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search across all links by title, code or URL..."
                        className="w-full h-9 pl-9 pr-8 text-xs rounded-xl border border-slate-200 bg-white shadow-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 placeholder:text-slate-400 transition-all"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                            title="Clear search"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Right: Status Filters & Sort Dropdown */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Filter: All / Active / Expired */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
                        <button
                            type="button"
                            onClick={() => {
                                setStatusFilter('all');
                                setPage(0);
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                statusFilter === 'all'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setStatusFilter('active');
                                setPage(0);
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                                statusFilter === 'active'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <span className="size-2 rounded-full bg-emerald-500" />
                            <span>Active</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setStatusFilter('expired');
                                setPage(0);
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                                statusFilter === 'expired'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <span className="size-2 rounded-full bg-rose-500" />
                            <span>Expired</span>
                        </button>
                    </div>

                    {/* Shadcn Select Sort */}
                    <div className="w-40 sm:w-44">
                        <Select
                            value={sortBy}
                            onValueChange={(val) => {
                                if (val) {
                                    setSortBy(val as string);
                                    setPage(0);
                                }
                            }}
                        >
                            <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs">
                                <div className="flex items-center gap-1.5 truncate">
                                    <ArrowUpDown className="size-3 text-slate-400 shrink-0" />
                                    <SelectValue placeholder="Sort by" />
                                </div>
                            </SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="createdAt,desc">Newest created</SelectItem>
                                <SelectItem value="createdAt,asc">Oldest created</SelectItem>
                                <SelectItem value="clickCount,desc">Most clicks</SelectItem>
                                <SelectItem value="clickCount,asc">Least clicks</SelectItem>
                                <SelectItem value="title,asc">Title (A-Z)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Tag Filter Bar */}
            {tags.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 mr-1 select-none">
                        <Filter className="size-3.5" />
                        <span>Tags:</span>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedTagId(undefined);
                            setPage(0);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            selectedTagId === undefined
                                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        All Tags
                    </button>
                    {tags.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => {
                                setSelectedTagId(tag.id);
                                setPage(0);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                selectedTagId === tag.id
                                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            #{tag.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Link List */}
            {isLoadingUrls ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : urls.length > 0 ? (
                <div className="space-y-3">
                    {urls.map((url) => (
                        <UrlCard key={url.id} url={url} onDelete={deleteUrl} />
                    ))}

                    {/* Pagination Controls */}
                    {urlsData && urlsData.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
                            <p className="text-xs text-slate-500">
                                Page <span className="font-semibold">{urlsData.number + 1}</span> of{' '}
                                <span className="font-semibold">{urlsData.totalPages}</span> ({urlsData.totalElements} links)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                                    disabled={urlsData.first}
                                    className="gap-1"
                                >
                                    <ChevronLeft className="size-4" />
                                    <span>Previous</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={urlsData.last}
                                    className="gap-1"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : hasActiveFilters ? (
                /* Filter / Search Empty State */
                <div className="bg-white p-10 rounded-2xl border border-slate-200/80 text-center space-y-3">
                    <div className="size-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Search className="size-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-base">No links match your criteria</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            We couldn&apos;t find any links matching your search term or selected filters across your account.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-xs"
                    >
                        Clear all filters
                    </Button>
                </div>
            ) : (
                /* Empty State when user has zero links in account */
                <div className="p-12 text-center max-w-lg mx-auto my-8">
                    <div className="size-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                        <Link2 className="size-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No links created yet</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                        Create your first shortened URL to track clicks and share with your audience.
                    </p>
                    <Button onClick={() => setIsCreateOpen(true)} className="mt-5 gap-2">
                        <Plus className="size-4" />
                        <span>Create your first link</span>
                    </Button>
                </div>
            )}

            {/* Create Link Modal */}
            <CreateUrlModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

            {/* Manage Tags Modal */}
            <ManageTagsModal isOpen={isManageTagsOpen} onClose={() => setIsManageTagsOpen(false)} />
        </div>
    );
}
