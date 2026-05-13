import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { User as UserType } from '../../types';
import { usersApi } from '@/api/users.api';

// Maps routes to the page title shown in the top bar
const ROUTE_LABELS: Record<string, string> = {
  '/admin':           'Dashboard Home',
  '/admin/users':     'User Management',
  '/admin/contacts':  'Contact Submissions',
  '/admin/profile':   'Profile',
  '/admin/settings':  'Settings',
  '/dashboard':       'Profile',
};

  
function getInitials(name?: string | null): string {
  if (!name) return 'U';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = ROUTE_LABELS[location.pathname] ?? 'Dashboard';
  const isAdmin = user?.role === 'admin';
  const [profile, setProfile] = useState<UserType | null>(null);
  useEffect(() => { usersApi.getMe().then(res => setProfile(res.data)); }, []);
  console.log(profile);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleSettings = () => { navigate(isAdmin ? '/admin/settings' : '/dashboard'); setOpen(false); };

  return (
    <header className="topbar">
      <h1 className="topbar-title">{pageTitle}</h1>

      <div className="dropdown" ref={dropdownRef}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <div className="avatar" style={{ width: 36, height: 36 }}>
            {getInitials(profile?.name)}
          </div>
          <ChevronDown
            size={14}
            style={{ color: 'var(--text-secondary)', transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }}
          />
        </button>

        {open && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={handleSettings}>
              <Settings size={14} /> Settings
            </button>
            <button className="dropdown-item danger" onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
