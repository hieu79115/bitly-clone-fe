import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface AdminRouteProps {
    requiredPermission?: string;
}

export default function AdminRoute({ requiredPermission }: AdminRouteProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isAdmin = useAuthStore((state) => state.isAdmin());
    const hasPermission = useAuthStore((state) => state.hasPermission);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/403" replace />;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}
