import { z } from 'zod';

export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .max(100, 'Full name must not exceed 100 characters')
        .optional()
        .or(z.literal('')),
    company: z
        .string()
        .max(100, 'Company name must not exceed 100 characters')
        .optional()
        .or(z.literal('')),
    phoneNumber: z
        .string()
        .regex(/^$|^[0-9+]{9,15}$/, 'Phone number must be between 9 and 15 digits')
        .optional()
        .or(z.literal('')),
    bio: z
        .string()
        .max(255, 'Bio must not exceed 255 characters')
        .optional()
        .or(z.literal('')),
    avatarUrl: z
        .string()
        .url('Invalid URL format')
        .optional()
        .or(z.literal('')),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'New password and confirmation password do not match',
        path: ['confirmPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'New password cannot be the same as current password',
        path: ['newPassword'],
    });

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
