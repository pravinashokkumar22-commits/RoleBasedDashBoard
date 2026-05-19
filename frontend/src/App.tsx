import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AdminRoute } from './routers/AdminRoute';
import { PublicRoute } from './routers/PublicRoute';
import { PrivateRoute } from './routers/PrivateRoute';
import { DashboardLayout } from './Layout/DashboardLayout';
import { LoginPage }        from './pages/auth/Login';
import { RegisterPage }     from './pages/auth/Register';
import { AdminDashboard }   from './pages/admin/AdminDashboard';
import { AdminUsersPage }   from './pages/admin/AdminUsers';
import { AdminContactsPage } from './pages/admin/AdminContacts';
import { ProfilePage }      from './pages/profile/Profile';
import { ProfilePage as UserDashboard }    from './pages/profile/Profile';
import { SettingsPage }     from './pages/settings/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/*Public (blocked when logged in)*/}
          <Route element={<PublicRoute />}>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/*  Admin-only routes */}
          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin"           element={<AdminDashboard />} />
              <Route path="/admin/users"     element={<AdminUsersPage />} />
              <Route path="/admin/contacts"  element={<AdminContactsPage />} />
              <Route path="/admin/profile"   element={<ProfilePage />} />
              <Route path="/admin/settings"  element={<SettingsPage />} />
            </Route>
          </Route>

          {/*User routes (any authenticated)*/}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<UserDashboard />} />
            </Route>
          </Route>

          {/*Defaults*/}
          <Route path="/"  element={<Navigate to="/login" replace />} />
          <Route path="*"  element={<> </>} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13.5px',
            borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  );
}
