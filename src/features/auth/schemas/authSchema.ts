import { z } from 'zod';

export const loginSchema = z.
    object({
        email: z
            .string()
            .min(1, 'The email field cannot be left blank')
            .email('Invalid email format'),
        password: z
            .string()
            .min(6, 'The password must be at least 6 characters'),
    });

export const registerSchema = z.
    object({
        email: z
            .string()
            .min(1, 'The email field cannot be left blank')
            .email('Invalid email format'),
        password: z
            .string()
            .min(6, 'The password must be at least 6 characters'),
        confirmPassword: z
            .string()
            .min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'The confirmation password does not match',
        path: ['confirmPassword'],
    });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;