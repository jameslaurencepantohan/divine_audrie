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
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h1>Orders (Read-Only)</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredProducts.map(p => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <div>
              <strong>{p.name}</strong>
              <div style={{ fontSize: '0.9rem', color: '#555' }}>
                Price: ${p.price}
              </div>
            </div>
            <input
              type="number"
              value={0}
              disabled
              style={{ width: 60, padding: '0.25rem', backgroundColor: '#eee' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
