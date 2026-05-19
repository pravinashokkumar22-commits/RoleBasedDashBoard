
import { ModalShell } from '../components/ModelShell';
import type { User } from '../types';

import { getInitials } from './GetInitials';

// View User Modal
export function ViewUserModal({ user, onClose }: { user: User; onClose: () => void }) {
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