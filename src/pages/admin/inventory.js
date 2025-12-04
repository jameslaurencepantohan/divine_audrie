import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Inventory() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Admin') {
      alert('Access denied.');
      router.push('/login');
    } else {
      fetchProducts();
    }
  }, [router]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (res.ok && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setForm({ name: '', price: '', description: '' });
        fetchProducts();
      } else {
        alert(data.message || 'Failed to add product.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setIsSubmitting(false);
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
            }}>Inventory Management</h1>
            <p style={{
              fontSize: '1rem',
              color: '#b0b0b0',
              margin: 0
            }}>Add, view, and manage your products</p>
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
            Back to Dashboard
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Add Product Form */}
          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
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
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              Add New Product
            </h2>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#b0b0b0'
                }}>
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#252525',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#444';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#b0b0b0'
                }}>
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#252525',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#444';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#b0b0b0'
                }}>
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    backgroundColor: '#252525',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#444';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = '#059669';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = '#10b981';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg width="20" height="20" fill="white" className="spin" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    </svg>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Add Product
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Product List */}
          <div>
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
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '8px'
                }}>
                  <svg width="20" height="20" fill="#667eea" viewBox="0 0 24 24">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                  </svg>
                </div>
                Product List ({products.length})
              </h2>
           
            </div>

            {products.length === 0 ? (
              <div style={{
                backgroundColor: '#1e1e1e',
                padding: '3rem 2rem',
                borderRadius: '12px',
                border: '1px dashed #444',
                textAlign: 'center',
                color: '#b0b0b0'
              }}>
                <svg width="64" height="64" fill="#444" viewBox="0 0 24 24" style={{ marginBottom: '1rem' }}>
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                </svg>
                <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No products yet</p>
                <p>Add your first product using the form on the left</p>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#1e1e1e',
                borderRadius: '12px',
                border: '1px solid #333',
                overflow: 'hidden'
              }}>
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
                          padding: '1rem 1.5rem',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          color: '#b0b0b0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>Product Name</th>
                        <th style={{
                          padding: '1rem 1.5rem',
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          color: '#b0b0b0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>Price</th>
                        <th style={{
                          padding: '1rem 1.5rem',
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
                            borderBottom: index === products.length - 1 ? 'none' : '1px solid #333',
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
                            padding: '1.25rem 1.5rem',
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
                            padding: '1.25rem 1.5rem',
                            fontWeight: '600',
                            color: '#fff',
                            fontSize: '1.125rem'
                          }}>
                            ${parseFloat(p.price).toFixed(2)}
                          </td>
                          <td style={{
                            padding: '1.25rem 1.5rem',
                            color: '#b0b0b0',
                            fontSize: '0.875rem',
                            maxWidth: '300px'
                          }}>
                            {p.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '10px'
          }}>
            <svg width="20" height="20" fill="#10b981" viewBox="0 0 24 24">
              <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#b0b0b0',
              margin: 0
            }}>
              <strong style={{ color: '#fff' }}>Inventory Summary:</strong> You have {products.length} products in your inventory. 
              All products are displayed in real-time and updated automatically.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}