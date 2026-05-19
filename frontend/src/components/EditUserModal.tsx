import { useState } from 'react';
import toast from 'react-hot-toast';
import { usersApi } from '../api/users.api';
import { ModalShell } from './ModelShell';
import type { User } from '../types';

//  Edit User Modal
export function EditUserModal({ user, onClose, onSaved }: { user: User; onClose: () => void; onSaved: (u: User) => void }) {
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