import { useState } from 'react';
import { X, Tag as TagIcon, Plus, Pencil, Trash2, Check, Loader2 } from 'lucide-react';
import { useUrls } from '../hooks/useUrls';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface ManageTagsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ManageTagsModal({ isOpen, onClose }: ManageTagsModalProps) {
    useLockBodyScroll(isOpen);
    const { tags, createTag, isCreatingTag, updateTag, isUpdatingTag, deleteTag, isDeletingTag } = useUrls();

    const [newTagName, setNewTagName] = useState('');
    const [editingTagId, setEditingTagId] = useState<number | null>(null);
    const [editingTagName, setEditingTagName] = useState('');
    const [tagToDelete, setTagToDelete] = useState<{ id: number; name: string } | null>(null);

    if (!isOpen) return null;

    const handleCreateTag = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newTagName.trim();
        if (!trimmed) return;
        try {
            await createTag(trimmed);
            setNewTagName('');
        } catch {
            // Error handled in hook
        }
    };

    const handleStartEdit = (id: number, currentName: string) => {
        setEditingTagId(id);
        setEditingTagName(currentName);
    };

    const handleSaveEdit = async (id: number) => {
        const trimmed = editingTagName.trim();
        if (!trimmed) return;
        try {
            await updateTag({ id, name: trimmed });
            setEditingTagId(null);
            setEditingTagName('');
        } catch {
            // Error handled in hook
        }
    };

    const handleConfirmDelete = async () => {
        if (!tagToDelete) return;
        try {
            await deleteTag(tagToDelete.id);
            setTagToDelete(null);
        } catch {
            // Error handled in hook
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
                >
                    <X className="size-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
                        <TagIcon className="size-4" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Manage Tags</h3>
                        <p className="text-xs text-slate-500">Create, edit, or delete tags for organizing links</p>
                    </div>
                </div>

                {/* Create Tag Form */}
                <form onSubmit={handleCreateTag} className="flex gap-2 mb-4">
                    <Input
                        placeholder="Enter tag name (e.g. marketing, youtube)"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        disabled={isCreatingTag}
                        className="text-xs"
                    />
                    <Button type="submit" disabled={isCreatingTag || !newTagName.trim()} className="shrink-0">
                        {isCreatingTag ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 mr-1" />}
                        Add
                    </Button>
                </form>

                {/* Tag List */}
                <div className="border border-slate-200/80 rounded-xl divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {tags.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                            No tags yet. Create your first tag above!
                        </div>
                    ) : (
                        tags.map((tag) => {
                            const isEditing = editingTagId === tag.id;
                            return (
                                <div
                                    key={tag.id}
                                    className="p-3 flex items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors"
                                >
                                    {isEditing ? (
                                        <div className="flex items-center gap-1.5 flex-1">
                                            <input
                                                type="text"
                                                value={editingTagName}
                                                onChange={(e) => setEditingTagName(e.target.value)}
                                                className="h-8 px-2.5 text-xs border rounded-lg flex-1 outline-none focus:ring-1 focus:ring-primary"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleSaveEdit(tag.id);
                                                    } else if (e.key === 'Escape') {
                                                        setEditingTagId(null);
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                size="xs"
                                                onClick={() => handleSaveEdit(tag.id)}
                                                disabled={isUpdatingTag || !editingTagName.trim()}
                                            >
                                                <Check className="size-3.5" />
                                            </Button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingTagId(null)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
                                            >
                                                <X className="size-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                #{tag.name}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleStartEdit(tag.id, tag.name)}
                                                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Rename Tag"
                                                >
                                                    <Pencil className="size-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setTagToDelete({ id: tag.id, name: tag.name })}
                                                    disabled={isDeletingTag}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Tag"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="pt-4 mt-4 flex justify-end border-t border-slate-100">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>

            {/* Delete Tag Confirmation Dialog */}
            <ConfirmDialog
                isOpen={Boolean(tagToDelete)}
                onClose={() => setTagToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Tag"
                description={`Are you sure you want to delete tag #${tagToDelete?.name}? It will be unlinked from all existing URLs.`}
                confirmText="Delete Tag"
                variant="destructive"
            />
        </div>
    );
}
