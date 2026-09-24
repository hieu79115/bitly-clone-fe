import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Link2, ChevronLeft, ChevronRight, Filter, RotateCcw } from 'lucide-react';
import { useUrls } from '../hooks/useUrls';
import UrlCard from '../components/UrlCard';
import CreateUrlModal from '../components/CreateUrlModal';
import { Button } from '@/components/ui/button';

export default function LinksPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(0);
    const [selectedTagId, setSelectedTagId] = useState<number | undefined>(undefined);

    const isCreateOpen = searchParams.get('action') === 'create';
    const setIsCreateOpen = (open: boolean) => {
        if (open) {
            searchParams.set('action', 'create');
        } else {
            searchParams.delete('action');
        }
        setSearchParams(searchParams);
    };

    const { urlsData, isLoadingUrls, tags, deleteUrl, refetchUrls, isRefetching } = useUrls(page, 10, selectedTagId);

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
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-sm">
                        <Plus className="size-4" />
                        <span>Create link</span>
                    </Button>
                </div>
            </div>

            {/* Tag Filter Bar */}
            {tags.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 mr-1 select-none">
                        <Filter className="size-3.5" />
                        <span>Filter:</span>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedTagId(undefined);
                            setPage(0);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${selectedTagId === undefined
                                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        All
                    </button>
                    {tags.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => {
                                setSelectedTagId(tag.id);
                                setPage(0);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${selectedTagId === tag.id
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
            ) : urlsData?.content && urlsData.content.length > 0 ? (
                <div className="space-y-3">
                    {urlsData.content.map((url) => (
                        <UrlCard key={url.id} url={url} onDelete={deleteUrl} />
                    ))}

                    {/* Pagination Controls */}
                    {urlsData.totalPages > 1 && (
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
            ) : (
                /* Empty State */
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
        </div>
    );
}
