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
      alert('Password must be at least 6 characters.');
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
        alert(data.message || `Registration failed (${res.status})`);
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
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, #1a1f35 0%, #0d0f1a 100%)' 
    }}>
      <div style={{ 
        background: '#1e293b', 
        padding: '2.5rem', 
        borderRadius: '12px', 
        width: '100%', 
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        border: '1px solid #334155'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem',
          color: '#f1f5f9'
        }}>
          Create Account
        </h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '6px', 
              border: '1px solid #475569',
              background: '#0f172a',
              color: '#f1f5f9',
              outline: 'none'
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '6px', 
              border: '1px solid #475569',
              background: '#0f172a',
              color: '#f1f5f9',
              outline: 'none'
            }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '6px', 
              border: '1px solid #475569',
              background: '#0f172a',
              color: '#f1f5f9',
              outline: 'none'
            }}
          />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'Cashier' })}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: form.role === 'Cashier' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#334155',
                color: form.role === 'Cashier' ? 'white' : '#cbd5e1',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cashier
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'Admin' })}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: form.role === 'Admin' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#334155',
                color: form.role === 'Admin' ? 'white' : '#cbd5e1',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Admin
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              marginTop: '0.5rem'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          color: '#94a3b8',
          borderTop: '1px solid #475569',
          paddingTop: '1.5rem'
        }}>
          Already have an account?{' '}
          <button 
            onClick={() => router.push('/login')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#818cf8', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Sign In
          </button>
        </p>
      </div>
      
      <style jsx>{`
        input:focus {
          border-color: #818cf8 !important;
        }
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}