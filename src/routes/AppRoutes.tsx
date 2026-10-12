import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AdminRoute from "@/components/common/AdminRoute";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import LinksPage from "@/features/links/pages/LinksPage";
import AnalyticsPage from "@/features/analytics/pages/AnalyticsPage";
import SettingsPage from "@/features/profile/pages/SettingsPage";
import QrCodesPage from "@/features/qr-codes/pages/QrCodesPage";
import LandingPage from "@/features/landing/pages/LandingPage";
import ForbiddenPage from "@/components/common/ForbiddenPage";
import NotFoundPage from "@/components/common/NotFoundPage";
import LinkExpiredPage from "@/features/links/pages/LinkExpiredPage";
import LinkDisabledPage from "@/features/links/pages/LinkDisabledPage";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminUsersPage from "@/features/admin/pages/AdminUsersPage";
import AdminUrlsPage from "@/features/admin/pages/AdminUrlsPage";
import AdminRolesPage from "@/features/admin/pages/AdminRolesPage";
import AdminUserDetailPage from "@/features/admin/pages/AdminUserDetailPage";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Portal wrapped inside AppLayout */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/links" element={<LinksPage />} />
                    <Route path="/qr-codes" element={<QrCodesPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />

                    {/* Admin Dynamic RBAC Protected Routes */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/admin/users" element={<AdminUsersPage />} />
                        <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
                        <Route path="/admin/links" element={<AdminUrlsPage />} />
                        <Route path="/admin/roles" element={<AdminRolesPage />} />
                    </Route>
                </Route>
            </Route>

            {/* Security Warning & Error Routes */}
            <Route path="/link-disabled" element={<LinkDisabledPage />} />
            <Route path="/link-expired" element={<LinkExpiredPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    );
}
