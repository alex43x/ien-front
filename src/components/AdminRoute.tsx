import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { isAuthenticated, isLoading, isAdmin, user } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user?.rol === 'moderador_tienda' && !['/admin', '/admin/productos', '/admin/codigos', '/admin/simulacion'].includes(pathname)) {
    return <Navigate to="/admin/productos" replace />;
  }
  if (user?.rol !== 'admin_general' && ['/admin/grupos', '/admin/plantillas'].includes(pathname)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
