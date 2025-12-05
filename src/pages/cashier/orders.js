import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Orders() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orderQuantities, setOrderQuantities] = useState({});
  const [customerNames, setCustomerNames] = useState({});
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

  // Update order quantities
  const handleQuantityChange = (productId, value) => {
    setOrderQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  // Update customer names
  const handleCustomerNameChange = (productId, value) => {
    setCustomerNames(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  // Submit order
  const handleSubmitOrder = async () => {
    const productsToOrder = products
      .map(p => {
        const rawValue = orderQuantities[p.id] ?? "";
        const quantity = parseInt(rawValue, 10);
        const customerName = customerNames[p.id] || "";

        return {
          id: p.id,
          name: p.name,
          quantity: !isNaN(quantity) && quantity > 0 ? quantity : 0,
          price: p.price,
          customerName: customerName.trim()
        };
      })
      .filter(p => p.quantity > 0);

    if (productsToOrder.length === 0) {
      alert('Please select at least one product to create an order.');
      return;
    }

    // Check if all ordered products have customer names
    const productsWithoutCustomer = productsToOrder.filter(p => !p.customerName);
    if (productsWithoutCustomer.length > 0) {
      alert(`Please enter customer name for: ${productsWithoutCustomer.map(p => p.name).join(', ')}`);
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
      setCustomerNames({});
      setSearch('');
      fetchProducts();
    } else {
      alert(data.message);
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    return products.reduce((total, p) => {
      const rawValue = orderQuantities[p.id] ?? "";
      const quantity = parseInt(rawValue, 10);
      if (!isNaN(quantity) && quantity > 0) {
        return total + (p.price * quantity);
      }
      return total;
    }, 0);
  };

  // Count selected items
  const getSelectedItemsCount = () => {
    return products.filter(p => {
      const rawValue = orderQuantities[p.id] ?? "";
      const quantity = parseInt(rawValue, 10);
      return !isNaN(quantity) && quantity > 0;
    }).length;
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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

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
              background: 'linear-gradient(45deg, #f59e0b, #d97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Process Orders
            </h1>
            <p style={{ fontSize: '1rem', color: '#b0b0b0' }}>
              Cashier Order Processing
            </p>
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
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
            }}
          >
            Back
          </button>
        </div>

        {/* Order Summary */}
        <div style={{
          backgroundColor: '#1e1e1e',
          padding: '1rem 1.5rem',
          borderRadius: '10px',
          border: '1px solid #444',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>Order Summary</h3>
            <p style={{ margin: 0, color: '#b0b0b0', fontSize: '0.875rem' }}>
              {getSelectedItemsCount()} items selected
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f59e0b' }}>
              ₱{calculateTotal().toFixed(2)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b0b0b0' }}>Total Amount</div>
          </div>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem',
            marginBottom: '1.5rem',
            backgroundColor: '#1e1e1e',
            border: '1px solid #444',
            borderRadius: '10px',
            color: '#fff',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#f59e0b';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#444';
          }}
        />

        {/* Products */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {filteredProducts.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#b0b0b0',
              backgroundColor: '#1e1e1e',
              borderRadius: '12px',
              border: '1px solid #333'
            }}>
              <p style={{ margin: 0 }}>
                {search ? 'No products found' : 'No products available'}
              </p>
            </div>
          ) : (
            filteredProducts.map(p => {
              const quantity = parseInt(orderQuantities[p.id] ?? "0", 10);
              const hasQuantity = !isNaN(quantity) && quantity > 0;
              
              return (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: hasQuantity ? 'rgba(245, 158, 11, 0.05)' : '#1e1e1e',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${hasQuantity ? '#f59e0b' : '#444'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <strong style={{ fontSize: '1.125rem', color: '#fff' }}>{p.name}</strong>
                      <div style={{ color: '#b0b0b0', fontSize: '0.875rem' }}>
                        Price: ₱{parseFloat(p.price).toFixed(2)}
                        {hasQuantity && (
                          <span style={{ marginLeft: '1rem', color: '#10b981' }}>
                            Subtotal: ₱{(p.price * quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <input
                      type="number"
                      min="0"
                      placeholder="Qty"
                      value={orderQuantities[p.id] ?? ''}
                      onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                      style={{
                        width: '80px',
                        padding: '0.75rem',
                        backgroundColor: '#252525',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        color: '#fff',
                        textAlign: 'center',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f59e0b';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#444';
                      }}
                    />
                  </div>

                  {/* Customer Name Section */}
                  <div>
                    <label style={{
                      display: 'block',
                      color: '#b0b0b0',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      fontWeight: '500'
                    }}>
                      Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      value={customerNames[p.id] ?? ''}
                      onChange={(e) => handleCustomerNameChange(p.id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #444',
                        backgroundColor: '#252525',
                        color: '#fff',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f59e0b';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#444';
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Submit Order */}
        <button
          onClick={handleSubmitOrder}
          disabled={getSelectedItemsCount() === 0}
          style={{
            width: '100%',
            padding: '1.25rem',
            background: 'linear-gradient(45deg, #f59e0b, #d97706)',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: getSelectedItemsCount() === 0 ? 'not-allowed' : 'pointer',
            opacity: getSelectedItemsCount() === 0 ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            if (getSelectedItemsCount() > 0) {
              e.currentTarget.style.opacity = '0.9';
            }
          }}
          onMouseOut={(e) => {
            if (getSelectedItemsCount() > 0) {
              e.currentTarget.style.opacity = '1';
            }
          }}
        >
          {getSelectedItemsCount() > 0 ? (
            `Submit Order (${getSelectedItemsCount()} items)`
          ) : (
            'Select items to order'
          )}
        </button>

      </div>
    </div>
  );
}