  import React, { useEffect, useState } from 'react';
  import { useRouter } from 'next/router';

  export default function Inventory() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', description: '' });

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'Admin') {
        alert('Access denied.');
        router.push('/login');
      } else {
        fetchProducts();
      }
    }, [router]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        if (res.ok && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleAddProduct = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          setForm({ name: '', price: '', description: '' });
          fetchProducts();
        } else {
          alert(data.message || 'Failed to add product.');
        }
      } catch (err) {
        console.error(err);
        alert('Something went wrong.');
      }
    };

    return (
      <div style={{ padding: '2rem' }}>
        <h1>Inventory Management</h1>

        <form
          onSubmit={handleAddProduct}
          style={{
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: 400
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <button type="submit">Add Product</button>
        </form>

        <h2>Product List</h2>

        {products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 600 }}
          >
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
