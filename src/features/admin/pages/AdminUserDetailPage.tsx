import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Loader2,
    RotateCcw,
    Copy,
    ExternalLink,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight,
    Check,
} from 'lucide-react';
import {
    useAdminUser,
    useAdminRoles,
    useAssignUserRoles,
    useUpdateUser,
    useResetUserPassword,
    useAdminUserUrls,
    useUpdateUrlStatus,
    useDeleteUrlByAdmin,
    useUpdateUserStatus,
} from '../hooks/useAdmin';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import type { AdminUrl } from '../types';

export default function AdminUserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const userId = Number(id);
    const navigate = useNavigate();

    const currentUser = useAuthStore((state) => state.user);
    const hasRoleManage = useAuthStore((state) => state.hasPermission('ROLE_MANAGE'));
    const hasUserManage = useAuthStore((state) => state.hasPermission('USER_MANAGE'));

    const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'security'>('profile');

    const {
        data: user,
        isLoading: isLoadingUser,
        isError,
        refetch,
        isRefetching,
    } = useAdminUser(userId);

    // Profile state
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');

    // Password state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Roles state
    const { data: availableRoles = [] } = useAdminRoles();
    const [selectedRoleNames, setSelectedRoleNames] = useState<string[]>([]);
    const [isEditingRoles, setIsEditingRoles] = useState(false);

    // Links state
    const [linksPage, setLinksPage] = useState(0);
    const [linksSearch, setLinksSearch] = useState('');
    const [debouncedLinksSearch, setDebouncedLinksSearch] = useState('');
    const [linksStatusFilter, setLinksStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Confirm dialogs
    const [actionUrl, setActionUrl] = useState<AdminUrl | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [deleteModalUrl, setDeleteModalUrl] = useState<AdminUrl | null>(null);
    const [isSuspendConfirmOpen, setIsSuspendConfirmOpen] = useState(false);

    // Mutations
    const updateUserMutation = useUpdateUser();
    const resetPasswordMutation = useResetUserPassword();
    const assignRolesMutation = useAssignUserRoles();
    const updateUserStatusMutation = useUpdateUserStatus();
    const updateUrlStatusMutation = useUpdateUrlStatus();
    const deleteUrlMutation = useDeleteUrlByAdmin();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedLinksSearch(linksSearch);
            setLinksPage(0);
        }, 300);
        return () => clearTimeout(timer);
    }, [linksSearch]);

    const isLinkActiveParam =
        linksStatusFilter === 'all' ? undefined : linksStatusFilter === 'active';

    const {
        data: userUrlsData,
        isLoading: isLoadingLinks,
        refetch: refetchLinks,
        isRefetching: isRefetchingLinks,
    } = useAdminUserUrls(
        userId,
        linksPage,
        10,
        debouncedLinksSearch,
        isLinkActiveParam
    );

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setAvatarUrl(user.avatarUrl || '');
            setCompany(user.company || '');
            setPhone(user.phoneNumber || '');
            setBio(user.bio || '');
            setSelectedRoleNames(user.roles || []);
        }
    }, [user]);

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        updateUserMutation.mutate({
            userId: user.id,
            data: {
                fullName: fullName.trim(),
                avatarUrl: avatarUrl.trim(),
                company: company.trim(),
                phoneNumber: phone.trim(),
                bio: bio.trim(),
            },
        });
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        resetPasswordMutation.mutate(
            { userId: user.id, data: { newPassword } },
            {
                onSuccess: () => {
                    setNewPassword('');
                    setConfirmPassword('');
                },
            }
        );
    };

    const handleToggleRole = (roleName: string) => {
        if (currentUser?.id === user?.id && roleName === 'ADMIN' && selectedRoleNames.includes('ADMIN')) {
            toast.error('Cannot remove your own ADMIN role.');
            return;
        }
        setSelectedRoleNames((prev) =>
            prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
        );
    };

    const handleSaveRoles = () => {
        if (!user) return;
        const isRoot = user.roles?.includes('SUPER_ADMIN');
        const roleNamesToSave = isRoot
            ? Array.from(new Set([...selectedRoleNames, 'SUPER_ADMIN']))
            : selectedRoleNames.filter((r) => r !== 'SUPER_ADMIN');

        if (roleNamesToSave.length === 0) {
            toast.error('User must have at least one role.');
            return;
        }
        assignRolesMutation.mutate(
            {
                userId: user.id,
                roleNames: roleNamesToSave,
            },
            {
                onSuccess: () => {
                    setIsEditingRoles(false);
                },
            }
        );
    };

    const handleCopy = (url: string, id: number) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        toast.success('Copied link');
        setTimeout(() => setCopiedId(null), 1500);
    };

    const handleOpenStatusDialog = (url: AdminUrl) => {
        setActionUrl(url);
        setIsStatusDialogOpen(true);
    };

    const handleConfirmUrlStatusChange = () => {
        if (!actionUrl) return;
        updateUrlStatusMutation.mutate(
            { urlId: actionUrl.id, isActive: !actionUrl.isActive },
            {
                onSettled: () => setIsStatusDialogOpen(false),
            }
        );
    };

    const isSelf = currentUser?.id === user?.id;

    if (isLoadingUser) {
        return (
            <div className="flex items-center justify-center min-h-[300px] text-slate-400">
                <Loader2 className="size-5 animate-spin mr-2" />
                <span className="text-xs">Loading...</span>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-sm mx-auto mt-12">
                <h2 className="text-sm font-semibold text-slate-900">User not found</h2>
                <Button onClick={() => navigate('/admin/users')} variant="outline" size="sm" className="mt-4 text-xs">
                    Back to Users
                </Button>
            </div>
        );
    }

    const userLinks = userUrlsData?.content || [];
    const totalLinkPages = userUrlsData?.totalPages || 0;

    return (
        <div className="space-y-4">
            {/* Minimal Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/admin/users')}
                        className="h-8 px-2 text-xs text-slate-600 hover:text-slate-900 -ml-2"
                    >
                        <ArrowLeft className="size-4 mr-1" />
                        Users
                    </Button>
                    <span className="text-slate-300">/</span>

                    <div className="size-6 rounded-full bg-slate-900 text-white font-semibold flex items-center justify-center text-[10px] shadow-xs shrink-0 overflow-hidden relative">
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt=""
                                className="size-full object-cover absolute inset-0"
                                onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                }}
                            />
                        ) : null}
                        <span>{(user.fullName || user.email).charAt(0).toUpperCase()}</span>
                    </div>

                    <span className="text-sm font-bold text-slate-900">
                        {user.fullName || user.email}
                    </span>
                    <span className="text-xs font-mono text-slate-400">#{user.id}</span>
                    <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                            user.isActive
                                ? 'text-emerald-700 bg-emerald-50'
                                : 'text-rose-700 bg-rose-50'
                        }`}
                    >
                        {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        refetch();
                        if (activeTab === 'links') refetchLinks();
                    }}
                    disabled={isRefetching || isRefetchingLinks}
                    className="h-8 text-xs rounded-xl border-slate-200 text-slate-700 gap-1.5"
                >
                    <RotateCcw className={`size-3.5 ${isRefetching || isRefetchingLinks ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </Button>
            </div>

            {/* Minimal Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200">
                <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                        activeTab === 'profile'
                            ? 'border-slate-900 text-slate-900'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    Profile
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('links')}
                    className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                        activeTab === 'links'
                            ? 'border-slate-900 text-slate-900'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    Links ({user.totalUrls})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                        activeTab === 'security'
                            ? 'border-slate-900 text-slate-900'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    Security
                </button>
            </div>

            {/* TAB 1: PROFILE */}
            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                        <form onSubmit={handleSaveProfile} className="space-y-3.5">
                            {/* Avatar Section */}
                            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
                                <div className="size-12 rounded-full bg-slate-900 text-white font-semibold text-base flex items-center justify-center shadow-xs shrink-0 overflow-hidden relative">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            className="size-full object-cover absolute inset-0"
                                            onError={(e) => {
                                                (e.target as HTMLElement).style.display = 'none';
                                            }}
                                        />
                                    ) : null}
                                    <span>{(fullName || user.email).charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-slate-700 mb-1 block">Avatar URL</label>
                                    <Input
                                        type="url"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        placeholder="https://example.com/avatar.png"
                                        disabled={!hasUserManage}
                                        className="h-8 text-xs rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-slate-700 mb-1 block">Name</label>
                                    <Input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Full name"
                                        disabled={!hasUserManage}
                                        className="h-8 text-xs rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-700 mb-1 block">Company</label>
                                    <Input
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        placeholder="Company"
                                        disabled={!hasUserManage}
                                        className="h-8 text-xs rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-700 mb-1 block">Phone</label>
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Phone number"
                                    disabled={!hasUserManage}
                                    className="h-8 text-xs rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-700 mb-1 block">Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    placeholder="About this user..."
                                    disabled={!hasUserManage}
                                    className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
                                />
                            </div>

                            {hasUserManage && (
                                <div className="pt-1 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={updateUserMutation.isPending}
                                        size="sm"
                                        className="h-8 text-xs rounded-lg px-3.5"
                                    >
                                        {updateUserMutation.isPending && (
                                            <Loader2 className="size-3 animate-spin mr-1.5" />
                                        )}
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs text-xs space-y-3">
                        <div className="font-semibold text-slate-800 pb-2 border-b border-slate-100">
                            Details
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Email</span>
                            <span className="font-medium text-slate-900">{user.email}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>ID</span>
                            <span className="font-mono text-slate-900">#{user.id}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Total Links</span>
                            <span className="font-medium text-slate-900">{user.totalUrls}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Total Clicks</span>
                            <span className="font-medium text-slate-900">{user.totalClicks}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Joined</span>
                            <span className="font-medium text-slate-900">
                                {format(parseISO(user.createdAt), 'dd/MM/yyyy')}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: LINKS */}
            {activeTab === 'links' && (
                <div className="space-y-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                            <Input
                                value={linksSearch}
                                onChange={(e) => setLinksSearch(e.target.value)}
                                placeholder="Search links..."
                                className="pl-8 h-8 text-xs rounded-lg bg-slate-50 border-slate-200"
                            />
                        </div>

                        <Select
                            value={linksStatusFilter}
                            onValueChange={(val) => {
                                if (val) {
                                    setLinksStatusFilter(val as 'all' | 'active' | 'disabled');
                                    setLinksPage(0);
                                }
                            }}
                        >
                            <SelectTrigger className="h-8 px-2.5 rounded-lg border-slate-200 bg-slate-50 text-xs text-slate-700 min-w-28">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="disabled">Disabled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold text-[11px]">
                                    <tr>
                                        <th className="py-2.5 px-4">Link</th>
                                        <th className="py-2.5 px-4">Status</th>
                                        <th className="py-2.5 px-4 text-center">Clicks</th>
                                        <th className="py-2.5 px-4">Created</th>
                                        <th className="py-2.5 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoadingLinks ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-10 text-slate-400">
                                                <Loader2 className="size-5 animate-spin mx-auto mb-2 text-slate-400" />
                                                <span>Loading...</span>
                                            </td>
                                        </tr>
                                    ) : userLinks.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-10 text-slate-400">
                                                No links found.
                                            </td>
                                        </tr>
                                    ) : (
                                        userLinks.map((url) => (
                                            <tr key={url.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-2.5 px-4 max-w-sm">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-semibold text-slate-900">
                                                            /{url.shortCode}
                                                        </span>
                                                        <button
                                                            onClick={() => handleCopy(url.shortUrl, url.id)}
                                                            className="text-slate-400 hover:text-slate-700 p-0.5"
                                                            title="Copy"
                                                        >
                                                            {copiedId === url.id ? (
                                                                <Check className="size-3 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="size-3" />
                                                            )}
                                                        </button>
                                                        <a
                                                            href={url.shortUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-slate-400 hover:text-slate-700 p-0.5"
                                                            title="Open"
                                                        >
                                                            <ExternalLink className="size-3" />
                                                        </a>
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                                                        {url.originalUrl}
                                                    </div>
                                                </td>

                                                <td className="py-2.5 px-4 whitespace-nowrap">
                                                    <span
                                                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                                            url.isActive
                                                                ? 'text-emerald-700 bg-emerald-50'
                                                                : 'text-rose-700 bg-rose-50'
                                                        }`}
                                                    >
                                                        {url.isActive ? 'Active' : 'Disabled'}
                                                    </span>
                                                </td>

                                                <td className="py-2.5 px-4 text-center font-medium text-slate-700">
                                                    {url.clickCount.toLocaleString()}
                                                </td>

                                                <td className="py-2.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                                                    {format(parseISO(url.createdAt), 'dd/MM/yyyy')}
                                                </td>

                                                <td className="py-2.5 px-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            size="xs"
                                                            variant="outline"
                                                            onClick={() => handleOpenStatusDialog(url)}
                                                            className="h-7 text-xs rounded-lg px-2 text-slate-700"
                                                        >
                                                            {url.isActive ? 'Disable' : 'Enable'}
                                                        </Button>
                                                        <Button
                                                            size="icon-xs"
                                                            variant="ghost"
                                                            onClick={() => setDeleteModalUrl(url)}
                                                            className="text-slate-400 hover:text-rose-600"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalLinkPages > 1 && (
                            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                                <span>
                                    Page {linksPage + 1} of {totalLinkPages}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => setLinksPage((p) => Math.max(0, p - 1))}
                                        disabled={linksPage === 0}
                                        className="h-7 px-2"
                                    >
                                        <ChevronLeft className="size-3.5" />
                                    </Button>
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => setLinksPage((p) => Math.min(totalLinkPages - 1, p + 1))}
                                        disabled={linksPage >= totalLinkPages - 1}
                                        className="h-7 px-2"
                                    >
                                        <ChevronRight className="size-3.5" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: SECURITY */}
            {activeTab === 'security' && (
                <div className="space-y-4">
                    {/* Section 1: Account Status */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">Account Status</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {user.isActive ? 'Account is currently active.' : 'Account is currently suspended.'}
                                </p>
                            </div>

                            {hasUserManage && (
                                <Button
                                    size="sm"
                                    variant={user.isActive ? 'destructive' : 'default'}
                                    disabled={isSelf || updateUserStatusMutation.isPending}
                                    onClick={() => setIsSuspendConfirmOpen(true)}
                                    className="h-8 text-xs rounded-lg"
                                >
                                    {updateUserStatusMutation.isPending && (
                                        <Loader2 className="size-3 animate-spin mr-1.5" />
                                    )}
                                    {user.isActive ? 'Suspend User' : 'Reactivate User'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Section 2: Password Reset */}
                    {hasUserManage && (
                        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">Reset Password</h3>
                            <form onSubmit={handleResetPassword} className="space-y-3 max-w-sm">
                                <div>
                                    <label className="text-xs font-medium text-slate-700 mb-1 block">New Password</label>
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min 6 characters"
                                        className="h-8 text-xs rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-700 mb-1 block">Confirm Password</label>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm password"
                                        className="h-8 text-xs rounded-lg"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={resetPasswordMutation.isPending || !newPassword}
                                    size="sm"
                                    className="h-8 text-xs rounded-lg"
                                >
                                    {resetPasswordMutation.isPending && (
                                        <Loader2 className="size-3 animate-spin mr-1.5" />
                                    )}
                                    Update Password
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* Section 3: Roles - Redesigned UI */}
                    {hasRoleManage && (
                        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">Assigned Roles</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Current user role assignments</p>
                                </div>
                                {!isEditingRoles && !user.roles?.includes('SUPER_ADMIN') && (
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedRoleNames(user.roles || []);
                                            setIsEditingRoles(true);
                                        }}
                                        className="h-7 text-xs rounded-lg px-2.5 text-slate-700"
                                    >
                                        Edit Roles
                                    </Button>
                                )}
                            </div>

                            {!isEditingRoles ? (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {user.roles && user.roles.length > 0 ? (
                                        user.roles.map((roleName) => (
                                            <span
                                                key={roleName}
                                                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
                                            >
                                                {roleName}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400">No roles assigned</span>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3 pt-1">
                                    <div className="space-y-2">
                                        {availableRoles
                                            .filter((role) => role.name !== 'SUPER_ADMIN')
                                            .map((role) => {
                                                const isAssigned = selectedRoleNames.includes(role.name);
                                                const isRoleDisabled = isSelf && role.name === 'ADMIN';

                                                return (
                                                    <label
                                                        key={role.id}
                                                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                                                            isRoleDisabled ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                                                        } ${
                                                            isAssigned
                                                                ? 'bg-slate-50 border-slate-300'
                                                                : 'bg-white border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <Checkbox
                                                                checked={isAssigned}
                                                                onCheckedChange={() => handleToggleRole(role.name)}
                                                                disabled={isRoleDisabled}
                                                            />
                                                            <span className="font-medium text-slate-900">{role.name}</span>
                                                            {role.description ? (
                                                                <span className="text-slate-400 text-[11px] truncate">
                                                                    - {role.description}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400">
                                                            {role.permissions?.length || 0} perms
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedRoleNames(user.roles || []);
                                                setIsEditingRoles(false);
                                            }}
                                            className="h-7 text-xs rounded-lg px-2.5"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="xs"
                                            onClick={handleSaveRoles}
                                            disabled={assignRolesMutation.isPending}
                                            className="h-7 text-xs rounded-lg px-2.5"
                                        >
                                            {assignRolesMutation.isPending && (
                                                <Loader2 className="size-3 animate-spin mr-1" />
                                            )}
                                            Save Roles
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Confirm Dialogs */}
            <ConfirmDialog
                isOpen={isSuspendConfirmOpen}
                onClose={() => setIsSuspendConfirmOpen(false)}
                onConfirm={() => {
                    if (!user) return;
                    updateUserStatusMutation.mutate(
                        { userId: user.id, isActive: !user.isActive },
                        { onSettled: () => setIsSuspendConfirmOpen(false) }
                    );
                }}
                title={user.isActive ? 'Suspend User?' : 'Reactivate User?'}
                description={
                    user.isActive
                        ? `Suspend account ${user.email}? They will not be able to log in.`
                        : `Reactivate account ${user.email}?`
                }
                confirmText={user.isActive ? 'Suspend' : 'Reactivate'}
                variant={user.isActive ? 'destructive' : 'default'}
                isLoading={updateUserStatusMutation.isPending}
            />

            <ConfirmDialog
                isOpen={isStatusDialogOpen}
                onClose={() => setIsStatusDialogOpen(false)}
                onConfirm={handleConfirmUrlStatusChange}
                title={actionUrl?.isActive ? 'Disable link?' : 'Enable link?'}
                description={actionUrl ? `/${actionUrl.shortCode}` : ''}
                confirmText={actionUrl?.isActive ? 'Disable' : 'Enable'}
                variant={actionUrl?.isActive ? 'destructive' : 'default'}
                isLoading={updateUrlStatusMutation.isPending}
            />

            <ConfirmDialog
                isOpen={!!deleteModalUrl}
                onClose={() => setDeleteModalUrl(null)}
                onConfirm={() => {
                    if (!deleteModalUrl) return;
                    deleteUrlMutation.mutate(deleteModalUrl.id, {
                        onSettled: () => setDeleteModalUrl(null),
                    });
                }}
                title="Delete link?"
                description={deleteModalUrl ? `/${deleteModalUrl.shortCode}` : ''}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteUrlMutation.isPending}
            />
        </div>
    );
}
