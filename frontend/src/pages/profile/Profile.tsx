import { useEffect, useState } from 'react';
import { User, Mail, Shield, Calendar, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../../api/users.api';
import { useAuth } from '../../hooks/useAuth';
import type { User as UserType } from '../../types';

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    usersApi.getMe()
      .then(r => {
        setProfile(r.data);
        setForm({ name: r.data.name, email: r.data.email, password: '' });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const payload: { name: string; email: string; password?: string } = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const res = await usersApi.update(profile.id, payload);
      setProfile(res.data.data);
      toast.success('Profile updated');
      setEditing(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="empty-state"><div className="spinner spinner-dark" /></div>;
  if (!profile) return null;

  const role = authUser?.role ?? 'user';

  const profileFields = [
    { icon: <User size={16} />,     label: 'Full Name',     value: profile.name },
    { icon: <Mail size={16} />,     label: 'Email Address', value: profile.email },
    { icon: <Shield size={16} />,   label: 'Role',          value: role.charAt(0).toUpperCase() + role.slice(1) },
    { icon: <Calendar size={16} />, label: 'Member Since',  value: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A' },
  ];
  console.log(profile);
  return (
    <div className="fade-in" style={{ maxWidth: 560 }}>
      <div className="card" style={{ padding: 28 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div className="avatar" style={{ width: 64, height: 64, fontSize: 20 }}>
            {getInitials(profile.name)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)' }}>{profile.name}</h2>
              <span className={`badge badge-${role}`}>{role.toUpperCase()}</span>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>{profile.email}</p>
          </div>
        </div>

        {!editing ? (
          <>
            {profileFields.map(f => (
              <div key={f.label} className="profile-field">
                <span className="profile-field-icon">{f.icon}</span>
                <div>
                  <p className="profile-field-label">{f.label}</p>
                  <p className="profile-field-value">{f.value}</p>
                </div>
              </div>
            ))}
            <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="field-label">Full Name</label>
                <input className="field-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Email Address</label>
                <input className="field-input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">New Password <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(leave blank to keep)</span></label>
                <input className="field-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditing(false)}>
                <X size={14} /> Cancel
              </button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                {saving ? <span className="spinner" /> : <><Save size={14} /> Save Changes</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
