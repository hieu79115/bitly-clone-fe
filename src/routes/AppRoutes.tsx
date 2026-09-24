import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import LinksPage from "@/features/links/pages/LinksPage";
import AnalyticsPage from "@/features/analytics/pages/AnalyticsPage";
import SettingsPage from "@/features/profile/pages/SettingsPage";
import ForbiddenPage from "@/components/common/ForbiddenPage";
import NotFoundPage from "@/components/common/NotFoundPage";
import LinkExpiredPage from "@/features/links/pages/LinkExpiredPage";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Portal wrapped inside AppLayout */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/links" element={<LinksPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Route>

            {/* Error Routes */}
            <Route path="/link-expired" element={<LinkExpiredPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    );
}
