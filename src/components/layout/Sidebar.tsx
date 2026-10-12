import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Link2, BarChart3, Settings, QrCode, X, Shield, Users, Globe, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface SidebarProps {
    onCloseMobile?: () => void;
}

const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Links', path: '/links', icon: Link2 },
    { label: 'QR Codes', path: '/qr-codes', icon: QrCode },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
];

const adminNavItems = [
    { label: 'Admin Overview', path: '/admin', icon: Shield },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Links Moderation', path: '/admin/links', icon: Globe },
    { label: 'Roles & Matrix', path: '/admin/roles', icon: KeyRound },
];

export default function Sidebar({ onCloseMobile }: SidebarProps) {
    const isAdmin = useAuthStore((state) => state.isAdmin());

    return (
        <aside className="w-64 h-full bg-white border-r border-slate-200/80 flex flex-col justify-between overflow-y-auto">
            {/* Top: Logo & Nav items */}
            <div>
                {/* Brand Header */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
                    <NavLink to="/dashboard" className="flex items-center gap-2.5 font-bold text-slate-900 text-lg tracking-tight">
                        <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
                            <Link2 className="size-5" />
                        </div>
                        <span>Shortener</span>
                    </NavLink>

                    {/* Close button for Mobile drawer */}
                    {onCloseMobile && (
                        <button
                            onClick={onCloseMobile}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
                        >
                            <X className="size-5" />
                        </button>
                    )}
                </div>

                {/* Navigation links */}
                <nav className="p-4 space-y-1.5">
                    <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Main</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
                                onClick={onCloseMobile}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`
                                }
                            >
                                <Icon className="size-4 shrink-0" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}

                    {isAdmin && (
                        <>
                            <div className="pt-4 pb-1 px-3">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Admin
                                </p>
                            </div>
                            {adminNavItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === '/admin'}
                                        onClick={onCloseMobile}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${isActive
                                                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                            }`
                                        }
                                    >
                                        <Icon className="size-4 shrink-0" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </>
                    )}
                </nav>
            </div>

            {/* Bottom Footer Info */}
            <div className="p-4 m-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                <p className="font-semibold text-slate-700">Shortener v1.0</p>
                <p className="text-[11px] text-slate-400 mt-0.5">High Performance Shortener</p>
            </div>
        </aside>
    );
}
