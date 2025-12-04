import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Inventory() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Cashier') {
      alert('Access denied.');
      router.push('/login');
    } else {
      fetchProducts();
    }
  }, [router]);

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    if (res.ok && data.products) setProducts(data.products);
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
          alignItems: 'flex-start',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #333'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(45deg, #10b981, #059669)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 0.5rem 0'
            }}>Inventory View</h1>
            <p style={{
              fontSize: '1rem',
              color: '#b0b0b0',
              margin: 0
            }}>Read-only product listing</p>
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

        {/* Products Table */}
        <div style={{
          backgroundColor: '#1e1e1e',
          borderRadius: '12px',
          border: '1px solid #333',
          overflow: 'hidden',
          marginBottom: '2rem'
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
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px'
              }}>
                <svg width="20" height="20" fill="#10b981" viewBox="0 0 24 24">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                </svg>
              </div>
              Products ({products.length})
            </h2>
           
          </div>

          {products.length === 0 ? (
            <div style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              color: '#b0b0b0'
            }}>
              <svg width="64" height="64" fill="#444" viewBox="0 0 24 24" style={{ marginBottom: '1rem' }}>
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
              </svg>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No products yet</p>
              <p>Products will appear here when added by admin</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#252525'
                  }}>
                    <th style={{
                      padding: '1rem 2rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Product Name</th>
                    <th style={{
                      padding: '1rem 2rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Price</th>
                    <th style={{
                      padding: '1rem 2rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, index) => (
                    <tr 
                      key={p.id}
                      style={{
                        borderTop: '1px solid #333',
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
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '8px'
                          }}>
                            <svg width="16" height="16" fill="#10b981" viewBox="0 0 24 24">
                              <path d="M21 11.18V9.72c0-.47-.16-.92-.46-1.28L16.6 3.72c-.38-.46-.94-.72-1.54-.72H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h.18C3.6 16.16 4.7 17 6 17s2.4-.84 2.82-2h8.37c.41 1.16 1.51 2 2.82 2 1.66 0 3-1.34 3-3-.01-1.3-.85-2.4-2.01-2.82zM18.4 9H16V6.61L18.4 9zM4 5h7V4H4v1zm0 8v-2h8v2H4zm10 1c-.41 0-.77-.26-.91-.64-.25-.72-.93-1.36-1.91-1.36H8.82C8.4 12.84 7.3 12 6 12s-2.4.84-2.82 2H4v-1h8v1h-.18c-.41-1.16-1.51-2-2.82-2s-2.4.84-2.82 2H4v-2h8v2h1.18c.41 1.16 1.51 2 2.82 2s2.4-.84 2.82-2H20v2h-6z"/>
                            </svg>
                          </div>
                          {p.name}
                        </div>
                      </td>
                      <td style={{
                        padding: '1.25rem 2rem',
                        fontWeight: '600',
                        color: '#10b981',
                        fontSize: '1.125rem'
                      }}>
                        ${parseFloat(p.price).toFixed(2)}
                      </td>
                      <td style={{
                        padding: '1.25rem 2rem',
                        color: '#b0b0b0',
                        fontSize: '0.875rem',
                        maxWidth: '400px'
                      }}>
                        {p.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(102, 126, 234, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#b0b0b0',
            margin: 0
          }}>
            <strong style={{ color: '#fff' }}>Note:</strong> This is a read-only view. 
            Only administrators can add, edit, or remove products from the inventory.
          </p>
        </div>
      </div>
    </div>
  );
}