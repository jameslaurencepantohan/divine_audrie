import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PaymentPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (user.role !== 'Cashier' && user.role !== 'Admin')) {
      alert('Access denied.');
      router.push('/login');
    } else {
      fetchOrders();
    }
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/payment');
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      } else {
        alert('Failed to fetch orders.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to fetch orders.');
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setAmountPaid(order.total_amount);
    setPaymentMethod('Cash'); // reset payment method on new selection
  };

  const handleSubmitPayment = async () => {
    if (!selectedOrder) return alert("Select an order first.");
    if (!amountPaid) return alert("Enter amount paid.");

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
        alert("Payment successful!");
        setSelectedOrder(null);
        setAmountPaid('');
        setPaymentMethod('Cash');
        fetchOrders();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Payment failed.');
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
        alert("Order cancelled successfully!");
        setSelectedOrder(null);
        fetchOrders();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to cancel order.');
    }
  };

  // Disable actions if order is already paid or cancelled
  const isActionDisabled = selectedOrder && (selectedOrder.status === 'paid' || selectedOrder.status === 'cancelled');

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Payment Management</h1>

      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>₱{o.total_amount}</td>
                <td style={{ color: o.status === 'cancelled' ? 'red' : o.status === 'paid' ? 'green' : 'black', fontWeight: 'bold' }}>
                  {o.status.toUpperCase()}
                </td>
                <td>
                  <button onClick={() => handleSelectOrder(o)}>View Items</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div style={{ padding: "1rem", border: "1px solid #aaa", borderRadius: 4 }}>
          <h2>Order #{selectedOrder.id}</h2>

          <h3>Order Items</h3>
          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map(item => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>₱{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total: ₱{selectedOrder.total_amount}</h3>

          {isActionDisabled ? (
            <p style={{ color: selectedOrder.status === 'paid' ? 'green' : 'red', fontWeight: 'bold', marginTop: '1rem' }}>
              This order is already <span>{selectedOrder.status.toUpperCase()}</span>. Payment and cancellation are disabled.
            </p>
          ) : (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label>Amount Paid:</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  style={{ display: "block", margin: "0.5rem 0", padding: "0.5rem", width: "100%" }}
                />

                <label>Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ display: "block", margin: "0.5rem 0", padding: "0.5rem", width: "100%" }}
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Gcash">Gcash</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={handleSubmitPayment}
                  style={{ padding: "0.5rem 1rem", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
                >
                  Submit Payment
                </button>

                <button
                  onClick={handleCancelOrder}
                  style={{ padding: "0.5rem 1rem", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
                >
                  Cancel Order
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
