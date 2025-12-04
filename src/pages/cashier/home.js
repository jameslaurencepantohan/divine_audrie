import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CashierHome() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    pendingOrders: 0,
    cancelledOrders: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Cashier') {
      alert('Access denied.');
      router.push('/login');
    } else {
      fetchOrders();
    }
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/payment'); // fetch all orders (same as admin)
      const data = await res.json();
      if (res.ok && data.orders) {
        setOrders(data.orders);

        const totalIncome = data.orders
          .filter(o => o.status === 'paid')
          .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

        const pendingOrders = data.orders.filter(o => o.status === 'unpaid').length;
        const cancelledOrders = data.orders.filter(o => o.status === 'cancelled').length;

        setStats({ totalIncome, pendingOrders, cancelledOrders });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'paid':
        return { 
          color: '#10b981', 
          fontWeight: '600',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          padding: '4px 12px',
          borderRadius: '20px',
          display: 'inline-block'
        };
      case 'unpaid':
        return { 
          color: '#f59e0b', 
          fontWeight: '600',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          padding: '4px 12px',
          borderRadius: '20px',
          display: 'inline-block'
        };
      case 'cancelled':
        return { 
          color: '#ef4444', 
          fontWeight: '600',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          padding: '4px 12px',
          borderRadius: '20px',
          display: 'inline-block'
        };
      default:
        return {};
    }
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
            }}>POS System Overview</p>
          </div>
          <button
            onClick={() => router.back()}
            style={{
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
            }}
          >
            <svg width="16" height="16" fill="#667eea" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back
          </button>
        </div>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #333',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '60px',
              height: '60px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '0 0 0 100%'
            }}></div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '10px'
              }}>
                <svg width="24" height="24" fill="#10b981" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h2 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#b0b0b0',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Total Income</h2>
            </div>
            <p style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: '0.5rem 0',
              color: '#fff'
            }}>₱{stats.totalIncome.toFixed(2)}</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}>
              <svg width="16" height="16" fill="#10b981" viewBox="0 0 24 24">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
              <span style={{
                fontSize: '0.875rem',
                color: '#10b981'
              }}>From completed payments</span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #333',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '60px',
              height: '60px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '0 0 0 100%'
            }}></div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                borderRadius: '10px'
              }}>
                <svg width="24" height="24" fill="#f59e0b" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm0-12h2v10h-2z"/>
                </svg>
              </div>
              <h2 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#b0b0b0',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Pending Orders</h2>
            </div>
            <p style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: '0.5rem 0',
              color: '#fff'
            }}>{stats.pendingOrders}</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}>
              <svg width="16" height="16" fill="#f59e0b" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <span style={{
                fontSize: '0.875rem',
                color: '#f59e0b'
              }}>Awaiting payment</span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #333',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '60px',
              height: '60px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '0 0 0 100%'
            }}></div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderRadius: '10px'
              }}>
                <svg width="24" height="24" fill="#ef4444" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </div>
              <h2 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#b0b0b0',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Cancelled Orders</h2>
            </div>
            <p style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: '0.5rem 0',
              color: '#fff'
            }}>{stats.cancelledOrders}</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}>
              <svg width="16" height="16" fill="#ef4444" viewBox="0 0 24 24">
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
              </svg>
              <span style={{
                fontSize: '0.875rem',
                color: '#ef4444'
              }}>Cancelled orders</span>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div style={{
          backgroundColor: '#1e1e1e',
          borderRadius: '12px',
          border: '1px solid #333',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: 0,
              color: '#fff'
            }}>Recent Orders</h2>
            <div style={{
              fontSize: '0.875rem',
              color: '#b0b0b0'
            }}>
              Total: {orders.length} orders
            </div>
          </div>

          {orders.length === 0 ? (
            <div style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              color: '#b0b0b0'
            }}>
              <svg width="64" height="64" fill="#444" viewBox="0 0 24 24" style={{ marginBottom: '1rem' }}>
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No orders yet</p>
              <p>Orders will appear here when created</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#252525',
                    borderBottom: '1px solid #333'
                  }}>
                    <th style={{
                      padding: '1rem 2rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Order ID</th>
                    <th style={{
                      padding: '1rem 2rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Status</th>
                    <th style={{
                      padding: '1rem 2rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, index) => (
                    <tr 
                      key={o.id}
                      style={{
                        borderBottom: '1px solid #333',
                        transition: 'background-color 0.2s',
                        backgroundColor: index % 2 === 0 ? '#1e1e1e' : '#252525'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#2a2a2a';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#1e1e1e' : '#252525';
                      }}
                    >
                      <td style={{
                        padding: '1.25rem 2rem',
                        fontWeight: '500',
                        color: '#fff',
                        fontSize: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            padding: '0.5rem',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            borderRadius: '8px'
                          }}>
                            <svg width="16" height="16" fill="#667eea" viewBox="0 0 24 24">
                              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                            </svg>
                          </div>
                          {o.id}
                        </div>
                      </td>
                      <td style={{
                        padding: '1.25rem 2rem'
                      }}>
                        <span style={getStatusStyle(o.status)}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{
                        padding: '1.25rem 2rem',
                        fontWeight: '600',
                        color: '#fff',
                        fontSize: '1.125rem'
                      }}>
                        ₱{parseFloat(o.total_amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(102, 126, 234, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '10px'
          }}>
            <svg width="20" height="20" fill="#667eea" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#b0b0b0',
              margin: 0
            }}>
              <strong style={{ color: '#fff' }}>Note:</strong> This dashboard shows real-time order data. 
              Use the POS system for creating new orders and processing payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}