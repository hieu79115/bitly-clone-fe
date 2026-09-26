import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuthStore } from '@/stores/authStore';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();
    const { data: profile } = useProfile();
    const fallbackUser = useAuthStore((state) => state.user);

    const email = profile?.email || fallbackUser?.email || 'User';
    const displayName = profile?.fullName || email.split('@')[0];
    const initial = displayName.charAt(0).toUpperCase();

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
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
            >
                {profile?.avatarUrl ? (
                    <img
                        src={profile.avatarUrl}
                        alt={displayName}
                        className="size-8 rounded-full object-cover border border-slate-200"
                    />
                ) : (
                    <div className="size-8 rounded-full bg-slate-900 text-white font-semibold flex items-center justify-center text-sm shadow-xs">
                        {initial}
                    </div>
                )}
                <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-30">{email}</p>
                </div>
                <ChevronDown className={`size-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-medium text-slate-500">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{email}</p>
                    </div>

                    <div className="py-1">
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
