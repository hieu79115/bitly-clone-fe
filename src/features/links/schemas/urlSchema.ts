import { z } from 'zod';

export const createUrlSchema = z.object({
    originalUrl: z
        .string()
        .min(1, 'Please enter a destination URL')
        .url('Please enter a valid URL (e.g. https://example.com)'),
    customAlias: z
        .string()
        .refine(
            (val) => !val || /^[a-zA-Z0-9_-]{4,20}$/.test(val),
            'Alias must be between 4 and 20 characters (letters, numbers, underscores, hyphens)'
        )
        .optional(),
    expiresAt: z
        .string()
        .refine((val) => !val || new Date(val).getTime() > Date.now(), {
            message: 'Expiration time must be in the future',
        })
        .optional(),
    tagIds: z.array(z.number()).optional(),
});

export type CreateUrlFormValues = z.infer<typeof createUrlSchema>;