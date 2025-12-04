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
      const res = await fetch('/api/admin/payment'); // same endpoint as admin
      const data = await res.json();

      if (res.ok && data.orders) {
        // Normalize status
        const normalizedOrders = data.orders.map(o => ({
          ...o,
          status: (o.status || 'pending').toLowerCase().trim()
        }));

        setOrders(normalizedOrders);

        // Calculate stats
        const totalIncome = normalizedOrders
          .filter(o => o.status === 'paid')
          .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

        const pendingOrders = normalizedOrders.filter(o =>
          o.status === 'pending' || o.status === 'unpaid'
        ).length;

        const cancelledOrders = normalizedOrders.filter(o =>
          o.status === 'cancelled'
        ).length;

        setStats({ totalIncome, pendingOrders, cancelledOrders });
      }
    } catch (err) {
      console.error('Fetch Orders Error:', err);
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
      case 'pending':
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            <p style={{ fontSize: '1rem', color: '#b0b0b0', margin: 0 }}>Monitor and manage all orders</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {/* Total Income */}
          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #333',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h2>Total Income</h2>
            <p>₱{stats.totalIncome.toFixed(2)}</p>
          </div>

          {/* Pending Orders */}
          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <h2>Pending Orders</h2>
            <p>{stats.pendingOrders}</p>
          </div>

          {/* Cancelled Orders */}
          <div style={{
            backgroundColor: '#1e1e1e',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <h2>Cancelled Orders</h2>
            <p>{stats.cancelledOrders}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ overflowX: 'auto', backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#252525' }}>
                <th style={{ padding: '1rem', color: '#b0b0b0' }}>Order ID</th>
                <th style={{ padding: '1rem', color: '#b0b0b0' }}>Status</th>
                <th style={{ padding: '1rem', color: '#b0b0b0' }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, index) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #333', backgroundColor: index % 2 === 0 ? '#1e1e1e' : '#252525' }}>
                  <td style={{ padding: '1rem', color: '#fff' }}>{o.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={getStatusStyle(o.status)}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#fff' }}>₱{parseFloat(o.total_amount || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
