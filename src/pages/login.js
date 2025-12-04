import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '', role: 'Cashier' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Save user in localStorage for session
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'Admin') {
          router.push('/admin');
        } else if (data.user.role === 'Cashier') {
          router.push('/cashier');
        }
      } else {
        alert(data.message || 'Login failed.');
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
        position: 'relative'
      }}>
        {/* POS Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            POS
          </div>
          <h1 style={{
            color: '#2d3748',
            margin: '0 0 0.5rem 0',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            Point of Sale
          </h1>
          <p style={{
            color: '#718096',
            margin: 0,
            fontSize: '14px'
          }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Username Field */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#4a5568',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Username
            </label>
            <div style={{
              position: 'relative'
            }}>
              <input
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  outline: 'none',
                  background: '#f8fafc'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#718096'
              }}>
                👤
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#4a5568',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Password
            </label>
            <div style={{
              position: 'relative'
            }}>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  outline: 'none',
                  background: '#f8fafc'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#718096'
              }}>
                🔒
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#4a5568',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Login as
            </label>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.25rem',
              background: '#f8fafc'
            }}>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'Cashier' })}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: form.role === 'Cashier' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: form.role === 'Cashier' ? 'white' : '#4a5568',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                disabled={loading}
              >
                💼 Cashier
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'Admin' })}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: form.role === 'Admin' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: form.role === 'Admin' ? 'white' : '#4a5568',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                disabled={loading}
              >
                ⚙️ Admin
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Processing...
              </>
            ) : (
              'Sign In →'
            )}
          </button>

          {/* Register Link */}
          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <p style={{ color: '#718096', margin: 0, fontSize: '14px' }}>
              Need an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '14px'
                }}
              >
                Create Account
              </button>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: '#a0aec0',
          fontSize: '12px'
        }}>
          © 2024 POS System v1.0
        </div>
      </div>

      {/* Add spin animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input:focus {
          border-color: #667eea !important;
          background: white !important;
        }
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}