import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Link2, Sparkles, Tag as TagIcon, Plus } from 'lucide-react';
import { createUrlSchema, type CreateUrlFormValues } from '../schemas/urlSchema';
import { useUrls } from '../hooks/useUrls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CreateUrlModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateUrlModal({ isOpen, onClose }: CreateUrlModalProps) {
    const { createUrl, isCreating, tags, createTag, isCreatingTag } = useUrls();
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [newTagName, setNewTagName] = useState('');
    const [showNewTagInput, setShowNewTagInput] = useState(false);

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const minDateTime = now.toISOString().slice(0, 16);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateUrlFormValues>({
        resolver: zodResolver(createUrlSchema),
        defaultValues: {
            originalUrl: '',
            customAlias: '',
            expiresAt: '',
        },
    });

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

    const onSubmit = async (data: CreateUrlFormValues) => {
        try {
            // Convert local datetime to UTC format expected by the backend
            const expiresAtUtc = data.expiresAt
                ? new Date(data.expiresAt).toISOString().slice(0, 19)
                : undefined;

            await createUrl({
                originalUrl: data.originalUrl,
                customAlias: data.customAlias?.trim() || undefined,
                expiresAt: expiresAtUtc,
                tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
            });
            reset();
            setSelectedTagIds([]);
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

                <div className="flex items-center gap-2.5 mb-5">
                    <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
                        <Link2 className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Create a Short Link</h3>
                        <p className="text-xs text-slate-500">Shorten, customize, and organize your URL</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Destination URL */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Destination URL <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="https://example.com/very-long-url-path"
                            {...register('originalUrl')}
                            disabled={isCreating}
                        />
                        {errors.originalUrl && (
                            <p className="text-xs text-red-500">{errors.originalUrl.message}</p>
                        )}
                    </div>

                    {/* Custom Alias */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="size-3.5 text-amber-500" />
                            <span>Custom Back-half (Optional)</span>
                        </label>
                        <div className="flex rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary overflow-hidden">
                            <span className="bg-slate-50 px-3 py-1.5 text-xs text-slate-500 font-mono flex items-center border-r border-slate-200 select-none">
                                localhost:8080/
                            </span>
                            <input
                                type="text"
                                placeholder="my-custom-slug"
                                {...register('customAlias')}
                                disabled={isCreating}
                                className="flex-1 px-3 py-1.5 text-sm outline-none bg-transparent"
                            />
                        </div>
                        {errors.customAlias && (
                            <p className="text-xs text-red-500">{errors.customAlias.message}</p>
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
                                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${isSelected
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

                    {/* Expiration Date */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Expiration Date (Optional)
                        </label>
                        <Input
                            type="datetime-local"
                            min={minDateTime}
                            {...register('expiresAt')}
                            disabled={isCreating}
                        />
                        {errors.expiresAt && (
                            <p className="text-xs text-red-500">{errors.expiresAt.message}</p>
                        )}
                    </div>

                    <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? (
                                <>
                                    <Loader2 className="size-4 animate-spin mr-2" /> Creating...
                                </>
                            ) : (
                                'Create Short Link'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
