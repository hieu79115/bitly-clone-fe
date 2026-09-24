import { useState } from 'react';
import { Copy, Check, QrCode, Trash2, ExternalLink, Calendar, MousePointerClick } from 'lucide-react';
import { toast } from 'sonner';
import type { UrlItem } from '../types';
import QrCodeModal from './QrCodeModal';
import { formatDate, formatDateTime } from '@/lib/utils';

interface UrlCardProps {
    url: UrlItem;
    onDelete: (id: number) => void;
}

export default function UrlCard({ url, onDelete }: UrlCardProps) {
    const [copied, setCopied] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url.shortUrl);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Link Information */}
                <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Short URL link */}
                        <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-base text-primary hover:underline flex items-center gap-1.5"
                        >
                            <span>{url.shortUrl}</span>
                            <ExternalLink className="size-3.5 text-slate-400" />
                        </a>

                        {/* Click count badge */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <MousePointerClick className="size-3" />
                            <span>{url.clickCount} clicks</span>
                        </span>

                        {/* Tags */}
                        {url.tags?.map((tag) => (
                            <span
                                key={tag.id}
                                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>

                    {/* Original Destination URL */}
                    <p className="text-xs text-slate-400 truncate max-w-xl" title={url.originalUrl}>
                        {url.originalUrl}
                    </p>

                    {/* Metadata: Created Date & Expiration */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1" title={formatDateTime(url.createdAt)}>
                            <Calendar className="size-3" />
                            {formatDate(url.createdAt)}
                        </span>
                        {url.expiresAt && (
                            <span className="text-amber-600 font-medium" title={formatDateTime(url.expiresAt)}>
                                Expires: {formatDateTime(url.expiresAt)}
                            </span>
                        )}
                    </div>
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
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View QR Code"
                    >
                        <QrCode className="size-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this link?')) {
                                onDelete(url.id);
                            }
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Link"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            </div>

            {/* QR Code Modal */}
            <QrCodeModal
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                shortUrl={url.shortUrl}
                shortCode={url.shortCode}
            />
        </>
    );
}
