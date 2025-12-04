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
    
    // Password confirmation check
    if (form.password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Password strength validation
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
        alert(data.message || 'Registration failed.');
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
            Create Account
          </h1>
          <p style={{
            color: '#718096',
            margin: 0,
            fontSize: '14px'
          }}>
            Join our POS system
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
                placeholder="Choose a username"
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
              <span style={{
                fontSize: '12px',
                color: '#718096',
                fontWeight: 'normal',
                marginLeft: '0.5rem'
              }}>
                (min. 6 characters)
              </span>
            </label>
            <div style={{
              position: 'relative'
            }}>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
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
                🔐
              </div>
            </div>
            
            {/* Password strength indicator */}
            {form.password && (
              <div style={{
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  flex: 1,
                  height: '4px',
                  background: '#e2e8f0',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(form.password.length * 20, 100)}%`,
                    height: '100%',
                    background: form.password.length >= 8 ? '#48bb78' : 
                               form.password.length >= 6 ? '#ed8936' : '#f56565',
                    transition: 'all 0.3s'
                  }} />
                </div>
                <span style={{
                  fontSize: '12px',
                  color: form.password.length >= 8 ? '#48bb78' : 
                         form.password.length >= 6 ? '#ed8936' : '#f56565',
                  fontWeight: '600'
                }}>
                  {form.password.length >= 8 ? 'Strong' : 
                   form.password.length >= 6 ? 'Medium' : 'Weak'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#4a5568',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Confirm Password
            </label>
            <div style={{
              position: 'relative'
            }}>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  background: confirmPassword && form.password !== confirmPassword ? '#fff5f5' : '#f8fafc'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: confirmPassword && form.password !== confirmPassword ? '#f56565' : '#718096'
              }}>
                🔒
              </div>
            </div>
            {confirmPassword && form.password !== confirmPassword && (
              <p style={{
                color: '#f56565',
                fontSize: '12px',
                marginTop: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                ⚠️ Passwords do not match
              </p>
            )}
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
              Account Type
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
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                disabled={loading}
              >
                <span>💼</span>
                <span>Cashier</span>
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
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                disabled={loading}
              >
                <span>⚙️</span>
                <span>Admin</span>
              </button>
            </div>
            
            {/* Role Description */}
            <div style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: form.role === 'Admin' ? '#ebf8ff' : '#f0fff4',
              borderRadius: '8px',
              borderLeft: '4px solid',
              borderColor: form.role === 'Admin' ? '#4299e1' : '#48bb78'
            }}>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#4a5568',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {form.role === 'Admin' ? (
                  <>⚙️ <strong>Admin:</strong> Full system access, manage users & settings</>
                ) : (
                  <>💼 <strong>Cashier:</strong> Process sales, manage transactions</>
                )}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (confirmPassword && form.password !== confirmPassword)}
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
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading || (confirmPassword && form.password !== confirmPassword) ? 0.7 : 1
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
                Creating Account...
              </>
            ) : (
              <>
                ✨ Create Account →
              </>
            )}
          </button>

          {/* Login Link */}
          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <p style={{ color: '#718096', margin: 0, fontSize: '14px' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                Sign In
                <span style={{ fontSize: '12px' }}>→</span>
              </button>
            </p>
          </div>
        </form>

        {/* Terms & Footer */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#a0aec0',
            fontSize: '11px',
            margin: '0 0 1rem 0',
            lineHeight: '1.4'
          }}>
            By creating an account, you agree to our Terms of Service 
            and acknowledge our Privacy Policy.
          </p>
          <div style={{
            color: '#a0aec0',
            fontSize: '12px'
          }}>
            © 2024 POS System v1.0
          </div>
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
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}