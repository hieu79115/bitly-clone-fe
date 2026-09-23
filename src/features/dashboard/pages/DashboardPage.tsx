import { useProfile } from '@/features/profile/hooks/useProfile';
import { Link2, MousePointerClick, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    const { data: profile, isLoading } = useProfile();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Welcome back, {profile?.fullName || profile?.email?.split('@')[0] || 'there'}!
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Here is a quick snapshot of your link shortener performance.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Links</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {isLoading ? '...' : profile?.totalUrls ?? 0}
                        </p>
                    </div>
                    <div className="size-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Link2 className="size-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Clicks</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {isLoading ? '...' : profile?.totalClicks ?? 0}
                        </p>
                    </div>
                    <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <MousePointerClick className="size-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Clicks / Link</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {isLoading || !profile?.totalUrls
                                ? 0
                                : (profile.totalClicks / profile.totalUrls).toFixed(1)}
                        </p>
                    </div>
                    <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <TrendingUp className="size-5" />
                    </div>
                </div>
            </div>
        </div>
    );
}
