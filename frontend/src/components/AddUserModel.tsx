import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth.api';
import { ModalShell } from './ModelShell';


//  Add User Modal
export function AddUserModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
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