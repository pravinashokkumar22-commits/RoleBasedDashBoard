import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../routers/LoadingScreen';



/** Blocks already-authenticated users from accessing login/register. */
export function PublicRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace /> : <Outlet />;
}
