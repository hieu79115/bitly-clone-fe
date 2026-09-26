import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Pencil, Tag as TagIcon, Plus, ExternalLink, Type } from 'lucide-react';
import { updateUrlSchema, type UpdateUrlFormValues } from '../schemas/urlSchema';
import { useUrls } from '../hooks/useUrls';
import type { UrlItem } from '../types';
import { parseUtcDate } from '@/lib/utils';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DateTimePicker } from '@/components/ui/date-time-picker';

interface EditUrlModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: UrlItem;
}

// Convert UTC date string to local HTML datetime string (YYYY-MM-DDTHH:mm)
function toLocalInputFormat(utcStr: string | null | undefined): string {
    if (!utcStr) return '';
    const date = parseUtcDate(utcStr);
    if (!date) return '';
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
}

export default function EditUrlModal({ isOpen, onClose, url }: EditUrlModalProps) {
    useLockBodyScroll(isOpen);
    const { updateUrl, isUpdating, tags, createTag, isCreatingTag } = useUrls();
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>(() => url.tags?.map((t) => t.id) || []);
    const [newTagName, setNewTagName] = useState('');
    const [showNewTagInput, setShowNewTagInput] = useState(false);
    const [hasExpiration, setHasExpiration] = useState<boolean>(() => Boolean(url.expiresAt));

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<UpdateUrlFormValues>({
        resolver: zodResolver(updateUrlSchema),
        defaultValues: {
            title: url.title || '',
            expiresAt: toLocalInputFormat(url.expiresAt),
        },
    });

    const expiresAt = useWatch({ control, name: 'expiresAt' });

    if (!isOpen) return null;

    const toggleTag = (id: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;
        try {
            const created = await createTag(newTagName.trim());
            setSelectedTagIds((prev) => [...prev, created.id]);
            setNewTagName('');
            setShowNewTagInput(false);
        } catch {
            // Error handled in hook
        }
    };

    const onSubmit = async (data: UpdateUrlFormValues) => {
        try {
            const hasNewDate = Boolean(hasExpiration && data.expiresAt?.trim());
            const expiresAtUtc = hasNewDate
                ? new Date(data.expiresAt!).toISOString().slice(0, 19)
                : undefined;

            await updateUrl({
                id: url.id,
                data: {
                    title: data.title?.trim() || undefined,
                    expiresAt: expiresAtUtc,
                    clearExpiration: !hasNewDate,
                    tagIds: selectedTagIds,
                },
            });

            reset();
            onClose();
        } catch {
            // Error handled in hook
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
                >
                    <X className="size-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
                        <Pencil className="size-4" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Edit Short Link</h3>
                        <p className="text-xs text-slate-500 font-mono">/{url.shortCode}</p>
                    </div>
                </div>

                {/* Link Summary (Read-only) */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 mb-4 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-600">Short URL:</span>
                        <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline font-medium flex items-center gap-1"
                        >
                            <span>{url.shortUrl}</span>
                            <ExternalLink className="size-3" />
                        </a>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-slate-600 shrink-0">Destination:</span>
                        <span className="text-slate-500 truncate" title={url.originalUrl}>
                            {url.originalUrl}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                            <Type className="size-3.5 text-slate-400" />
                            <span>Title / Name (Optional)</span>
                        </label>
                        <Input
                            placeholder="e.g. Portfolio Website, Marketing Campaign Q3"
                            {...register('title')}
                            disabled={isUpdating}
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Tags selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                            <TagIcon className="size-3.5 text-slate-400" />
                            <span>Tags</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5 items-center">
                            {tags.map((tag) => {
                                const isSelected = selectedTagIds.includes(tag.id);
                                return (
                                    <button
                                        type="button"
                                        key={tag.id}
                                        onClick={() => toggleTag(tag.id)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                            isSelected
                                                ? 'bg-primary text-primary-foreground shadow-xs'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        #{tag.name}
                                    </button>
                                );
                            })}

                            {showNewTagInput ? (
                                <div className="flex items-center gap-1">
                                    <input
                                        type="text"
                                        placeholder="New tag..."
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        className="h-7 px-2 text-xs border rounded-md outline-none w-24"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateTag())}
                                    />
                                    <Button
                                        type="button"
                                        size="xs"
                                        onClick={handleCreateTag}
                                        disabled={isCreatingTag}
                                    >
                                        Add
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewTagInput(false)}
                                        className="text-slate-400 hover:text-slate-600 text-xs px-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowNewTagInput(true)}
                                    className="px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-dashed border-slate-300 flex items-center gap-1"
                                >
                                    <Plus className="size-3" />
                                    <span>New tag</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expiration Date Section */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label htmlFor="edit-toggle-expiration" className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-2 select-none">
                                <Checkbox
                                    id="edit-toggle-expiration"
                                    checked={hasExpiration}
                                    onCheckedChange={(checked) => {
                                        setHasExpiration(checked);
                                        if (!checked) setValue('expiresAt', '');
                                    }}
                                />
                                <span>Set expiration date (Optional)</span>
                            </label>
                            <span className="text-[11px] text-slate-400">
                                {hasExpiration ? 'Expires at selected time' : 'Never expires'}
                            </span>
                        </div>

                        {hasExpiration && (
                            <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-150 pl-6">
                                <DateTimePicker
                                    value={expiresAt}
                                    onChange={(val) => setValue('expiresAt', val, { shouldValidate: true })}
                                    disabled={isUpdating}
                                    placeholder="Select expiration date & time"
                                />
                                {errors.expiresAt && (
                                    <p className="text-xs text-red-500">{errors.expiresAt.message}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                                <>
                                    <Loader2 className="size-4 animate-spin mr-2" /> Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
