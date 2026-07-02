import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';

export default function PublicOnlyRoute() {
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  if (isBootstrapping) {
    // Render public pages immediately; if a valid session exists, we'll redirect right after bootstrap.
    return <Outlet />;
  }

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/' : '/tasks'} replace />;
  }

  return <Outlet />;
}
