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
        return { color: 'green', fontWeight: 'bold' };
      case 'unpaid':
        return { color: 'orange', fontWeight: 'bold' };
      case 'cancelled':
        return { color: 'red', fontWeight: 'bold' };
      default:
        return {};
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Cashier Dashboard</h1>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ flex: 1, padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
          <h2>Total Income</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₱{stats.totalIncome.toFixed(2)}</p>
        </div>

        <div style={{ flex: 1, padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
          <h2>Pending Orders</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.pendingOrders}</p>
        </div>

        <div style={{ flex: 1, padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
          <h2>Cancelled Orders</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.cancelledOrders}</p>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem' }}>Recent Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td style={getStatusStyle(o.status)}>{o.status.toUpperCase()}</td>
                <td>₱{o.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
