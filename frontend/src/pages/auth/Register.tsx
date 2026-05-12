import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import { ContactModal } from '../../components/UI/ContactModal';
import type { RegisterCredentials } from '../../types';

type Form = RegisterCredentials & { confirmPassword: string };

function validate(form: Form): Partial<Form> {
  const errors: Partial<Form> = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email)       errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email';
  if (!form.password)    errors.password = 'Password is required';
  else if (form.password.length < 6) errors.password = 'Min 6 characters';
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

// Each field in the register form
const FIELDS = [
  { key: 'name',            label: 'Name',             type: 'text',     placeholder: 'Enter your name' },
  { key: 'email',           label: 'Email',            type: 'email',    placeholder: 'Enter your email' },
  { key: 'password',        label: 'Password',         type: 'password', placeholder: 'Enter your password' },
  { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Confirm your password' },
] as const;

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const setField = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    try {
      await authApi.register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join our admin dashboard</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FIELDS.map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="field-label">{label}</label>
              <input
                className={`field-input${errors[key] ? ' error' : ''}`}
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={setField(key)}
              />
              {errors[key] && <p className="field-error">{errors[key]}</p>}
            </div>
          ))}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13.5, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>Login</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 8, fontSize: 13.5, color: 'var(--text-secondary)' }}>
          Need help?{' '}
          <button onClick={() => setShowContact(true)} style={{ fontWeight: 500, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, textDecoration: 'underline' }}>
            Contact us
          </button>
        </p>
      </div>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </div>
  );
}
