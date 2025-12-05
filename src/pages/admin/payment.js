import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminPaymentPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Admin') {
      alert('Access denied.');
      router.push('/login');
    } else {
      fetchOrders();
    }
  }, [router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/payment');
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
      else alert(data.message || 'Failed to load orders.');
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setAmountPaid(order.total_amount);
    setPaymentMethod('Cash');
    setErrorMessage('');
  };

  const handleAmountChange = (value) => {
    setAmountPaid(value);
    setErrorMessage('');
    
    if (selectedOrder && value) {
      const amount = parseFloat(value);
      const totalAmount = parseFloat(selectedOrder.total_amount);
      
      if (isNaN(amount)) {
        setErrorMessage('Please enter a valid number');
      } else if (amount <= 0) {
        setErrorMessage('Amount must be greater than zero');
      } else if (amount !== totalAmount) {
        setErrorMessage(`Payment must be EXACT amount: ₱${totalAmount.toFixed(2)}`);
      }
    }
  };

  const handleSubmitPayment = async () => {
    if (!selectedOrder) return alert("Select an order first.");
    if (!amountPaid) return alert("Enter amount paid.");

    const amount = parseFloat(amountPaid);
    const totalAmount = parseFloat(selectedOrder.total_amount);

    if (isNaN(amount) || amount <= 0) {
      return alert("Amount paid must be greater than zero.");
    }

    if (amount !== totalAmount) {
      return alert(`Payment must be EXACT amount: ₱${totalAmount.toFixed(2)}`);
    }

    try {
      const res = await fetch('/api/admin/payment', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          amount_paid: amountPaid,
          payment_method: paymentMethod
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Payment successful!");
        setSelectedOrder(null);
        setAmountPaid('');
        setPaymentMethod('Cash');
        setErrorMessage('');
        fetchOrders();
      } else {
        alert(data.message || "Payment failed.");
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return alert("Select an order first.");

    if (!confirm(`Are you sure you want to cancel order #${selectedOrder.id}?`)) return;

    try {
      const res = await fetch('/api/admin/payment', {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: selectedOrder.id })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Order cancelled successfully!");
        setSelectedOrder(null);
        setErrorMessage('');
        fetchOrders();
      } else {
        alert(data.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Failed to cancel order.');
    }
  };

  // Disable actions if order is already paid or cancelled
  const isActionDisabled = selectedOrder && 
    (selectedOrder.status === 'paid' || selectedOrder.status === 'cancelled');
  
  // Check if amount paid is exact
  const isAmountExact = () => {
    if (!selectedOrder || !amountPaid) return false;
    const amount = parseFloat(amountPaid);
    const totalAmount = parseFloat(selectedOrder.total_amount);
    return amount === totalAmount && amount > 0;
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#b0b0b0';
    }
  };

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid': return 'PAID';
      case 'pending': return 'PENDING';
      case 'cancelled': return 'CANCELLED';
      default: return status?.toUpperCase() || 'UNKNOWN';
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header with Back Button */}
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
            }}>Payment Management</h1>
            <p style={{
              fontSize: '1rem',
              color: '#b0b0b0',
              margin: 0
            }}>Process payments and manage orders</p>
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

        {/* Orders Table */}
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
              color: '#fff'
            }}>Orders</h2>
            <button
              onClick={fetchOrders}
              disabled={loading}
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              <svg width="16" height="16" fill="#10b981" viewBox="0 0 24 24">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {loading && orders.length === 0 ? (
            <div style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              color: '#b0b0b0'
            }}>
              <div className="spinner" style={{
                width: '40px',
                height: '40px',
                border: '3px solid #333',
                borderTop: '3px solid #10b981',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              color: '#b0b0b0'
            }}>
              <svg width="64" height="64" fill="#444" viewBox="0 0 24 24" style={{ marginBottom: '1rem' }}>
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No orders found</p>
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
                    }}>Order ID</th>
                    <th style={{
                      padding: '1rem 2rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Customer</th>
                    <th style={{
                      padding: '1rem 2rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Total Amount</th>
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
                    }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, index) => (
                    <tr 
                      key={o.id}
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
                      }}>#{o.id}</td>
                      <td style={{
                        padding: '1.25rem 2rem',
                        fontWeight: '500',
                        color: '#fff',
                        fontSize: '1rem'
                      }}>{o.customer_name || 'Customer'}</td>
                      <td style={{
                        padding: '1.25rem 2rem',
                        fontWeight: '600',
                        color: '#fff',
                        fontSize: '1.125rem'
                      }}>₱{parseFloat(o.total_amount || 0).toFixed(2)}</td>
                      <td style={{
                        padding: '1.25rem 2rem'
                      }}>
                        <span style={{
                          color: getStatusColor(o.status),
                          fontWeight: '600',
                          backgroundColor: `${getStatusColor(o.status)}20`,
                          padding: '4px 12px',
                          borderRadius: '20px',
                          display: 'inline-block'
                        }}>
                          {getStatusText(o.status)}
                        </span>
                      </td>
                      <td style={{
                        padding: '1.25rem 2rem'
                      }}>
                        <button
                          onClick={() => handleSelectOrder(o)}
                          disabled={o.status === 'paid' || o.status === 'cancelled'}
                          style={{
                            backgroundColor: (o.status === 'paid' || o.status === 'cancelled') 
                              ? 'rgba(107, 114, 128, 0.1)' 
                              : 'rgba(102, 126, 234, 0.1)',
                            color: (o.status === 'paid' || o.status === 'cancelled') 
                              ? '#6b7280' 
                              : '#667eea',
                            border: `1px solid ${(o.status === 'paid' || o.status === 'cancelled') 
                              ? 'rgba(107, 114, 128, 0.3)' 
                              : 'rgba(102, 126, 234, 0.3)'}`,
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: (o.status === 'paid' || o.status === 'cancelled') 
                              ? 'not-allowed' 
                              : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            opacity: (o.status === 'paid' || o.status === 'cancelled') ? 0.6 : 1
                          }}
                          onMouseOver={(e) => {
                            if (!(o.status === 'paid' || o.status === 'cancelled')) {
                              e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!(o.status === 'paid' || o.status === 'cancelled')) {
                              e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                            }
                          }}
                        >
                          {o.status === 'paid' ? 'Already Paid' : 
                           o.status === 'cancelled' ? 'Cancelled' : 
                           'View Details'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Order Details */}
        {selectedOrder && (
          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #333',
            marginTop: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #333'
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
                <svg width="24" height="24" fill="#667eea" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
                Order #{selectedOrder.id} - {selectedOrder.customer_name || 'Customer'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  color: getStatusColor(selectedOrder.status),
                  fontWeight: '600',
                  backgroundColor: `${getStatusColor(selectedOrder.status)}20`,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.875rem'
                }}>
                  {getStatusText(selectedOrder.status)}
                </span>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setErrorMessage('');
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#b0b0b0',
                    border: '1px solid #444',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#333';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Order Items */}
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#fff'
            }}>Order Items</h3>
            <div style={{
              backgroundColor: '#252525',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '1.5rem'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#2a2a2a'
                  }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Product Name</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Quantity</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Price</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#b0b0b0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item, index) => (
                    <tr 
                      key={item.id || index}
                      style={{
                        borderTop: '1px solid #333',
                        backgroundColor: index % 2 === 0 ? '#252525' : '#2a2a2a'
                      }}
                    >
                      <td style={{
                        padding: '1rem',
                        color: '#fff',
                        fontWeight: '500'
                      }}>{item.product_name || 'Product'}</td>
                      <td style={{
                        padding: '1rem',
                        color: '#fff',
                        fontWeight: '500'
                      }}>{item.quantity || 0}</td>
                      <td style={{
                        padding: '1rem',
                        color: '#fff',
                        fontWeight: '500'
                      }}>₱{parseFloat(item.price || 0).toFixed(2)}</td>
                      <td style={{
                        padding: '1rem',
                        color: '#fff',
                        fontWeight: '500'
                      }}>₱{((item.quantity || 0) * parseFloat(item.price || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: '#252525',
              borderRadius: '8px'
            }}>
              <span style={{
                fontSize: '1rem',
                color: '#b0b0b0'
              }}>Total Amount:</span>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#10b981'
              }}>₱{parseFloat(selectedOrder.total_amount || 0).toFixed(2)}</span>
            </div>

            {!isActionDisabled && (
              <div style={{
                backgroundColor: '#252525',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #333'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#fff'
                }}>Process Payment</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#b0b0b0'
                  }}>
                    Amount Paid (Must be exact: ₱{parseFloat(selectedOrder.total_amount || 0).toFixed(2)}):
                  </label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      backgroundColor: '#1e1e1e',
                      border: errorMessage ? '1px solid #ef4444' : '1px solid #444',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = errorMessage ? '#ef4444' : '#10b981';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errorMessage ? '#ef4444' : '#444';
                    }}
                  />
                  {errorMessage && (
                    <div style={{
                      color: '#ef4444',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <svg width="16" height="16" fill="#ef4444" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      {errorMessage}
                    </div>
                  )}
                  
                  {amountPaid && isAmountExact() && (
                    <div style={{
                      color: '#10b981',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <svg width="16" height="16" fill="#10b981" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <span>Payment amount is correct ✓</span>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#b0b0b0'
                  }}>Payment Method:</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      backgroundColor: '#1e1e1e',
                      border: '1px solid #444',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#444';
                    }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Gcash">Gcash</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleSubmitPayment}
                    disabled={!isAmountExact()}
                    style={{
                      flex: 1,
                      backgroundColor: isAmountExact() ? '#10b981' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: isAmountExact() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (isAmountExact()) {
                        e.currentTarget.style.backgroundColor = '#059669';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (isAmountExact()) {
                        e.currentTarget.style.backgroundColor = '#10b981';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Submit Payment
                  </button>

                  <button
                    onClick={handleCancelOrder}
                    style={{
                      flex: 1,
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Cancel Order
                  </button>
                </div>
              </div>
            )}

            {isActionDisabled && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#ef4444',
                  fontWeight: '600',
                  margin: 0,
                  fontSize: '1.125rem'
                }}>
                  This order has been {getStatusText(selectedOrder.status)}. Action buttons are disabled.
                </p>
              </div>
            )}
          </div>
        )}

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}