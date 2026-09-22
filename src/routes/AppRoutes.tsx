import { Route, Routes } from "react-router-dom";
import AdminRoute from "@/components/common/AdminRoute";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import LoginPage from "@/features/auth/pages/LoginPage";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<div className="p-8 text-center text-xl">Bitly Clone Dashboard</div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<div className="p-8">User Dashboard</div>} />
                <Route path="/links" element={<div className="p-8">Management Urls</div>} />
            </Route>
            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
                <Route path="/admin" element={<div className="p-8">Admin Dashboard</div>} />
            </Route>
            {/* Error Routes */}
            <Route path="/403" element={<div className="p-8 text-center text-red-500 font-bold">403 - You do not have permission to access this!</div>} />
            <Route path="*" element={<div className="p-8 text-center text-gray-500">404 - Page not found</div>} />
        </Routes>
    );
}