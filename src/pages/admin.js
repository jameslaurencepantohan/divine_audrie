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
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '1rem', margin: '2rem 0' }}>
        <button onClick={() => router.push('/admin/home')}>Home</button>
        <button onClick={() => router.push('/admin/inventory')}>Inventory</button>
        <button onClick={() => router.push('/admin/orders')}>Orders</button>
        <button onClick={() => router.push('/admin/payment')}>Payment</button>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
