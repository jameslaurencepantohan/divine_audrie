import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Admin') {
      alert('Access denied.');
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
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
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
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
            }}>Admin Dashboard</h1>
            <p style={{
              fontSize: '1rem',
              color: '#b0b0b0',
              margin: 0
            }}>Welcome back, Administrator</p>
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
            }}>Online</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #333',
            transition: 'transform 0.2s, border-color 0.2s'
          }} className="stat-card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#b0b0b0',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Total Orders</h3>
              <div style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '8px'
              }}>
                <svg width="20" height="20" fill="#667eea" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
            </div>
            <p style={{
              fontSize: '2rem',
              fontWeight: '700',
              margin: '0.5rem 0',
              color: '#fff'
            }}>1,248</p>
            <p style={{
              fontSize: '0.875rem',
              color: '#10b981',
              margin: 0
            }}>+12.5% from last month</p>
          </div>

          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #333',
            transition: 'transform 0.2s, border-color 0.2s'
          }} className="stat-card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#b0b0b0',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Inventory</h3>
              <div style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px'
              }}>
                <svg width="20" height="20" fill="#10b981" viewBox="0 0 24 24">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                </svg>
              </div>
            </div>
            <p style={{
              fontSize: '2rem',
              fontWeight: '700',
              margin: '0.5rem 0',
              color: '#fff'
            }}>542</p>
            <p style={{
              fontSize: '0.875rem',
              color: '#f59e0b',
              margin: 0
            }}>15 items low in stock</p>
          </div>

          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #333',
            transition: 'transform 0.2s, border-color 0.2s'
          }} className="stat-card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#b0b0b0',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Revenue</h3>
              <div style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '8px'
              }}>
                <svg width="20" height="20" fill="#f59e0b" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                </svg>
              </div>
            </div>
            <p style={{
              fontSize: '2rem',
              fontWeight: '700',
              margin: '0.5rem 0',
              color: '#fff'
            }}>₱24,580</p>
            <p style={{
              fontSize: '0.875rem',
              color: '#10b981',
              margin: 0
            }}>+8.2% from last month</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{
          marginBottom: '3rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#fff'
          }}>Quick Access</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <button
              onClick={() => router.push('/admin/home')}
              style={{
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #333',
                padding: '1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1e1e1e';
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '10px'
              }}>
                <svg width="24" height="24" fill="#667eea" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>Home</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#b0b0b0'
                }}>Dashboard overview</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/admin/inventory')}
              style={{
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #333',
                padding: '1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1e1e1e';
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '10px'
              }}>
                <svg width="24" height="24" fill="#10b981" viewBox="0 0 24 24">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>Inventory</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#b0b0b0'
                }}>Manage products & stock</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/admin/orders')}
              style={{
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #333',
                padding: '1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.borderColor = '#f59e0b';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1e1e1e';
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '10px'
              }}>
                <svg width="24" height="24" fill="#f59e0b" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>Orders</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#b0b0b0'
                }}>View & manage orders</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/admin/payment')}
              style={{
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #333',
                padding: '1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.borderColor = '#ef4444';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1e1e1e';
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '10px'
              }}>
                <svg width="24" height="24" fill="#ef4444" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>Payment</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#b0b0b0'
                }}>Payment processing</div>
              </div>
            </button>
          </div>
        </div>

        

        {/* Logout Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: '2rem',
          borderTop: '1px solid #333'
        }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              color: '#ef4444',
              border: '1px solid #ef4444',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="20" height="20" fill="#ef4444" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: #444;
        }
      `}</style>
    </div>
  );
}