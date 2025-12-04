import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Orders() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orderQuantities, setOrderQuantities] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Admin') {
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

  const handleQuantityChange = (productId, value) => {
    let quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 0) quantity = 0;

    setOrderQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const handleSubmitOrder = async () => {
    const productsToOrder = products
      .filter(p => orderQuantities[p.id] > 0)
      .map(p => ({
        id: p.id,
        quantity: orderQuantities[p.id],
        price: p.price
      }));

    if (productsToOrder.length === 0) {
      alert('Please select at least one product to create an order.');
      return;
    }

    const res = await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: productsToOrder })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      setOrderQuantities({});
      setSearch('');
      fetchProducts();
    } else {
      alert(data.message);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Order</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          marginBottom: '1.5rem',
          fontSize: '1rem',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredProducts.map(p => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              backgroundColor: '#fafafa'
            }}
          >
            <div>
              <strong>{p.name}</strong>
              <div style={{ color: '#555' }}>Price: ${p.price}</div>
            </div>
            <input
              type="number"
              min="0"
              value={orderQuantities[p.id] || 0}
              onChange={(e) => handleQuantityChange(p.id, e.target.value)}
              style={{
                width: 60,
                padding: '0.25rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                textAlign: 'center'
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmitOrder}
        style={{
          marginTop: '2rem',
          padding: '1rem',
          width: '100%',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1.1rem',
          cursor: 'pointer'
        }}
      >
        Create Order
      </button>
    </div>
  );
}
