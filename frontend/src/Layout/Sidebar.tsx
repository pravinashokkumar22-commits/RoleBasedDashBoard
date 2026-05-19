import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, User, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const ADMIN_NAV = [
  { to: '/admin',           label: 'Dashboard Home',      icon: <LayoutDashboard size={16} /> },
  { to: '/admin/users',     label: 'User Management',     icon: <Users size={16} /> },
  { to: '/admin/contacts',  label: 'Contact Submissions', icon: <Mail size={16} /> },
  { to: '/admin/profile',   label: 'Profile',             icon: <User size={16} /> },
  { to: '/admin/settings',  label: 'Settings',            icon: <Settings size={16} /> },
];

const USER_NAV = [
  { to: '/dashboard', label: 'Profile', icon: <User size={16} /> },
];

export function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = isAdmin ? ADMIN_NAV : USER_NAV;
  const title = isAdmin ? 'Admin Dashboard' : 'User Dashboard';
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar slide-in">
      <div className="sidebar-logo">
        {isAdmin && <Shield size={14} style={{ display: 'inline', marginRight: 6, color: '#a78bfa' }} />}
        {title}
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin' || item.to === '/dashboard'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--sidebar-border)' }}>
        <button className="nav-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
