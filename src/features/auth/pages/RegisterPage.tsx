import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import AuthLayout from '../components/AuthLayout';
import { registerSchema, type RegisterFormValues } from '../schemas/authSchema';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { register: signup, isRegistering } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: RegisterFormValues) => {
        signup({ email: data.email, password: data.password });
    };

    return (
        <AuthLayout
            title="Create a new account"
            description="Start shortening and tracking link performance in just a few seconds."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email field */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <Input
                        type="email"
                        placeholder="ten@example.com"
                        {...register('email')}
                        disabled={isRegistering}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1 duration-150">{errors.email.message}</p>
                    )}
                </div>

                {/* Password field */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="At least 6 characters"
                            {...register('password')}
                            disabled={isRegistering}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1 duration-150">{errors.password.message}</p>
                    )}
                </div>

                {/* Confirm Password field */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Confirm password</label>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        {...register('confirmPassword')}
                        disabled={isRegistering}
                    />
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1 duration-150">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isRegistering}>
                    {isRegistering ? (
                        <>
                            <Loader2 className="size-4 animate-spin mr-2" /> Creating account...
                        </>
                    ) : (
                        'Register'
                    )}
                </Button>

                <p className="text-center text-sm text-slate-500 pt-2">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
