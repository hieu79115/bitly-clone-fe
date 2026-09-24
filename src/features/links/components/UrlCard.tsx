import { useState } from 'react';
import {
    Copy,
    Check,
    QrCode,
    Trash2,
    ExternalLink,
    Calendar,
    MousePointerClick,
    Pencil,
    AlertTriangle,
    Clock,
    Infinity as InfinityIcon,
    Globe,
    CornerDownRight,
} from 'lucide-react';
import { toast } from 'sonner';
import type { UrlItem } from '../types';
import QrCodeModal from './QrCodeModal';
import EditUrlModal from './EditUrlModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn, formatDate, formatDateTime, isDateExpired, getDomain, getFaviconUrl } from '@/lib/utils';

interface UrlCardProps {
    url: UrlItem;
    onDelete: (id: number) => void;
}

export default function UrlCard({ url, onDelete }: UrlCardProps) {
    const [copied, setCopied] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [hasFaviconError, setHasFaviconError] = useState(false);

    const isExpired = isDateExpired(url.expiresAt);
    const domain = getDomain(url.originalUrl);
    const faviconUrl = getFaviconUrl(url.originalUrl);
    const displayTitle = url.title?.trim() || domain || url.originalUrl;

    const handleCopy = () => {
        navigator.clipboard.writeText(url.shortUrl);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div
                className={cn(
                    "p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all space-y-3.5",
                    isExpired
                        ? "bg-rose-50/20 border-rose-200/80"
                        : "bg-white border-slate-200/80"
                )}
            >
                {/* Header: Favicon + Title on the left, Badges on the right */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-8 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                            {!hasFaviconError ? (
                                <img
                                    src={faviconUrl}
                                    alt={domain}
                                    className="size-4.5 object-contain"
                                    onError={() => setHasFaviconError(true)}
                                />
                            ) : (
                                <Globe className="size-4 text-slate-400" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3
                                className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-sm sm:max-w-md lg:max-w-lg"
                                title={displayTitle}
                            >
                                {displayTitle}
                            </h3>
                        </div>
                    </div>

                    {/* Status & Click Badges */}
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <MousePointerClick className="size-3" />
                            <span>{url.clickCount} clicks</span>
                        </span>

                        {isExpired ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertTriangle className="size-3" />
                                <span>Expired</span>
                            </span>
                        ) : url.expiresAt ? (
                            <span
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
                                title={`Expires: ${formatDateTime(url.expiresAt)}`}
                            >
                                <Clock className="size-3" />
                                <span>Active</span>
                            </span>
                        ) : null}
                    </div>
                </div>

                {/* Middle: Short URL and Destination URL */}
                <div className="space-y-1 pl-10.5">
                    {/* Short URL */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-sm sm:text-base text-primary hover:underline flex items-center gap-1.5"
                        >
                            <span>{url.shortUrl}</span>
                            <ExternalLink className="size-3.5 text-slate-400" />
                        </a>
                    </div>

                    {/* Original Destination URL */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
                        <CornerDownRight className="size-3 text-slate-400 shrink-0" />
                        <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate hover:text-slate-800 hover:underline max-w-xl"
                            title={url.originalUrl}
                        >
                            {url.originalUrl}
                        </a>
                    </div>
                </div>

                {/* Footer: Tags, Dates & Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-1 sm:pl-10.5">
                    {/* Left: Tags & Timestamps */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Tags */}
                        {url.tags?.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                                {url.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Created Date */}
                        <span className="flex items-center gap-1 text-[11px] text-slate-400" title={formatDateTime(url.createdAt)}>
                            <Calendar className="size-3" />
                            <span>Created: {formatDate(url.createdAt)}</span>
                        </span>

                        {/* Expiration info */}
                        {url.expiresAt ? (
                            <span
                                className={cn(
                                    "flex items-center gap-1 text-[11px] font-medium",
                                    isExpired ? "text-rose-600 font-semibold" : "text-amber-600"
                                )}
                                title={formatDateTime(url.expiresAt)}
                            >
                                <Clock className="size-3" />
                                <span>
                                    {isExpired ? 'Expired on: ' : 'Expires: '}
                                    {formatDateTime(url.expiresAt)}
                                </span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                <InfinityIcon className="size-3" />
                                <span>Never expires</span>
                            </span>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {/* Copy Button */}
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                            {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>

                        {/* QR Code Button */}
                        <button
                            onClick={() => setShowQrModal(true)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View QR Code"
                        >
                            <QrCode className="size-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Link"
                        >
                            <Pencil className="size-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Link"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            <QrCodeModal
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                shortUrl={url.shortUrl}
                shortCode={url.shortCode}
            />

            {/* Edit URL Modal */}
            {showEditModal && (
                <EditUrlModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    url={url}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={() => {
                    onDelete(url.id);
                    setShowDeleteConfirm(false);
                }}
                title="Delete Short Link"
                description={`Are you sure you want to delete "${displayTitle}" (/${url.shortCode})? This will immediately stop redirection and deactivate the link.`}
                confirmText="Delete Link"
                variant="destructive"
            />
        </>
    );
}
