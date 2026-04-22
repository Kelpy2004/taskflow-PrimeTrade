import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';

export default function ProtectedRoute({
  roles,
}: {
  roles?: Array<'admin' | 'user'>;
}) {
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">
        <div className="glass-elevated rounded-2xl px-8 py-6 text-sm text-on-surface-variant">
          Restoring your workspace session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
