import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CashierDashboard() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Cashier') {
      alert('Access denied.');
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const goToPOS = () => {
    router.push('/cashier/home'); // POS page
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#121212',
      color: '#e0e0e0',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header with Logout Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #333'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 0.5rem 0'
            }}>Cashier Dashboard</h1>
            <p style={{
              fontSize: '1rem',
              color: '#b0b0b0',
              margin: 0
            }}>Welcome back, Cashier!</p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{
              color: '#10b981',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>Active</span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                marginLeft: '1rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              }}
            >
              <svg width="16" height="16" fill="#ef4444" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          marginBottom: '3rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#fff'
          }}>Quick Actions</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            <button
              onClick={goToPOS}
              style={{
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #333',
                padding: '2rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1rem',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1e1e1e';
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '10px'
              }}>
                <svg width="32" height="32" fill="#667eea" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>Home (POS)</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#b0b0b0'
                }}>Access the Point of Sale system</div>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{
          backgroundColor: '#1e1e1e',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #333',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#fff'
          }}>Quick Links</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <a
              href="/cashier/inventory"
              style={{
                backgroundColor: '#252525',
                color: '#e0e0e0',
                border: '1px solid #444',
                padding: '1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#252525';
                e.currentTarget.style.borderColor = '#444';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px'
              }}>
                <svg width="20" height="20" fill="#10b981" viewBox="0 0 24 24">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>View Inventory</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#b0b0b0'
                }}>Browse available products</div>
              </div>
            </a>

            <a
              href="/cashier/orders"
              style={{
                backgroundColor: '#252525',
                color: '#e0e0e0',
                border: '1px solid #444',
                padding: '1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.borderColor = '#f59e0b';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#252525';
                e.currentTarget.style.borderColor = '#444';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '8px'
              }}>
                <svg width="20" height="20" fill="#f59e0b" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>View Orders</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#b0b0b0'
                }}>Check order history</div>
              </div>
            </a>

            <a
              href="/cashier/payment"
              style={{
                backgroundColor: '#252525',
                color: '#e0e0e0',
                border: '1px solid #444',
                padding: '1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#252525';
                e.currentTarget.style.borderColor = '#444';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '8px'
              }}>
                <svg width="20" height="20" fill="#667eea" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>View Payments</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#b0b0b0'
                }}>Review payment transactions</div>
              </div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #333',
          textAlign: 'center',
          color: '#b0b0b0',
          fontSize: '0.875rem'
        }}>
          <p style={{ margin: 0 }}>
            Cashier Dashboard • Use the POS system for daily transactions
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}