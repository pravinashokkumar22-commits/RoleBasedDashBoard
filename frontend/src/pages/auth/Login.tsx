import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../hooks/useAuth';
import { ContactModal } from '../../pages/contactPage/ContactModel';
import type { LoginCredentials } from '../../types';

function validate(form: LoginCredentials): Partial<LoginCredentials> {
  const errors: Partial<LoginCredentials> = {};
  if (!form.email)    errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email';
  if (!form.password) errors.password = 'Password is required';
  return errors;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginCredentials>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const setField = (key: keyof LoginCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const token = res.data.data.token;
      login(token);
      toast.success('Welcome back!');
      // Decode token to get role for redirect
      const { role } = JSON.parse(atob(token.split('.')[1]));
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <h1 className="auth-title">Admin Dashboard</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="field-label">Email</label>
            <input
              className={`field-input${errors.email ? ' error' : ''}`}
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={setField('email')}
              autoComplete="email"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div>
            <label className="field-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className={`field-input${errors.password ? ' error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={setField('password')}
                autoComplete="current-password"
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <span className="spinner" /> : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13.5, color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>Sign up</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 8, fontSize: 13.5, color: 'var(--text-secondary)' }}>
          Need help?{' '}
          <button onClick={() => setShowContact(true)} style={{ fontWeight: 500, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, textDecoration: 'underline' }}>
            Contact us
          </button>
        </p>

        <div className="demo-box">
          <p className="demo-box-title">Demo Credentials:</p>
          <p className="demo-box-item">Admin: admin@example.com / admin123</p>
          <p className="demo-box-item">User: john@example.com / user123</p>
        </div>
      </div>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </div>
  );
}
