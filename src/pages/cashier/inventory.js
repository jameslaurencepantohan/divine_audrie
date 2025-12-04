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
    <div style={{ padding: '2rem' }}>
      <h1>Inventory (Read-Only)</h1>

      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 600 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
