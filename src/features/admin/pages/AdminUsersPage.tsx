import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Search,
    Loader2,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
} from 'lucide-react';
import { useAdminUsers, useAdminRoles } from '../hooks/useAdmin';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format, parseISO } from 'date-fns';

export default function AdminUsersPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentUser = useAuthStore((state) => state.user);

    // Redirect legacy ?inspectId=123 to /admin/users/:id
    useEffect(() => {
        const inspectIdParam = searchParams.get('inspectId');
        if (inspectIdParam) {
            navigate(`/admin/users/${inspectIdParam}`, { replace: true });
        }
    }, [searchParams, navigate]);

    // Table Filters & Pagination
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const isActiveFilter = selectedStatus === 'all' ? undefined : selectedStatus === 'active';

    const { data: usersData, isLoading, refetch, isRefetching } = useAdminUsers(
        page,
        10,
        debouncedSearch,
        selectedRole === 'all' ? undefined : selectedRole,
        isActiveFilter
    );

    const { data: availableRoles } = useAdminRoles();

    const users = usersData?.content || [];
    const totalPages = usersData?.totalPages || 0;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Users</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage user accounts and roles</p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    className="gap-1.5 h-8 text-xs rounded-xl border-slate-200 text-slate-700"
                >
                    <RotateCcw className={`size-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="pl-8 h-8 text-xs rounded-lg bg-slate-50 border-slate-200"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={selectedRole}
                        onValueChange={(val) => {
                            if (val) {
                                setSelectedRole(val as string);
                                setPage(0);
                            }
                        }}
                    >
                        <SelectTrigger className="h-8 px-2.5 rounded-lg border-slate-200 bg-slate-50 text-xs text-slate-700 min-w-32">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="all">All Roles</SelectItem>
                            {availableRoles?.map((r) => (
                                <SelectItem key={r.id} value={r.name}>
                                    {r.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedStatus}
                        onValueChange={(val) => {
                            if (val) {
                                setSelectedStatus(val as 'all' | 'active' | 'suspended');
                                setPage(0);
                            }
                        }}
                    >
                        <SelectTrigger className="h-8 px-2.5 rounded-lg border-slate-200 bg-slate-50 text-xs text-slate-700 min-w-28">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold text-[11px]">
                            <tr>
                                <th className="py-2.5 px-4">User</th>
                                <th className="py-2.5 px-4">Roles</th>
                                <th className="py-2.5 px-4">Status</th>
                                <th className="py-2.5 px-4 text-center">Links</th>
                                <th className="py-2.5 px-4 text-center">Clicks</th>
                                <th className="py-2.5 px-4">Created</th>
                                <th className="py-2.5 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 text-slate-400">
                                        <Loader2 className="size-5 animate-spin mx-auto mb-2 text-slate-400" />
                                        <span>Loading...</span>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 text-slate-400">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const isSelf = currentUser?.email?.toLowerCase() === user.email.toLowerCase();

                                    return (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/admin/users/${user.id}`)}
                                        >
                                            {/* User Info without dummy avatar */}
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-medium text-slate-900 truncate">
                                                        {user.fullName || user.email.split('@')[0]}
                                                    </span>
                                                    {isSelf && (
                                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                                            </td>

                                            {/* Roles */}
                                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles && user.roles.length > 0 ? (
                                                        user.roles.map((r) => (
                                                            <span
                                                                key={r}
                                                                className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                                                                    r === 'ADMIN' || r === 'SUPER_ADMIN'
                                                                        ? 'bg-slate-900 text-white'
                                                                        : 'bg-slate-100 text-slate-700'
                                                                }`}
                                                            >
                                                                {r}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                                        user.isActive
                                                            ? 'text-emerald-700 bg-emerald-50'
                                                            : 'text-rose-700 bg-rose-50'
                                                    }`}
                                                >
                                                    {user.isActive ? 'Active' : 'Suspended'}
                                                </span>
                                            </td>

                                            {/* Links */}
                                            <td className="py-3 px-4 text-center font-medium text-slate-700">
                                                {user.totalUrls}
                                            </td>

                                            {/* Total Clicks */}
                                            <td className="py-3 px-4 text-center font-medium text-slate-700">
                                                {user.totalClicks.toLocaleString()}
                                            </td>

                                            {/* Joined */}
                                            <td className="py-3 px-4 text-slate-400 text-[11px]">
                                                {user.createdAt ? format(parseISO(user.createdAt), 'dd/MM/yyyy') : '-'}
                                            </td>

                                            {/* Action */}
                                            <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    size="xs"
                                                    variant="outline"
                                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                                    className="h-7 text-xs rounded-lg px-2.5 text-slate-700"
                                                >
                                                    Inspect
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                        <span>
                            Page {page + 1} of {totalPages} ({usersData?.totalElements} users)
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="h-7 px-2"
                            >
                                <ChevronLeft className="size-3.5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="h-7 px-2"
                            >
                                <ChevronRight className="size-3.5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
