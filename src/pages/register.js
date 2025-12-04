import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '', role: 'Cashier' });
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (form.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Account created successfully!');
        router.push('/login');
      } else {
        alert(data.message || `Registration failed with status ${res.status}.`);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '28px' }}>Create Account</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'Cashier' })}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: form.role === 'Cashier' ? '#667eea' : '#e2e8f0',
                color: form.role === 'Cashier' ? 'white' : '#4a5568'
              }}
            >
              Cashier
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'Admin' })}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: form.role === 'Admin' ? '#667eea' : '#e2e8f0',
                color: form.role === 'Admin' ? 'white' : '#4a5568'
              }}
            >
              Admin
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || (confirmPassword && form.password !== confirmPassword)}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              background: '#764ba2',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account?{' '}
          <button onClick={() => router.push('/login')} style={{ color: '#667eea', background: 'none', border: 'none', cursor: 'pointer' }}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
