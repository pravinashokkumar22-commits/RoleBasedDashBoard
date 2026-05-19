import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, UserCheck, Mail, ChevronRight } from 'lucide-react';
import { usersApi } from '../../api/users.api';
import { useAuth } from '../../hooks/useAuth';
import type { ContactSubmission, User } from '../../types';
import { contactApi } from '../../api/contact.api.ts';
import type { User as UserType } from '../../types';

export function AdminDashboard() {

  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [profile, setProfile] = useState<UserType | null>(null);
  const [contactMessages, setContactMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {usersApi.getAll()
      .then(r => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

   useEffect(() => {contactApi.getMessages()
      .then(res => setContactMessages(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

    useEffect(() => { usersApi.getMe().then(res => setProfile(res.data)); }, []);
  console.log(users);

  const total   = users.length;
  const admins  = users.filter(u => u.role === 'admin').length;
  const regular = users.filter(u => u.role !== 'admin').length;
  const total_message = contactMessages.filter(m => m.message).length;

  const stats = [
    { label: 'Total Users',      value: total,   icon: <Users size={20} />,     bg: '#ede9fe', iconColor: '#7c3aed' },
    { label: 'Admin Users',      value: admins,  icon: <Shield size={20} />,    bg: '#ede9fe', iconColor: '#7c3aed' },
    { label: 'Regular Users',    value: regular, icon: <UserCheck size={20} />, bg: '#dcfce7', iconColor: '#16a34a' },
    { label: 'Contact Messages', value: total_message,     icon: <Mail size={20} />,      bg: '#fee2e2', iconColor: '#dc2626' },
  ];

  const quickActions = [
    { icon: <Users size={18} />, label: 'Manage Users',   desc: 'View and edit user accounts',   to: '/admin/users' },
    { icon: <Mail size={18} />,  label: 'View Messages',  desc: 'Check contact submissions',     to: '/admin/contacts' },
  ];

  const accountInfo = [
    { label: 'Role',   value: 'Admin',  style: { color: 'var(--text-primary)', fontWeight: 600 } },
    { label: 'Email',  value: user ? `ID: ${user.id}` : '—', style: {} },
    { label: 'Status', value: 'Active', style: { color: 'var(--success)', fontWeight: 600 } },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Welcome back, {profile?.name || 'Admin User'}!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
          Here's what's happening with your dashboard today.
        </p>
      </div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>
              <span style={{ color: s.iconColor }}>{s.icon}</span>
            </div>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value">{loading && i < 3 ? '…' : s.value}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
        {/* Quick Actions */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quickActions.map(action => (
              <button
                key={action.to}
                onClick={() => navigate(action.to)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', border: '1px solid var(--card-border)', borderRadius: 10, background: '#fff', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafbfc')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                <span style={{ color: 'var(--text-secondary)' }}>{action.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{action.label}</p>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>{action.desc}</p>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </button>
            ))}
          </div>
        </div>
        {/* Account Info */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Account Information</h3>
          {accountInfo.map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{row.label}</span>
              <span style={{ fontSize: 13.5, ...row.style }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}





