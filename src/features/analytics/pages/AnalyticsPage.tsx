import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    MousePointerClick,
    Monitor,
    Smartphone,
    Globe,
    Layers,
    ExternalLink,
    Copy,
    Check,
    ArrowLeft,
    Loader2,
    Calendar,
    Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAnalytics } from '../hooks/useAnalytics';
import { useUrls } from '@/features/links/hooks/useUrls';
import ClicksOverTimeChart from '../components/ClicksOverTimeChart';
import DeviceDonutChart from '../components/DeviceDonutChart';
import BrowserBarChart from '../components/BrowserBarChart';
import OsBarChart from '../components/OsBarChart';
import TopLinksTable from '../components/TopLinksTable';
import SearchableLinkSelector from '../components/SearchableLinkSelector';
import { Button } from '@/components/ui/button';
import { getDomain, getFaviconUrl } from '@/lib/utils';

export default function AnalyticsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const shortCodeParam = searchParams.get('shortCode');
    const selectedShortCode = shortCodeParam || 'all';

    const [days, setDays] = useState<number>(7);
    const [copied, setCopied] = useState(false);

    // Fetch user links for the dropdown selector (first 100 links)
    const { urlsData } = useUrls(0, 100);
    const urls = urlsData?.content || [];

    // Fetch analytics data (Overview or Single Link)
    const { data: analytics, isLoading } = useAnalytics(selectedShortCode, days);

    const isOverview = selectedShortCode === 'all';

    const handleSelectLink = (code: string) => {
        if (code === 'all') {
            searchParams.delete('shortCode');
            setSearchParams(searchParams);
        } else {
            setSearchParams({ shortCode: code });
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    // Calculate Top stats from analytics
    const topDevice = analytics?.clicksByDevice?.length
        ? [...analytics.clicksByDevice].sort((a, b) => b.count - a.count)[0]?.device
        : null;

    const topBrowser = analytics?.clicksByBrowser?.length
        ? [...analytics.clicksByBrowser].sort((a, b) => b.count - a.count)[0]?.browser
        : null;

    const topOs = analytics?.clicksByOs?.length
        ? [...analytics.clicksByOs].sort((a, b) => b.count - a.count)[0]?.os
        : null;

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        {!isOverview && (
                            <button
                                onClick={() => handleSelectLink('all')}
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors mr-1"
                                title="Back to All Links Overview"
                            >
                                <ArrowLeft className="size-5" />
                            </button>
                        )}
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {isOverview ? 'Analytics Overview' : 'Link Analytics'}
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {isOverview
                            ? 'Comprehensive performance metrics and audience behavior across all your links.'
                            : `Deep-dive traffic analysis for /${selectedShortCode}`}
                    </p>
                </div>

                {/* Controls: Link Selector & Time Filter */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Searchable Link Combobox */}
                    <SearchableLinkSelector
                        urls={urls}
                        selectedShortCode={selectedShortCode}
                        onSelect={handleSelectLink}
                    />

                    {/* Time Period Filter */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
                        <button
                            type="button"
                            onClick={() => setDays(7)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                                days === 7
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            7 Days
                        </button>
                        <button
                            type="button"
                            onClick={() => setDays(30)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                                days === 30
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            30 Days
                        </button>
                        <button
                            type="button"
                            onClick={() => setDays(90)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                                days === 90
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            90 Days
                        </button>
                    </div>
                </div>
            </div>

            {/* Single Link Header Banner (if a specific link is inspected) */}
            {!isOverview && analytics && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="size-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                            <img
                                src={getFaviconUrl(analytics.originalUrl || '')}
                                alt="Favicon"
                                className="size-5 object-contain"
                                onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                }}
                            />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                                {analytics.title || getDomain(analytics.originalUrl || '') || analytics.shortCode}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <span className="font-mono text-primary font-semibold">/{analytics.shortCode}</span>
                                <span>•</span>
                                <a
                                    href={analytics.originalUrl || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="truncate hover:underline max-w-xs sm:max-w-md"
                                >
                                    {analytics.originalUrl}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => handleCopy(`http://localhost:8080/${analytics.shortCode}`)}
                        >
                            {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                            <span>{copied ? 'Copied' : 'Copy Link'}</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => window.open(`http://localhost:8080/${analytics.shortCode}`, '_blank')}
                        >
                            <ExternalLink className="size-3.5" />
                            <span>Visit</span>
                        </Button>
                    </div>
                </div>
            )}

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Clicks */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <span>Total Clicks</span>
                        <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <MousePointerClick className="size-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 pt-1">
                        {isLoading ? <Loader2 className="size-5 animate-spin text-slate-400" /> : analytics?.totalClicks ?? 0}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {isOverview ? 'Across all short links' : 'All-time total for this link'}
                    </p>
                </div>

                {/* Top Device */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <span>Top Device</span>
                        <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            {topDevice && topDevice.toLowerCase().includes('mobile') ? (
                                <Smartphone className="size-4" />
                            ) : (
                                <Monitor className="size-4" />
                            )}
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 pt-1">
                        {isLoading ? (
                            <Loader2 className="size-5 animate-spin text-slate-400" />
                        ) : topDevice ? (
                            topDevice
                        ) : (
                            <span className="text-sm font-medium text-slate-400">No data yet</span>
                        )}
                    </div>
                    <p className="text-[11px] text-slate-400">Leading visitor device category</p>
                </div>

                {/* Top Browser */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <span>Top Browser</span>
                        <div className="size-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                            <Globe className="size-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 pt-1 truncate" title={topBrowser || 'No data yet'}>
                        {isLoading ? (
                            <Loader2 className="size-5 animate-spin text-slate-400" />
                        ) : topBrowser ? (
                            topBrowser
                        ) : (
                            <span className="text-sm font-medium text-slate-400">No data yet</span>
                        )}
                    </div>
                    <p className="text-[11px] text-slate-400">Most popular browser used</p>
                </div>

                {/* Top OS */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <span>Top OS</span>
                        <div className="size-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Layers className="size-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 pt-1 truncate" title={topOs || 'No data yet'}>
                        {isLoading ? (
                            <Loader2 className="size-5 animate-spin text-slate-400" />
                        ) : topOs ? (
                            topOs
                        ) : (
                            <span className="text-sm font-medium text-slate-400">No data yet</span>
                        )}
                    </div>
                    <p className="text-[11px] text-slate-400">Primary operating system</p>
                </div>
            </div>

            {/* Row 1: Clicks Over Time (Area Chart) */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base font-bold text-slate-900">Clicks Over Time</h2>
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                Last {days} Days
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Daily click engagement and volume trend
                        </p>
                    </div>

                    <div className="text-right hidden sm:block">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="size-3" />
                            <span>Updated just now</span>
                        </span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-72 flex items-center justify-center">
                        <Loader2 className="size-7 animate-spin text-primary" />
                    </div>
                ) : (
                    <ClicksOverTimeChart data={analytics?.clicksByDate || []} />
                )}
            </div>

            {/* Row 2: Breakdown Grid (Devices, Browsers, OS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Device Breakdown */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Devices</h3>
                        <p className="text-xs text-slate-400">Visitor device distribution</p>
                    </div>
                    {isLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <DeviceDonutChart data={analytics?.clicksByDevice || []} />
                    )}
                </div>

                {/* Browser Breakdown */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Browsers</h3>
                        <p className="text-xs text-slate-400">Top web browsers</p>
                    </div>
                    {isLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <BrowserBarChart data={analytics?.clicksByBrowser || []} />
                    )}
                </div>

                {/* Operating System Breakdown */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Operating Systems</h3>
                        <p className="text-xs text-slate-400">Platforms and environments</p>
                    </div>
                    {isLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <OsBarChart data={analytics?.clicksByOs || []} />
                    )}
                </div>
            </div>

            {/* Row 3: Leaderboard (Top Performing Links - Only in Overview mode) */}
            {isOverview && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                                <Sparkles className="size-4 text-amber-500" />
                                <span>Top Performing Links</span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Your most clicked URLs of all time
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/links')}
                            className="text-xs"
                        >
                            View All Links →
                        </Button>
                    </div>

                    <TopLinksTable
                        urls={analytics?.topUrls || []}
                        onSelectLink={(code) => handleSelectLink(code)}
                    />
                </div>
            )}
        </div>
    );
}
