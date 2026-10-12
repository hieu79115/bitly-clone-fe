import { useState, useMemo } from 'react';
import {
    Plus,
    Trash2,
    Loader2,
    Search,
    RotateCcw,
    X,
} from 'lucide-react';
import {
    useAdminRoles,
    useAdminPermissions,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
} from '../hooks/useAdmin';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import type { RoleItem, PermissionItem } from '../types';

export default function AdminRolesPage() {
    const hasRoleManage = useAuthStore((state) => state.hasPermission('ROLE_MANAGE'));

    const { data: roles = [], isLoading: rolesLoading, refetch: refetchRoles, isRefetching } = useAdminRoles();
    const { data: permissions = [], isLoading: permsLoading } = useAdminPermissions();
    const isLoading = rolesLoading || permsLoading;

    const createRoleMutation = useCreateRole();
    const updateRoleMutation = useUpdateRole();
    const deleteRoleMutation = useDeleteRole();

    // Search filter
    const [searchTerm, setSearchTerm] = useState('');

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editRole, setEditRole] = useState<RoleItem | null>(null);
    const [deleteRoleItem, setDeleteRoleItem] = useState<RoleItem | null>(null);

    // Create Form State
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [createSelectedPerms, setCreateSelectedPerms] = useState<string[]>([]);

    // Edit Role State
    const [editDescription, setEditDescription] = useState('');
    const [editSelectedPerms, setEditSelectedPerms] = useState<string[]>([]);

    const handleOpenCreate = () => {
        setFormName('');
        setFormDescription('');
        setCreateSelectedPerms([]);
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (role: RoleItem) => {
        setEditRole(role);
        setEditDescription(role.description || '');
        setEditSelectedPerms(role.permissions.map((p) => p.name));
    };

    const handleToggleCreatePerm = (permName: string) => {
        if (createSelectedPerms.includes(permName)) {
            setCreateSelectedPerms(createSelectedPerms.filter((p) => p !== permName));
        } else {
            setCreateSelectedPerms([...createSelectedPerms, permName]);
        }
    };

    const handleToggleEditPerm = (permName: string) => {
        if (!editRole || editRole.name === 'SUPER_ADMIN') return;
        if (editSelectedPerms.includes(permName)) {
            setEditSelectedPerms(editSelectedPerms.filter((p) => p !== permName));
        } else {
            setEditSelectedPerms([...editSelectedPerms, permName]);
        }
    };

    const handleSaveCreate = () => {
        if (!formName.trim()) {
            toast.error('Role name is required.');
            return;
        }

        createRoleMutation.mutate(
            {
                name: formName.trim().toUpperCase(),
                description: formDescription.trim(),
                permissionNames: createSelectedPerms,
            },
            {
                onSuccess: () => {
                    setIsCreateOpen(false);
                },
            }
        );
    };

    const handleSaveEdit = () => {
        if (!editRole) return;
        updateRoleMutation.mutate(
            {
                roleId: editRole.id,
                data: {
                    description: editDescription.trim(),
                    permissionNames: editSelectedPerms,
                },
            },
            {
                onSuccess: () => {
                    setEditRole(null);
                },
            }
        );
    };

    const handleConfirmDelete = () => {
        if (!deleteRoleItem) return;
        deleteRoleMutation.mutate(deleteRoleItem.id, {
            onSettled: () => setDeleteRoleItem(null),
        });
    };

    // Group permissions by module
    const groupedPermissions = useMemo(() => {
        return permissions.reduce<Record<string, PermissionItem[]>>((acc, perm) => {
            const mod = perm.module || 'OTHER';
            if (!acc[mod]) acc[mod] = [];
            acc[mod].push(perm);
            return acc;
        }, {});
    }, [permissions]);

    // Filter roles by search
    const filteredRoles = useMemo(() => {
        if (!searchTerm.trim()) return roles;
        const q = searchTerm.toLowerCase();
        return roles.filter(
            (r) =>
                r.name.toLowerCase().includes(q) ||
                (r.description || '').toLowerCase().includes(q)
        );
    }, [roles, searchTerm]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Roles</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage roles and permissions</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetchRoles()}
                        disabled={isRefetching}
                        className="h-8 text-xs rounded-xl border-slate-200 text-slate-700 gap-1.5"
                    >
                        <RotateCcw className={`size-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </Button>

                    {hasRoleManage && (
                        <Button
                            onClick={handleOpenCreate}
                            size="sm"
                            className="h-8 text-xs rounded-xl gap-1.5"
                        >
                            <Plus className="size-3.5" />
                            <span>New Role</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search roles..."
                        className="pl-8 pr-7 h-8 text-xs rounded-lg bg-slate-50 border-slate-200"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                <div className="text-xs text-slate-500 font-medium">
                    {filteredRoles.length} roles
                </div>
            </div>

            {/* Roles List */}
            {isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-white rounded-xl border border-slate-200 animate-pulse" />
                    ))}
                </div>
            ) : filteredRoles.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
                    {filteredRoles.map((role) => (
                        <div
                            key={role.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900 text-sm">
                                        {role.name}
                                    </span>
                                    {role.isSystem && (
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                            System
                                        </span>
                                    )}
                                    <span className="text-xs text-slate-400">
                                        {role.userCount} users
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xl">
                                    {role.description || 'No description'}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {role.permissions?.slice(0, 5).map((p) => (
                                        <span
                                            key={p.name}
                                            className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded"
                                        >
                                            {p.name}
                                        </span>
                                    ))}
                                    {role.permissions?.length > 5 && (
                                        <span className="text-[10px] text-slate-400 self-center">
                                            +{role.permissions.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {hasRoleManage && (
                                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => handleOpenEdit(role)}
                                        className="h-7 text-xs rounded-lg px-2.5 text-slate-700"
                                    >
                                        Configure
                                    </Button>
                                    {!role.isSystem && (
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => setDeleteRoleItem(role)}
                                            className="text-slate-400 hover:text-rose-600"
                                            title="Delete"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400">
                    No roles found.
                </div>
            )}

            {/* EDIT ROLE MODAL */}
            {editRole && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">
                                    Configure Role: {editRole.name}
                                </h2>
                                <p className="text-xs text-slate-500">
                                    {editRole.isSystem ? 'System Role' : 'Custom Role'}
                                </p>
                            </div>
                            <button
                                onClick={() => setEditRole(null)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="text-xs font-medium text-slate-700 mb-1 block">Description</label>
                                <Input
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Role description"
                                    className="h-8 text-xs rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-700 mb-2 block">Permissions</label>
                                <div className="space-y-3">
                                    {Object.entries(groupedPermissions).map(([mod, perms]) => (
                                        <div key={mod} className="border border-slate-200 rounded-lg p-3">
                                            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                                                {mod}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {perms.map((perm) => {
                                                    const isChecked = editSelectedPerms.includes(perm.name);
                                                    const isSuperAdmin = editRole.name === 'SUPER_ADMIN';

                                                    return (
                                                        <label
                                                            key={perm.id}
                                                            className="flex items-center gap-2 text-xs cursor-pointer select-none"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => handleToggleEditPerm(perm.name)}
                                                                disabled={isSuperAdmin}
                                                                className="size-3.5 rounded text-slate-900 border-slate-300"
                                                            />
                                                            <span className="font-mono text-[11px] text-slate-700">
                                                                {perm.name}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditRole(null)}
                                className="h-8 text-xs rounded-lg"
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSaveEdit}
                                disabled={updateRoleMutation.isPending}
                                className="h-8 text-xs rounded-lg"
                            >
                                {updateRoleMutation.isPending && (
                                    <Loader2 className="size-3 animate-spin mr-1.5" />
                                )}
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* CREATE ROLE MODAL */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900">Create Role</h2>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="text-xs font-medium text-slate-700 mb-1 block">Role Name</label>
                                <Input
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="e.g. COMPLIANCE_OFFICER"
                                    className="h-8 text-xs rounded-lg font-mono uppercase"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-700 mb-1 block">Description</label>
                                <Input
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    placeholder="Role description"
                                    className="h-8 text-xs rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-700 mb-2 block">Permissions</label>
                                <div className="space-y-3">
                                    {Object.entries(groupedPermissions).map(([mod, perms]) => (
                                        <div key={mod} className="border border-slate-200 rounded-lg p-3">
                                            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                                                {mod}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {perms.map((perm) => {
                                                    const isChecked = createSelectedPerms.includes(perm.name);
                                                    return (
                                                        <label
                                                            key={perm.id}
                                                            className="flex items-center gap-2 text-xs cursor-pointer select-none"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => handleToggleCreatePerm(perm.name)}
                                                                className="size-3.5 rounded text-slate-900 border-slate-300"
                                                            />
                                                            <span className="font-mono text-[11px] text-slate-700">
                                                                {perm.name}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsCreateOpen(false)}
                                className="h-8 text-xs rounded-lg"
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSaveCreate}
                                disabled={createRoleMutation.isPending}
                                className="h-8 text-xs rounded-lg"
                            >
                                {createRoleMutation.isPending && (
                                    <Loader2 className="size-3 animate-spin mr-1.5" />
                                )}
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE ROLE DIALOG */}
            <ConfirmDialog
                isOpen={!!deleteRoleItem}
                onClose={() => setDeleteRoleItem(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Role?"
                description={`Delete ${deleteRoleItem?.name}?`}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteRoleMutation.isPending}
            />
        </div>
    );
}
