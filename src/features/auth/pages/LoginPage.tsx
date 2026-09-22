import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import AuthLayout from '../components/AuthLayout';
import { loginSchema, type LoginFormValues } from '../schemas/authSchema';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoggingIn } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        login(data);
    }

    return (
        <AuthLayout
            title="Welcome to Shortener"
            description="Log in to your account to manage your shortened links"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email field */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <Input
                        type="email"
                        placeholder="ten@example.com"
                        {...register('email')}
                        disabled={isLoggingIn}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1 duration-150">{errors.email.message}</p>
                    )}
                </div>

                {/* Password field */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                    </div>
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="At least 6 characters"
                            {...register('password')}
                            disabled={isLoggingIn}
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

                <Button type="submit" className="w-full mt-2" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                        <>
                            <Loader2 className="size-4 animate-spin mr-2" /> Logging in...
                        </>
                    ) : (
                        'Login'
                    )}
                </Button>

                <p className="text-center text-sm text-slate-500 pt-2">
                    Don't have an account yet?{' '}
                    <Link to="/register" className="font-semibold text-primary hover:underline">
                        Register now
                    </Link>
                </p>

            </form>
        </AuthLayout>
    )
}