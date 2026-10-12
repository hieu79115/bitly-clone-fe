import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Loader2,
    Copy,
    ExternalLink,
    Trash2,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Check,
} from 'lucide-react';
import {
    useAdminUrls,
    useAdminStats,
    useUpdateUrlStatus,
    useDeleteUrlByAdmin,
} from '../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import type { AdminUrl } from '../types';

export default function AdminUrlsPage() {
    const navigate = useNavigate();

    // Filters & Pagination
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const isActiveFilter = selectedStatus === 'all' ? undefined : selectedStatus === 'active';

    const { data: urlsData, isLoading, refetch, isRefetching } = useAdminUrls(
        page,
        10,
        debouncedSearch,
        isActiveFilter
    );

    const { data: stats } = useAdminStats();
    const updateUrlStatusMutation = useUpdateUrlStatus();
    const deleteUrlMutation = useDeleteUrlByAdmin();

    // Modals
    const [actionUrl, setActionUrl] = useState<AdminUrl | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [deleteModalUrl, setDeleteModalUrl] = useState<AdminUrl | null>(null);

    const handleCopy = (url: string, id: number) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        toast.success('Copied link');
        setTimeout(() => setCopiedId(null), 1500);
    };

    const handleConfirmStatusChange = () => {
        if (!actionUrl) return;
        updateUrlStatusMutation.mutate(
            { urlId: actionUrl.id, isActive: !actionUrl.isActive },
            {
                onSettled: () => setIsStatusDialogOpen(false),
            }
        );
    };

    const handleConfirmDelete = () => {
        if (!deleteModalUrl) return;
        deleteUrlMutation.mutate(deleteModalUrl.id, {
            onSettled: () => setDeleteModalUrl(null),
        });
    };

    const urls = urlsData?.content || [];
    const totalPages = urlsData?.totalPages || 0;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Links</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Global link moderation</p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    className="h-8 text-xs rounded-xl border-slate-200 text-slate-700 gap-1.5"
                >
                    <RotateCcw className={`size-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </Button>
            </div>

            {/* Subtle Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-medium block">Total Links</span>
                    <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                        {(urlsData?.totalElements ?? stats?.totalUrls ?? 0).toLocaleString()}
                    </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-medium block">Active</span>
                    <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                        {(stats?.activeUrls ?? 0).toLocaleString()}
                    </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-medium block">Disabled</span>
                    <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                        {(stats?.disabledUrls ?? 0).toLocaleString()}
                    </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <span className="text-[11px] text-slate-400 font-medium block">Total Clicks</span>
                    <span className="text-lg font-bold text-slate-900 mt-0.5 block">
                        {(stats?.totalClicks ?? 0).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by slug or target URL..."
                        className="pl-8 h-8 text-xs rounded-lg bg-slate-50 border-slate-200"
                    />
                </div>

                <select
                    value={selectedStatus}
                    onChange={(e) => {
                        setSelectedStatus(e.target.value);
                        setPage(0);
                    }}
                    className="h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 cursor-pointer"
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                </select>
            </div>

            {/* Links Table */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold text-[11px]">
                            <tr>
                                <th className="py-2.5 px-4">Link</th>
                                <th className="py-2.5 px-4">Creator</th>
                                <th className="py-2.5 px-4">Status</th>
                                <th className="py-2.5 px-4 text-center">Clicks</th>
                                <th className="py-2.5 px-4">Created</th>
                                <th className="py-2.5 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-400">
                                        <Loader2 className="size-5 animate-spin mx-auto mb-2 text-slate-400" />
                                        <span>Loading...</span>
                                    </td>
                                </tr>
                            ) : urls.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-400">
                                        No links found.
                                    </td>
                                </tr>
                            ) : (
                                urls.map((url) => (
                                    <tr key={url.id} className="hover:bg-slate-50/70 transition-colors">
                                        {/* Short Link & Target */}
                                        <td className="py-2.5 px-4 max-w-sm">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-semibold text-slate-900">
                                                    /{url.shortCode}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(url.shortUrl, url.id)}
                                                    className="text-slate-400 hover:text-slate-700 p-0.5"
                                                    title="Copy link"
                                                >
                                                    {copiedId === url.id ? (
                                                        <Check className="size-3 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="size-3" />
                                                    )}
                                                </button>
                                                <a
                                                    href={url.shortUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-slate-400 hover:text-slate-700 p-0.5"
                                                    title="Open"
                                                >
                                                    <ExternalLink className="size-3" />
                                                </a>
                                            </div>
                                            <div className="text-[11px] text-slate-400 truncate mt-0.5" title={url.originalUrl}>
                                                {url.originalUrl}
                                            </div>
                                        </td>

                                        {/* Owner */}
                                        <td className="py-2.5 px-4 text-slate-700 whitespace-nowrap">
                                            {url.userId ? (
                                                <button
                                                    onClick={() => navigate(`/admin/users/${url.userId}`)}
                                                    className="text-xs text-slate-700 hover:text-slate-900 hover:underline truncate max-w-44 block"
                                                >
                                                    {url.userEmail || `User #${url.userId}`}
                                                </button>
                                            ) : (
                                                <span className="text-slate-400 italic text-[11px]">
                                                    {url.userEmail || 'Anonymous'}
                                                </span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="py-2.5 px-4 whitespace-nowrap">
                                            <span
                                                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                                    url.isActive
                                                        ? 'text-emerald-700 bg-emerald-50'
                                                        : 'text-rose-700 bg-rose-50'
                                                }`}
                                            >
                                                {url.isActive ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>

                                        {/* Clicks */}
                                        <td className="py-2.5 px-4 text-center font-medium text-slate-700">
                                            {url.clickCount.toLocaleString()}
                                        </td>

                                        {/* Date */}
                                        <td className="py-2.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                                            {format(parseISO(url.createdAt), 'dd/MM/yyyy')}
                                        </td>

                                        {/* Action */}
                                        <td className="py-2.5 px-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    size="xs"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setActionUrl(url);
                                                        setIsStatusDialogOpen(true);
                                                    }}
                                                    className="h-7 text-xs rounded-lg px-2 text-slate-700"
                                                >
                                                    {url.isActive ? 'Disable' : 'Enable'}
                                                </Button>

                                                <Button
                                                    size="icon-xs"
                                                    variant="ghost"
                                                    onClick={() => setDeleteModalUrl(url)}
                                                    className="text-slate-400 hover:text-rose-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                        <span>
                            Page {page + 1} of {totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                size="xs"
                                variant="outline"
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="h-7 px-2"
                            >
                                <ChevronLeft className="size-3.5" />
                            </Button>
                            <Button
                                size="xs"
                                variant="outline"
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="h-7 px-2"
                            >
                                <ChevronRight className="size-3.5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Dialogs */}
            <ConfirmDialog
                isOpen={isStatusDialogOpen}
                onClose={() => setIsStatusDialogOpen(false)}
                onConfirm={handleConfirmStatusChange}
                title={actionUrl?.isActive ? 'Disable link?' : 'Enable link?'}
                description={actionUrl ? `/${actionUrl.shortCode}` : ''}
                confirmText={actionUrl?.isActive ? 'Disable' : 'Enable'}
                variant={actionUrl?.isActive ? 'destructive' : 'default'}
                isLoading={updateUrlStatusMutation.isPending}
            />

            <ConfirmDialog
                isOpen={!!deleteModalUrl}
                onClose={() => setDeleteModalUrl(null)}
                onConfirm={handleConfirmDelete}
                title="Delete link?"
                description={`/${deleteModalUrl?.shortCode}`}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteUrlMutation.isPending}
            />
        </div>
    );
}
