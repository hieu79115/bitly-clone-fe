import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Link2,
    MousePointerClick,
    TrendingUp,
    Sparkles,
    Calendar,
    ArrowRight,
    Copy,
    Check,
    QrCode,
    Loader2,
    BarChart3,
    Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { useUrls } from '@/features/links/hooks/useUrls';
import ClicksOverTimeChart from '@/features/analytics/components/ClicksOverTimeChart';
import QrCodeModal from '@/features/links/components/QrCodeModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getDomain, getFaviconUrl } from '@/lib/utils';
import type { UrlItem } from '@/features/links/types';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { data: profile, isLoading: isProfileLoading } = useProfile();
    const { data: analytics, isLoading: isAnalyticsLoading } = useAnalytics('all', 7);
    const { urlsData, isLoadingUrls, createUrl, isCreating } = useUrls(
        0,
        5,
        undefined,
        undefined,
        undefined,
        'createdAt,desc'
    );

    // Quick Shorten state
    const [quickUrl, setQuickUrl] = useState('');
    const [quickAlias, setQuickAlias] = useState('');
    const [showAlias, setShowAlias] = useState(false);
    const [createdItem, setCreatedItem] = useState<UrlItem | null>(null);
    const [copied, setCopied] = useState(false);

    // QR Modal state
    const [qrData, setQrData] = useState<{ shortUrl: string; shortCode: string } | null>(null);

    const recentLinks = urlsData?.content || [];
    const topUrls = analytics?.topUrls || [];

    const handleQuickShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickUrl.trim()) {
            toast.error('Please enter a destination URL');
            return;
        }

        try {
            const newItem = await createUrl({
                originalUrl: quickUrl.trim(),
                customAlias: quickAlias.trim() || undefined,
            });

            setCreatedItem(newItem);
            setQuickUrl('');
            setQuickAlias('');
            setShowAlias(false);
            toast.success('Link shortened successfully!');
        } catch {
            // Handled in useUrls hook
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const userName = profile?.fullName || profile?.email?.split('@')[0] || 'there';

    return (
        <div className="space-y-7 animate-in fade-in duration-200">
            {/* Header: Welcome & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Welcome back, {userName}!
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Here is an overview of your link performance and recent activity.
                    </p>
                </div>
                
            </div>

            {/* Quick Shorten Bar Widget */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/50 p-5 sm:p-6 shadow-xs">
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                                <Sparkles className="size-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Quick URL Shortener</h2>
                                <p className="text-[11px] text-slate-500">
                                    Paste any long link to create an instant short URL
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowAlias(!showAlias)}
                            className="text-xs text-primary hover:underline font-medium transition-colors cursor-pointer"
                        >
                            {showAlias ? 'Hide custom alias' : '+ Custom alias'}
                        </button>
                    </div>

                    <form onSubmit={handleQuickShorten} className="space-y-2.5">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <Link2 className="size-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                                <Input
                                    type="url"
                                    required
                                    value={quickUrl}
                                    onChange={(e) => setQuickUrl(e.target.value)}
                                    placeholder="Paste long link here (e.g. https://example.com/very-long-url-slug)..."
                                    className="pl-9.5 h-10 bg-white text-xs border-slate-200/90 shadow-xs rounded-xl"
                                    disabled={isCreating}
                                />
                            </div>
                            <Button type="submit" disabled={isCreating} className="h-10 px-5 gap-1.5 rounded-xl shadow-xs shrink-0">
                                {isCreating ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>Shortening...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="size-4" />
                                        <span>Shorten URL</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {showAlias && (
                            <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden max-w-sm animate-in fade-in slide-in-from-top-1 duration-150">
                                <span className="bg-slate-50 px-3 py-1.5 text-xs text-slate-500 font-mono border-r border-slate-200 select-none">
                                    localhost:8080/
                                </span>
                                <input
                                    type="text"
                                    value={quickAlias}
                                    onChange={(e) => setQuickAlias(e.target.value)}
                                    placeholder="custom-slug"
                                    className="flex-1 px-3 py-1.5 text-xs outline-none bg-transparent text-slate-700"
                                    disabled={isCreating}
                                />
                            </div>
                        )}
                    </form>

                    {/* Success notification banner after creation */}
                    {createdItem && (
                        <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in zoom-in-98 duration-150">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Check className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-emerald-800">
                                        Your link is ready!
                                    </p>
                                    <a
                                        href={createdItem.shortUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-bold text-primary hover:underline truncate block"
                                    >
                                        {createdItem.shortUrl}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                                <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleCopy(createdItem.shortUrl)}
                                    className="gap-1"
                                >
                                    {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                                    <span>{copied ? 'Copied' : 'Copy'}</span>
                                </Button>
                                <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() =>
                                        setQrData({
                                            shortUrl: createdItem.shortUrl,
                                            shortCode: createdItem.shortCode,
                                        })
                                    }
                                    className="gap-1"
                                >
                                    <QrCode className="size-3" />
                                    <span>QR</span>
                                </Button>
                                <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => navigate(`/analytics?shortCode=${createdItem.shortCode}`)}
                                    className="gap-1"
                                >
                                    <BarChart3 className="size-3" />
                                    <span>Stats</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* KPI Stat Cards (4 Cards Grid) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Links */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Total Links
                        </p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">
                            {isProfileLoading ? (
                                <Loader2 className="size-5 animate-spin text-slate-400" />
                            ) : (
                                profile?.totalUrls ?? 0
                            )}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Active & archived URLs</p>
                    </div>
                    <div className="size-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Link2 className="size-5" />
                    </div>
                </div>

                {/* Total Clicks */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Total Clicks
                        </p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">
                            {isProfileLoading ? (
                                <Loader2 className="size-5 animate-spin text-slate-400" />
                            ) : (
                                profile?.totalClicks ?? 0
                            )}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">All-time visitor clicks</p>
                    </div>
                    <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MousePointerClick className="size-5" />
                    </div>
                </div>

                {/* Avg Clicks / Link */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Avg Clicks / Link
                        </p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">
                            {isProfileLoading ? (
                                <Loader2 className="size-5 animate-spin text-slate-400" />
                            ) : !profile?.totalUrls ? (
                                0
                            ) : (
                                (profile.totalClicks / profile.totalUrls).toFixed(1)
                            )}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Performance index</p>
                    </div>
                    <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <TrendingUp className="size-5" />
                    </div>
                </div>

                {/* 7-Day Click Activity */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Recent 7 Days
                        </p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">
                            {isAnalyticsLoading ? (
                                <Loader2 className="size-5 animate-spin text-slate-400" />
                            ) : (
                                analytics?.totalClicks ?? 0
                            )}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Past week engagement</p>
                    </div>
                    <div className="size-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                        <Calendar className="size-5" />
                    </div>
                </div>
            </div>

            {/* Performance Chart: Clicks Over Time (Last 7 Days) */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base font-bold text-slate-900">Engagement Trend</h2>
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                Last 7 Days
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Daily click volume across all your shortened links
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/analytics')}
                        className="text-xs gap-1 self-start sm:self-auto shrink-0 -ml-2 sm:ml-0"
                    >
                        <span>Full Analytics</span>
                        <ArrowRight className="size-3.5" />
                    </Button>
                </div>

                {isAnalyticsLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="size-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <ClicksOverTimeChart data={analytics?.clicksByDate || []} />
                )}
            </div>

            {/* Two-Column Section: Recent Links & Top Performing Links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left (2 cols): Recent Links */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Clock className="size-4 text-slate-500" />
                                <span>Recent Links</span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Your latest shortened URLs and their quick stats
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/links')}
                            className="text-xs gap-1"
                        >
                            <span>View All Links</span>
                            <ArrowRight className="size-3.5" />
                        </Button>
                    </div>

                    {isLoadingUrls ? (
                        <div className="p-6 space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : recentLinks.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {recentLinks.map((link) => {
                                const domain = getDomain(link.originalUrl);
                                const title = link.title || domain || link.shortCode;

                                return (
                                    <div
                                        key={link.id}
                                        className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="size-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                                <img
                                                    src={getFaviconUrl(link.originalUrl)}
                                                    alt=""
                                                    className="size-4.5 object-contain"
                                                    onError={(e) => {
                                                        (e.target as HTMLElement).style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                                                        {title}
                                                    </h4>
                                                    <span className="font-mono text-[11px] font-semibold text-primary">
                                                        /{link.shortCode}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 truncate max-w-md mt-0.5">
                                                    {link.originalUrl}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                <MousePointerClick className="size-3" />
                                                <span>{link.clickCount}</span>
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => handleCopy(link.shortUrl)}
                                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Copy short URL"
                                            >
                                                <Copy className="size-3.5" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setQrData({
                                                        shortUrl: link.shortUrl,
                                                        shortCode: link.shortCode,
                                                    })
                                                }
                                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block"
                                                title="Show QR Code"
                                            >
                                                <QrCode className="size-3.5" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => navigate(`/analytics?shortCode=${link.shortCode}`)}
                                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="View Analytics"
                                            >
                                                <BarChart3 className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-xs text-slate-400">
                            No links created yet. Use the shortener above to get started!
                        </div>
                    )}
                </div>

                {/* Right (1 col): Top Performing Links Leaderboard */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                                <Sparkles className="size-4 text-amber-500" />
                                <span>Top Links</span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Most clicked URLs of all time
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/analytics')}
                            className="text-xs"
                        >
                            Leaderboard →
                        </Button>
                    </div>

                    <div className="p-4 flex-1">
                        {isAnalyticsLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : topUrls.length > 0 ? (
                            <div className="space-y-2.5">
                                {topUrls.slice(0, 5).map((top, idx) => {
                                    const rankBadges = [
                                        'bg-amber-100 text-amber-800 border-amber-200',
                                        'bg-slate-200 text-slate-700 border-slate-300',
                                        'bg-amber-50 text-amber-700 border-amber-200',
                                    ];
                                    const badgeClass =
                                        idx < 3
                                            ? rankBadges[idx]
                                            : 'bg-slate-100 text-slate-600 border-slate-200';

                                    return (
                                        <div
                                            key={top.id}
                                            onClick={() => navigate(`/analytics?shortCode=${top.shortCode}`)}
                                            className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span
                                                    className={`size-6 rounded-lg flex items-center justify-center text-[11px] font-bold border shrink-0 ${badgeClass}`}
                                                >
                                                    {idx + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-xs text-slate-800 truncate group-hover:text-primary transition-colors">
                                                        {top.title || top.shortCode}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-mono">
                                                        /{top.shortCode}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <span className="text-xs font-bold text-slate-900">
                                                    {top.clickCount}
                                                </span>
                                                <span className="text-[10px] text-slate-400 block">
                                                    clicks
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-44 flex items-center justify-center text-xs text-slate-400 text-center">
                                No link clicks recorded yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            {qrData && (
                <QrCodeModal
                    isOpen={Boolean(qrData)}
                    onClose={() => setQrData(null)}
                    shortUrl={qrData.shortUrl}
                    shortCode={qrData.shortCode}
                />
            )}
        </div>
    );
}
