import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from './LoadingScreen';

/** Requires admin role. Regular users are sent to /dashboard. */
export function AdminRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}