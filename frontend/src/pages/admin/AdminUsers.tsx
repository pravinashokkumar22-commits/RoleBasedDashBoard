import { useEffect, useState } from 'react';
import { Search, Eye, Pencil, Trash2, X, UserPlus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../../api/users.api';
import { authApi } from '../../api/auth.api';
import type { User } from '../../types';

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ── Shared modal shell ─────────────────────────────────────────────────
function ModalShell({ title, onClose, children, footer }: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box scale-in">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
        {children}
        <div className="modal-footer">{footer}</div>
      </div>
    </div>
  );
}

// ── View User Modal ────────────────────────────────────────────────────
function ViewUserModal({ user, onClose }: { user: User; onClose: () => void }) {
  const fields = [
    { label: 'Full Name', value: user.name },
    { label: 'Email Address', value: user.email },
    { label: 'Role', value: user.role ?? 'user' },
  ];
  return (
    <ModalShell title="User Details" onClose={onClose} footer={
      <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>Close</button>
    }>
      <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingBottom: 8 }}>
        <div className="avatar" style={{ width: 72, height: 72, fontSize: 22, marginBottom: 8 }}>{getInitials(user.name)}</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</h3>
        <span className={`badge badge-${user.role ?? 'user'}`}>{(user.role ?? 'user').toUpperCase()}</span>
      </div>
      <div style={{ padding: '0 24px' }}>
        {fields.map(f => (
          <div key={f.label} className="profile-field">
            <div>
              <p className="profile-field-label">{f.label}</p>
              <p className="profile-field-value">{f.value}</p>
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

// ── Edit User Modal ────────────────────────────────────────────────────
function EditUserModal({ user, onClose, onSaved }: { user: User; onClose: () => void; onSaved: (u: User) => void }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, password: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload: { name: string; email: string; password?: string } = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const res = await usersApi.update(user.id, payload);
      onSaved(res.data.data);
      toast.success('User updated');
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title="Edit User" onClose={onClose} footer={
      <>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={loading}>
          {loading ? <span className="spinner" /> : 'Save Changes'}
        </button>
      </>
    }>
      <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label className="field-label">Name</label>
          <input className="field-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div>
          <label className="field-label">Email</label>
          <input className="field-input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
        </div>
        <div>
          <label className="field-label">New Password <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(leave blank to keep)</span></label>
          <input className="field-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
        </div>
      </div>
    </ModalShell>
  );
}

// ── Add User Modal ─────────────────────────────────────────────────────
function AddUserModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await authApi.register(form);
      toast.success('User created');
      onAdded();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title="Add New User" onClose={onClose} footer={
      <>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn-primary" style={{ flex: 1 }} onClick={handleAdd} disabled={loading}>
          {loading ? <span className="spinner" /> : 'Create User'}
        </button>
      </>
    }>
      <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {(['name', 'email', 'password'] as const).map(key => (
          <div key={key}>
            <label className="field-label" style={{ textTransform: 'capitalize' }}>{key}</label>
            <input
              className="field-input"
              type={key === 'email' ? 'email' : key === 'password' ? 'password' : 'text'}
              placeholder={`Enter ${key}`}
              value={form[key]}
              onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    usersApi.getAll()
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(loadUsers, []);

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || (u.role ?? 'user') === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (u: User) => {
    if (!confirm(`Delete ${u.name}?`)) return;
    try {
      await usersApi.delete(u.id);
      setUsers(prev => prev.filter(x => x.id !== u.id));
      toast.success('User deleted');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Delete failed');
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="search-bar">
          <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{ padding: '9px 14px', border: '1.5px solid var(--card-border)', borderRadius: 10, background: '#fff', fontSize: 13.5, fontFamily: 'inherit', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button className="btn-primary" style={{ width: 'auto', padding: '9px 18px', flexShrink: 0 }} onClick={() => setShowAdd(true)}>
          <UserPlus size={15} /> Add New User
        </button>
      </div>

      {/* User cards */}
      {loading ? (
        <div className="empty-state"><div className="spinner spinner-dark" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><Users size={40} /><p>No users found</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {filtered.map(u => (
            <div key={u.id} className="user-card">
              <div className="avatar" style={{ width: 60, height: 60, fontSize: 18, marginBottom: 12 }}>{getInitials(u.name)}</div>
              <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>{u.name}</p>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2, marginBottom: 8 }}>{u.email}</p>
              <span className={`badge badge-${u.role ?? 'user'}`}>{(u.role ?? 'user').toUpperCase()}</span>
              <div style={{ display: 'flex', gap: 8, marginTop: 16, width: '100%' }}>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setViewUser(u)}>
                  <Eye size={13} /> View
                </button>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditUser(u)}>
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(u)}
                  style={{ width: 36, height: 36, border: '1.5px solid #fecaca', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', flexShrink: 0, transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewUser && <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSaved={updated => setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, ...updated } : u))}
        />
      )}
      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onAdded={loadUsers} />}
    </div>
  );
}
