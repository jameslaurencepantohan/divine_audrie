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

  // ✅ Allow raw typing (without forcing numbers)
  const handleQuantityChange = (productId, value) => {
    setOrderQuantities(prev => ({
      ...prev,
      [productId]: value // store raw input
    }));
  };

  // ✅ Convert to number only during submission
  const handleSubmitOrder = async () => {
    const productsToOrder = products
      .map(p => {
        const rawValue = orderQuantities[p.id] ?? "";
        const quantity = parseInt(rawValue, 10);

        return {
          id: p.id,
          quantity: !isNaN(quantity) && quantity > 0 ? quantity : 0,
          price: p.price
        };
      })
      .filter(p => p.quantity > 0);

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
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 0.5rem 0'
            }}>Create Order</h1>
            <p style={{
              fontSize: '1rem',
              color: '#b0b0b0',
              margin: 0
            }}>Select products and quantities to create an order</p>
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
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #444',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#667eea';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#444';
          }}
        />

        {/* Products List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {filteredProducts.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#b0b0b0',
              backgroundColor: '#1e1e1e',
              borderRadius: '8px',
              border: '1px solid #333'
            }}>
              <p style={{ margin: 0 }}>
                {search ? 'No products found' : 'No products available'}
              </p>
            </div>
          ) : (
            filteredProducts.map(p => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.5rem',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  backgroundColor: '#1e1e1e',
                  transition: 'border-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#444';
                }}
              >
                <div>
                  <strong style={{
                    fontSize: '1.125rem',
                    color: '#fff',
                    display: 'block',
                    marginBottom: '0.25rem'
                  }}>{p.name}</strong>
                  <div style={{ 
                    color: '#b0b0b0',
                    fontSize: '0.875rem'
                  }}>Price: ${p.price}</div>
                </div>

                <input
                  type="number"
                  min="0"
                  value={orderQuantities[p.id] ?? ''}   // allow blank input
                  onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                  style={{
                    width: '80px',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    backgroundColor: '#252525',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#444';
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Create Order Button */}
        <button
          onClick={handleSubmitOrder}
          style={{
            width: '100%',
            padding: '1.25rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s, transform 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0058c4';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#0070f3';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Create Order
        </button>
      </div>
    </div>
  );
}