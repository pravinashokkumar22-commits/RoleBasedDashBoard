import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoadingScreen() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--page-bg)' }}>
      <div className="spinner spinner-dark" style={{ width: 28, height: 28, borderWidth: 3 }} />
    </div>
  );
}

/** Requires any authenticated user. Redirects to /login otherwise. */
export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

/** Requires admin role. Regular users are sent to /dashboard. */
export function AdminRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

/** Blocks already-authenticated users from accessing login/register. */
export function PublicRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace /> : <Outlet />;
}
