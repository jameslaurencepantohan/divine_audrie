import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '', role: 'Cashier' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

      // Safely parse JSON even if server returns empty
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = { message: 'Invalid response from server' };
      }

      if (res.ok) {
        alert(data.message || 'Account created successfully!');
        router.push('/login');
      } else {
        alert(data.message || `Registration failed with status ${res.status}`);
      }
    } catch (err) {
      console.error('Frontend error:', err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={() => setForm({ ...form, role: 'Cashier' })} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: form.role === 'Cashier' ? '#667eea' : '#e2e8f0', color: form.role === 'Cashier' ? 'white' : '#4a5568' }}>Cashier</button>
            <button type="button" onClick={() => setForm({ ...form, role: 'Admin' })} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: form.role === 'Admin' ? '#667eea' : '#e2e8f0', color: form.role === 'Admin' ? 'white' : '#4a5568' }}>Admin</button>
          </div>

          <button type="submit" disabled={loading} style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: '#764ba2', color: 'white', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account?{' '}
          <button onClick={() => router.push('/login')} style={{ color: '#667eea', background: 'none', border: 'none', cursor: 'pointer' }}>Sign In</button>
        </p>
      </div>
    </div>
  );
}
