import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuthStore } from '@/stores/authStore';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();
    const { data: profile } = useProfile();
    const fallbackUser = useAuthStore((state) => state.user);
    const isAdmin = useAuthStore((state) => state.isAdmin());

    const email = profile?.email || fallbackUser?.email || 'User';
    const displayName = profile?.fullName || email.split('@')[0];
    const initial = displayName.charAt(0).toUpperCase();

    const roles = profile?.roles || fallbackUser?.roles || (fallbackUser?.role ? [fallbackUser.role] : ['USER']);
    const primaryRole = roles.includes('SUPER_ADMIN')
        ? 'SUPER_ADMIN'
        : roles.includes('ADMIN')
        ? 'ADMIN'
        : roles.includes('MODERATOR')
        ? 'MODERATOR'
        : roles[0] || 'USER';

    const hasPermission = useAuthStore((state) => state.hasPermission);
    const adminTarget = hasPermission('ANALYTICS_READ')
        ? '/admin'
        : hasPermission('USER_READ')
        ? '/admin/users'
        : hasPermission('URL_READ')
        ? '/admin/links'
        : hasPermission('ROLE_READ')
        ? '/admin/roles'
        : '/admin';

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
            >
                <div className="size-8 rounded-full bg-slate-900 text-white font-semibold flex items-center justify-center text-sm shadow-xs shrink-0 overflow-hidden relative">
                    {profile?.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt={displayName}
                            className="size-full object-cover absolute inset-0"
                            onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                            }}
                        />
                    ) : null}
                    <span>{initial}</span>
                </div>
                <div className="hidden sm:block">
                    <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-slate-800 leading-none">{displayName}</p>
                        {primaryRole !== 'USER' && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
                                {primaryRole.replace('_', ' ')}
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-30">{email}</p>
                </div>
                <ChevronDown className={`size-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-medium text-slate-500">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{email}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                            {roles.map((r) => (
                                <span
                                    key={r}
                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        r === 'SUPER_ADMIN'
                                            ? 'bg-red-100 text-red-700'
                                            : r === 'ADMIN'
                                            ? 'bg-purple-100 text-purple-700'
                                            : r === 'MODERATOR'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                    {r}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="py-1">
                        {isAdmin && (
                            <Link
                                to={adminTarget}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 font-medium transition-colors"
                            >
                                <ShieldCheck className="size-4 text-purple-600" />
                                <span>Admin Portal</span>
                            </Link>
                        )}
                        <Link
                            to="/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                            <Settings className="size-4 text-slate-400" />
                            <span>Account Settings</span>
                        </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                logout();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                        >
                            <LogOut className="size-4 text-red-500" />
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
