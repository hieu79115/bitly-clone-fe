import { useProfile } from '../hooks/useProfile';

export default function SettingsPage() {
    const { data: profile } = useProfile();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-xl space-y-4">
                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Email Address</label>
                    <p className="text-base font-medium text-slate-800">{profile?.email || 'Loading...'}</p>
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Member Since</label>
                    <p className="text-sm text-slate-600">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
}
