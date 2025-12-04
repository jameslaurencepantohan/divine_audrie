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
    <div style={{ padding: '2rem' }}>
      <h1>Cashier Dashboard</h1>
      <p>Welcome, Cashier!</p>

      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={goToPOS} 
          style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
        >
          Home (POS)
        </button>
        <button 
          onClick={handleLogout} 
          style={{ padding: '0.5rem 1rem' }}
        >
          Logout
        </button>
      </div>

      <ul>
        <li><a href="/cashier/inventory">View Inventory</a></li>
        <li><a href="/cashier/orders">View Orders</a></li>
        <li><a href="/cashier/payment">View Payments</a></li>
      </ul>
    </div>
  );
}
