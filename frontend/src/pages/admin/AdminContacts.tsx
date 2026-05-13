import { useEffect, useState } from 'react';
import { Mail, Eye, Trash2, X, MessageSquare, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactApi } from '../../api/contact.api';
import type { ContactSubmission } from '../../types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function ViewMessageModal({ sub, onClose }: { sub: ContactSubmission; onClose: () => void }) {
  const fields = [
    { icon: <User size={15} />,          label: 'Name',      value: sub.full_name },
    { icon: <Mail size={15} />,          label: 'Email',     value: sub.email },
    { icon: <Calendar size={15} />,      label: 'Submitted', value: formatDate(sub.created_at) },
    { icon: <MessageSquare size={15} />, label: 'Message',   value: sub.message },
  ];
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box scale-in">
        <div className="modal-header">
          <span className="modal-title">Contact Message</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '0 24px' }}>
          {fields.map(f => (
            <div key={f.label} className="profile-field">
              <span className="profile-field-icon">{f.icon}</span>
              <div>
                <p className="profile-field-label">{f.label}</p>
                <p className="profile-field-value" style={{ whiteSpace: 'pre-wrap' }}>{f.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export function AdminContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewSub, setViewSub] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    contactApi.getMessages()
      .then(r => setSubmissions(r.data.data))
      .catch(() => toast.error('Failed to load submissions'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: number) => {
    if (!confirm('Delete this submission?')) return;
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="fade-in">
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div className="empty-state"><div className="spinner spinner-dark" /></div>
        ) : submissions.length === 0 ? (
          <div className="empty-state">
            <Mail size={40} />
            <p>No contact submissions yet</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Message Preview</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 600 }}>{sub.full_name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{sub.email}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: 300 }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {sub.message}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{formatDate(sub.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-secondary" onClick={() => setViewSub(sub)}>
                          <Eye size={13} /> View
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          style={{ width: 32, height: 32, border: '1.5px solid #fecaca', borderRadius: 7, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewSub && <ViewMessageModal sub={viewSub} onClose={() => setViewSub(null)} />}
    </div>
  );
}