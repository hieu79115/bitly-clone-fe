import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Loader2,
    Check,
    X,
} from 'lucide-react';
import { useAdminStats, useUpdateUrlStatus } from '../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { getDomain, getFaviconUrl } from '@/lib/utils';

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const { data: stats, isLoading } = useAdminStats();
    const updateUrlStatusMutation = useUpdateUrlStatus();

    const recentUsers = stats?.recentUsers || [];
    const recentUrls = stats?.recentUrls || [];

    const handleToggleUrl = (urlId: number, currentActive: boolean) => {
        updateUrlStatusMutation.mutate({ urlId, isActive: !currentActive });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Overview</h1>
                    <p className="text-xs text-slate-500 mt-0.5">System metrics and recent activity</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Total Users */}
                <div
                    onClick={() => navigate('/admin/users')}
                    className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
                >
                    <span className="text-xs text-slate-400 font-medium block">Users</span>
                    <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                        {isLoading ? (
                            <Loader2 className="size-4 animate-spin text-slate-400" />
                        ) : (
                            (stats?.totalUsers ?? 0).toLocaleString()
                        )}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                        {stats?.activeUsers ?? 0} active
                    </span>
                </div>

                {/* 2. Total URLs */}
                <div
                    onClick={() => navigate('/admin/links')}
                    className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
                >
                    <span className="text-xs text-slate-400 font-medium block">Links</span>
                    <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                        {isLoading ? (
                            <Loader2 className="size-4 animate-spin text-slate-400" />
                        ) : (
                            (stats?.totalUrls ?? 0).toLocaleString()
                        )}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                        {stats?.activeUrls ?? 0} active
                    </span>
                </div>

                {/* 3. Total Clicks */}
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                    <span className="text-xs text-slate-400 font-medium block">Total Clicks</span>
                    <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                        {isLoading ? (
                            <Loader2 className="size-4 animate-spin text-slate-400" />
                        ) : (
                            (stats?.totalClicks ?? 0).toLocaleString()
                        )}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                        All-time redirects
                    </span>
                </div>

                {/* 4. Total Roles */}
                <div
                    onClick={() => navigate('/admin/roles')}
                    className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
                >
                    <span className="text-xs text-slate-400 font-medium block">Roles</span>
                    <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                        {isLoading ? (
                            <Loader2 className="size-4 animate-spin text-slate-400" />
                        ) : (
                            stats?.totalRoles ?? 0
                        )}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                        Configured roles
                    </span>
                </div>
            </div>

            {/* Recent Activity Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1. Recent Users Widget */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h2 className="text-sm font-semibold text-slate-900">Recent Users</h2>
                        <Link
                            to="/admin/users"
                            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-0.5"
                        >
                            <span>View all</span>
                            <ChevronRight className="size-3" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {recentUsers.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">No users registered yet.</p>
                        ) : (
                            recentUsers.map((u) => {
                                const primaryRole = u.roles?.[0] || 'USER';
                                return (
                                    <div
                                        key={u.id}
                                        className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors px-1 rounded-lg"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-slate-800 truncate">
                                                {u.fullName || u.email.split('@')[0]}
                                            </p>
                                            <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                                {primaryRole}
                                            </span>
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                onClick={() => navigate(`/admin/users/${u.id}`)}
                                                className="h-7 text-xs rounded-lg px-2 text-slate-700"
                                            >
                                                Inspect
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 2. Recent Shortened URLs Widget */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h2 className="text-sm font-semibold text-slate-900">Latest Links</h2>
                        <Link
                            to="/admin/links"
                            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-0.5"
                        >
                            <span>View all</span>
                            <ChevronRight className="size-3" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {recentUrls.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">No links created yet.</p>
                        ) : (
                            recentUrls.map((link) => (
                                <div
                                    key={link.id}
                                    className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors px-1 rounded-lg"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <img
                                            src={getFaviconUrl(link.originalUrl)}
                                            alt=""
                                            className="size-3.5 rounded shrink-0 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLElement).style.display = 'none';
                                            }}
                                        />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-semibold text-slate-900">
                                                    /{link.shortCode}
                                                </span>
                                                <span className="text-[11px] text-slate-400 truncate max-w-36">
                                                    ({getDomain(link.originalUrl)})
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 truncate">
                                                {link.userEmail || 'Anonymous'} • {link.clickCount} clicks
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <span
                                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                                link.isActive
                                                    ? 'text-emerald-700 bg-emerald-50'
                                                    : 'text-rose-700 bg-rose-50'
                                            }`}
                                        >
                                            {link.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                        <Button
                                            size="icon-xs"
                                            variant="ghost"
                                            onClick={() => handleToggleUrl(link.id, link.isActive)}
                                            disabled={updateUrlStatusMutation.isPending}
                                            className="size-7 text-slate-400 hover:text-slate-700"
                                            title={link.isActive ? 'Disable link' : 'Enable link'}
                                        >
                                            {link.isActive ? <X className="size-3" /> : <Check className="size-3" />}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
