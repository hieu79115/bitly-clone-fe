import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    User,
    Mail,
    Building2,
    Phone,
    FileText,
    Image as ImageIcon,
    Lock,
    KeyRound,
    Calendar,
    Link2,
    MousePointerClick,
    Loader2,
    Eye,
    EyeOff,
    LogOut,
    CheckCircle2,
    ChevronDown,
    X,
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
    updateProfileSchema,
    changePasswordSchema,
    type UpdateProfileFormValues,
    type ChangePasswordFormValues,
} from '../schemas/profileSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { formatDate, cn } from '@/lib/utils';

export default function SettingsPage() {
    const { data: profile, isLoading, updateProfile, isUpdatingProfile, changePassword, isChangingPassword } = useProfile();
    const { logout } = useAuth();

    // Toggle for Change Password form expansion (xổ xuống)
    const [isChangingPassOpen, setIsChangingPassOpen] = useState(false);

    // Password visibility toggles
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // Logout confirm dialog
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Profile Form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        formState: { errors: profileErrors, isDirty: isProfileDirty },
    } = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            fullName: '',
            company: '',
            phoneNumber: '',
            bio: '',
            avatarUrl: '',
        },
    });

    // Populate profile form when profile data loads
    useEffect(() => {
        if (profile) {
            resetProfile({
                fullName: profile.fullName || '',
                company: profile.company || '',
                phoneNumber: profile.phoneNumber || '',
                bio: profile.bio || '',
                avatarUrl: profile.avatarUrl || '',
            });
        }
    }, [profile, resetProfile]);

    // Password Form
    const {
        register: registerPass,
        handleSubmit: handleSubmitPass,
        reset: resetPass,
        formState: { errors: passErrors },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onProfileSubmit = async (data: UpdateProfileFormValues) => {
        try {
            await updateProfile({
                fullName: data.fullName?.trim() || undefined,
                company: data.company?.trim() || undefined,
                phoneNumber: data.phoneNumber?.trim() || undefined,
                bio: data.bio?.trim() || undefined,
                avatarUrl: data.avatarUrl?.trim() || undefined,
            });
        } catch {
            // Handled in useProfile hook
        }
    };

    const onPasswordSubmit = async (data: ChangePasswordFormValues) => {
        try {
            await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });
            resetPass();
            setIsChangingPassOpen(false);
        } catch {
            // Handled in useProfile hook
        }
    };

    const email = profile?.email || '';
    const displayName = profile?.fullName || email.split('@')[0] || 'User';
    // 1 single initial letter, uppercase
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="space-y-6 w-full animate-in fade-in duration-200">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Account Settings
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Manage your personal profile details, account credentials, and security preferences.
                </p>
            </div>

            {/* 2-Column Responsive Layout: Left (Forms) & Right (Profile Summary & Session) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
                {/* Left Column (8 cols): Profile Form & Collapsible Password Card */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Profile Information Form */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <User className="size-4.5 text-primary" />
                                    <span>Profile Details</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Update your public display name, organization, and contact details.
                                </p>
                            </div>
                            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/50">
                                Public profile
                            </span>
                        </div>

                        <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="p-5 sm:p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <User className="size-3.5 text-slate-400" />
                                        <span>Full Name</span>
                                    </label>
                                    <Input
                                        placeholder="e.g. John Doe"
                                        {...registerProfile('fullName')}
                                        disabled={isUpdatingProfile}
                                    />
                                    {profileErrors.fullName && (
                                        <p className="text-xs text-red-500">{profileErrors.fullName.message}</p>
                                    )}
                                </div>

                                {/* Email Address (Read-only) */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                            <Mail className="size-3.5 text-slate-400" />
                                            <span>Email Address</span>
                                        </label>
                                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                                            <CheckCircle2 className="size-2.5" />
                                            Verified
                                        </span>
                                    </div>
                                    <Input
                                        value={profile?.email || ''}
                                        disabled
                                        className="bg-slate-50 text-slate-500 cursor-not-allowed"
                                    />
                                    <p className="text-[11px] text-slate-400">Primary login credential (read-only)</p>
                                </div>

                                {/* Company / Organization */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <Building2 className="size-3.5 text-slate-400" />
                                        <span>Company / Organization</span>
                                    </label>
                                    <Input
                                        placeholder="e.g. Acme Studio"
                                        {...registerProfile('company')}
                                        disabled={isUpdatingProfile}
                                    />
                                    {profileErrors.company && (
                                        <p className="text-xs text-red-500">{profileErrors.company.message}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <Phone className="size-3.5 text-slate-400" />
                                        <span>Phone Number</span>
                                    </label>
                                    <Input
                                        placeholder="e.g. +84 912345678"
                                        {...registerProfile('phoneNumber')}
                                        disabled={isUpdatingProfile}
                                    />
                                    {profileErrors.phoneNumber && (
                                        <p className="text-xs text-red-500">{profileErrors.phoneNumber.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Avatar URL */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                    <ImageIcon className="size-3.5 text-slate-400" />
                                    <span>Avatar Image URL</span>
                                </label>
                                <Input
                                    placeholder="https://example.com/my-photo.jpg"
                                    {...registerProfile('avatarUrl')}
                                    disabled={isUpdatingProfile}
                                />
                                <p className="text-[11px] text-slate-400">
                                    Provide a direct image URL. If omitted, your 1-letter monogram will be displayed.
                                </p>
                                {profileErrors.avatarUrl && (
                                    <p className="text-xs text-red-500">{profileErrors.avatarUrl.message}</p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                    <FileText className="size-3.5 text-slate-400" />
                                    <span>Bio</span>
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Write a brief note about yourself, your role, or your projects..."
                                    {...registerProfile('bio')}
                                    disabled={isUpdatingProfile}
                                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 placeholder:text-slate-400 transition-all resize-none"
                                />
                                {profileErrors.bio && (
                                    <p className="text-xs text-red-500">{profileErrors.bio.message}</p>
                                )}
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                                <span className="text-xs text-slate-400">
                                    {isProfileDirty ? 'You have unsaved changes' : 'All changes saved'}
                                </span>
                                <Button
                                    type="submit"
                                    disabled={isUpdatingProfile || !isProfileDirty}
                                    className="gap-2 shadow-xs cursor-pointer"
                                >
                                    {isUpdatingProfile ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="size-4" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Password & Security Card with Collapsible Form (xổ xuống) */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className={cn(
                            "p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors",
                            isChangingPassOpen && "border-b border-slate-100"
                        )}>
                            <div className="flex items-center gap-3.5">
                                <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20">
                                    <Lock className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                        Password & Security
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Manage and change your account password.
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant={isChangingPassOpen ? "ghost" : "outline"}
                                size="sm"
                                onClick={() => {
                                    if (isChangingPassOpen) {
                                        resetPass();
                                        setIsChangingPassOpen(false);
                                    } else {
                                        setIsChangingPassOpen(true);
                                    }
                                }}
                                className="gap-1.5 shadow-xs cursor-pointer hover:bg-slate-50 shrink-0"
                            >
                                {isChangingPassOpen ? (
                                    <>
                                        <X className="size-3.5 text-slate-500" />
                                        <span>Close</span>
                                    </>
                                ) : (
                                    <>
                                        <KeyRound className="size-3.5 text-slate-500" />
                                        <span>Update Password</span>
                                        <ChevronDown className="size-3.5 text-slate-400" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Expanded Form (xổ xuống) */}
                        {isChangingPassOpen && (
                            <form onSubmit={handleSubmitPass(onPasswordSubmit)} className="p-5 sm:p-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
                                <p className="text-xs text-slate-500">
                                    Enter your current password and choose a new password with at least 6 characters.
                                </p>

                                {/* Current Password */}
                                <div className="space-y-1.5 max-w-md">
                                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <KeyRound className="size-3.5 text-slate-400" />
                                        <span>Current Password</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showCurrentPass ? 'text' : 'password'}
                                            placeholder="Enter your current password"
                                            {...registerPass('currentPassword')}
                                            disabled={isChangingPassword}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                                        >
                                            {showCurrentPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                    {passErrors.currentPassword && (
                                        <p className="text-xs text-red-500">{passErrors.currentPassword.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                                    {/* New Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                            <KeyRound className="size-3.5 text-slate-400" />
                                            <span>New Password</span>
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showNewPass ? 'text' : 'password'}
                                                placeholder="At least 6 characters"
                                                {...registerPass('newPassword')}
                                                disabled={isChangingPassword}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPass(!showNewPass)}
                                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                                            >
                                                {showNewPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                            </button>
                                        </div>
                                        {passErrors.newPassword && (
                                            <p className="text-xs text-red-500">{passErrors.newPassword.message}</p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                            <KeyRound className="size-3.5 text-slate-400" />
                                            <span>Confirm New Password</span>
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPass ? 'text' : 'password'}
                                                placeholder="Re-type new password"
                                                {...registerPass('confirmPassword')}
                                                disabled={isChangingPassword}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                                            >
                                                {showConfirmPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                            </button>
                                        </div>
                                        {passErrors.confirmPassword && (
                                            <p className="text-xs text-red-500">{passErrors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            resetPass();
                                            setIsChangingPassOpen(false);
                                        }}
                                        disabled={isChangingPassword}
                                        className="cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isChangingPassword}
                                        className="gap-2 shadow-xs cursor-pointer"
                                    >
                                        {isChangingPassword ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="size-4" />
                                                <span>Save New Password</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right Column (4 cols): User Profile Overview & Session */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Profile Overview Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
                        {/* Avatar & Identity */}
                        <div className="flex flex-col items-center text-center">
                            {/* Round-full avatar, 1 character initial, black background & white text */}
                            <div className="size-20 rounded-full bg-slate-900 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-slate-900/10 shrink-0 overflow-hidden ring-4 ring-slate-100">
                                {profile?.avatarUrl ? (
                                    <img
                                        src={profile.avatarUrl}
                                        alt={displayName}
                                        className="size-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <span>{initial}</span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mt-3.5 truncate max-w-full">
                                {isLoading ? 'Loading...' : displayName}
                            </h3>

                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 max-w-full">
                                <Mail className="size-3 text-slate-400 shrink-0" />
                                <span className="truncate">{email}</span>
                            </div>

                            {profile?.company && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-1">
                                    <Building2 className="size-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{profile.company}</span>
                                </div>
                            )}

                            {profile?.bio && (
                                <p className="text-xs text-slate-500 italic mt-2.5 px-2 line-clamp-2 bg-slate-50 py-1.5 rounded-lg border border-slate-100 w-full">
                                    "{profile.bio}"
                                </p>
                            )}
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                            <div className="bg-slate-50/80 rounded-xl p-3 text-center border border-slate-100">
                                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    <Link2 className="size-3 text-primary" />
                                    <span>Links</span>
                                </div>
                                <p className="text-xl font-extrabold text-slate-900 mt-1">
                                    {isLoading ? '...' : profile?.totalUrls ?? 0}
                                </p>
                            </div>

                            <div className="bg-slate-50/80 rounded-xl p-3 text-center border border-slate-100">
                                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    <MousePointerClick className="size-3 text-emerald-600" />
                                    <span>Clicks</span>
                                </div>
                                <p className="text-xl font-extrabold text-slate-900 mt-1">
                                    {isLoading ? '...' : profile?.totalClicks ?? 0}
                                </p>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                            <div className="flex items-center justify-between text-slate-600">
                                <span className="flex items-center gap-1.5 text-slate-400">
                                    <Calendar className="size-3.5" />
                                    <span>Member since</span>
                                </span>
                                <span className="font-semibold text-slate-800">
                                    {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-slate-600">
                                <span className="text-slate-400">Account Plan</span>
                                <span className="font-semibold text-slate-800">Free Tier</span>
                            </div>

                            <div className="flex items-center justify-between text-slate-600">
                                <span className="text-slate-400">Status</span>
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Session & Sign Out Card */}
                    <div className="bg-white rounded-2xl border border-rose-200/70 shadow-xs p-5 space-y-3">
                        <div className="flex items-center gap-2 text-rose-600">
                            <LogOut className="size-4" />
                            <h4 className="text-xs font-bold uppercase tracking-wider">Account Session</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Sign out of this browser session to clear your active authorization token and protect your data.
                        </p>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full gap-2 shadow-xs cursor-pointer"
                        >
                            <LogOut className="size-3.5" />
                            <span>Sign Out</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sign Out Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={() => {
                    setShowLogoutConfirm(false);
                    logout();
                }}
                title="Sign Out of Shortener"
                description="Are you sure you want to sign out? You will need to log back in with your credentials to access your links and analytics."
                confirmText="Yes, Sign Out"
                variant="destructive"
            />
        </div>
    );
}
