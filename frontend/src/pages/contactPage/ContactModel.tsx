import { useState } from 'react';
import { X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactApi } from '../../api/contact.api';
import type { ContactDTO } from '../../types';

interface Props { onClose: () => void; }

const EMPTY_FORM: ContactDTO = { full_name: '', email: '', message: '' };

function validate(form: ContactDTO): Partial<ContactDTO> {
  const errors: Partial<ContactDTO> = {};
  if (!form.full_name.trim()) errors.full_name = 'Name is required';
  if (!form.email.trim())     errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email';
  if (!form.message.trim())   errors.message = 'Message is required';
  return errors;
}

export function ContactModal({ onClose }: Props) {
  const [form, setForm] = useState<ContactDTO>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<ContactDTO>>({});
  const [loading, setLoading] = useState(false);

  // Update a single form field and clear its error
  const setField = (key: keyof ContactDTO) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    try {
      await contactApi.submit(form);
      toast.success('Message sent successfully!');
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box scale-in">
        <div className="modal-header">
          <span className="modal-title">Contact Us</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="field-label">Full Name</label>
            <input className={`field-input${errors.full_name ? ' error' : ''}`} placeholder="Your full name" value={form.full_name} onChange={setField('full_name')} />
            {errors.full_name && <p className="field-error">{errors.full_name}</p>}
          </div>
          <div>
            <label className="field-label">Email</label>
            <input className={`field-input${errors.email ? ' error' : ''}`} placeholder="your.email@example.com" value={form.email} onChange={setField('email')} />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div>
            <label className="field-label">Message</label>
            <textarea
              className={`field-input${errors.message ? ' error' : ''}`}
              placeholder="How can we help you?"
              value={form.message}
              onChange={setField('message')}
              rows={4}
              style={{ resize: 'vertical' }}
            />
            {errors.message && <p className="field-error">{errors.message}</p>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner" /> : <><Send size={14} /> Send Message</>}
          </button>
        </div>
      </div>
    </div>
    
  );
}
