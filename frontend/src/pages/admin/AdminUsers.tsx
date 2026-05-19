import { useEffect, useState } from 'react';
import { Search, Eye, Pencil, Trash2, UserPlus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../../api/users.api';
import type { User } from '../../types';
import {ViewUserModal} from '../../components/ViewUserModal';
import { getInitials } from '../../components/GetInitials';
import { EditUserModal } from '../../components/EditUserModal';
import { AddUserModal } from '../../components/AddUserModel';
//  Shared modal shell

//  Main Page
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
