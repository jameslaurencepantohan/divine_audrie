import { db } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    // 1. Fetch all products (inventory)
    const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');

    // 2. Fetch all orders
    const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');

    // 3. Fetch all order items
    const [orderItems] = await db.query('SELECT * FROM order_items ORDER BY order_id DESC');

    // Attach order items to their respective orders
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: orderItems.filter(item => item.order_id === order.id),
    }));

    // 4. Calculate summary

    // Total income: sum of total_amount for paid orders
    const totalIncome = orders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

    // Pending orders count (status = 'unpaid' or 'pending')
    const pending = orders.filter(order => order.status === 'unpaid' || order.status === 'pending').length;

    // Cancelled orders count (status = 'cancelled')
    const cancelled = orders.filter(order => order.status === 'cancelled').length;

    // Respond with all data combined
    return res.status(200).json({
      products,
      orders: ordersWithItems,
      summary: {
        totalIncome,
        pending,
        cancelled
      }
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
