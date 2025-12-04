import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Orders() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

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

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#121212',
      color: '#e0e0e0',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
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
              background: 'linear-gradient(45deg, #f59e0b, #d97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 0.5rem 0'
            }}>Orders View</h1>
            <p style={{
              fontSize: '1rem',
              color: '#b0b0b0',
              margin: 0
            }}>Read-only product listing for reference</p>
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

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: '2rem'
        }}>
          <div style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666'
          }}>
            <svg width="20" height="20" fill="#666" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              backgroundColor: '#1e1e1e',
              border: '1px solid #444',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '1rem',
              transition: 'border-color 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#f59e0b';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#444';
            }}
          />
        </div>

        {/* Products List */}
        <div style={{
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
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
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '8px'
              }}>
                <svg width="20" height="20" fill="#f59e0b" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
              Available Products ({filteredProducts.length})
            </h2>
           
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{
              backgroundColor: '#1e1e1e',
              padding: '3rem 2rem',
              borderRadius: '12px',
              border: '1px dashed #444',
              textAlign: 'center',
              color: '#b0b0b0'
            }}>
              <svg width="64" height="64" fill="#444" viewBox="0 0 24 24" style={{ marginBottom: '1rem' }}>
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                {search ? 'No products found' : 'No products available'}
              </p>
              <p>
                {search 
                  ? 'Try a different search term' 
                  : 'Products will appear here when added by admin'
                }
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #444',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#f59e0b';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#444';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        padding: '0.5rem',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderRadius: '8px'
                      }}>
                        <svg width="20" height="20" fill="#667eea" viewBox="0 0 24 24">
                          <path d="M21 11.18V9.72c0-.47-.16-.92-.46-1.28L16.6 3.72c-.38-.46-.94-.72-1.54-.72H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h.18C3.6 16.16 4.7 17 6 17s2.4-.84 2.82-2h8.37c.41 1.16 1.51 2 2.82 2 1.66 0 3-1.34 3-3-.01-1.3-.85-2.4-2.01-2.82zM18.4 9H16V6.61L18.4 9zM4 5h7V4H4v1zm0 8v-2h8v2H4zm10 1c-.41 0-.77-.26-.91-.64-.25-.72-.93-1.36-1.91-1.36H8.82C8.4 12.84 7.3 12 6 12s-2.4.84-2.82 2H4v-1h8v1h-.18c-.41-1.16-1.51-2-2.82-2s-2.4.84-2.82 2H4v-2h8v2h1.18c.41 1.16 1.51 2 2.82 2s2.4-.84 2.82-2H20v2h-6z"/>
                        </svg>
                      </div>
                      <strong style={{
                        fontSize: '1.125rem',
                        color: '#fff'
                      }}>{p.name}</strong>
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      marginLeft: '3rem'
                    }}>
                      <div style={{ marginBottom: '0.25rem' }}>{p.description}</div>
                      <div style={{
                        fontWeight: '600',
                        color: '#10b981',
                        fontSize: '1rem'
                      }}>Price: ${parseFloat(p.price).toFixed(2)}</div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={0}
                    disabled
                    style={{
                      width: '80px',
                      padding: '0.75rem',
                      backgroundColor: '#252525',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      color: '#b0b0b0',
                      fontSize: '1rem',
                      textAlign: 'center',
                      cursor: 'not-allowed',
                      opacity: 0.5
                    }}
                  />
                </div>
              ))}
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
            <strong style={{ color: '#fff' }}>Note:</strong> This is a read-only view for reference. 
            Quantity input is disabled. Use the POS system to create actual orders.
          </p>
        </div>
      </div>
    </div>
  );
}