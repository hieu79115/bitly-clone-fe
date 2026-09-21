import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function AdminRoute() {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'ROLE_ADMIN') {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}
