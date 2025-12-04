import { sql } from '../../../lib/neon';

export default async function handler(req, res) {
  try {
    // 1. Fetch all products (inventory)
    const products = await sql`
      SELECT * FROM products ORDER BY created_at DESC
    `;

    // 2. Fetch all orders and normalize status
    const orders = await sql`
      SELECT *, COALESCE(status, 'pending') AS status
      FROM orders
      ORDER BY created_at DESC
    `;

    // Normalize statuses to lowercase trimmed strings
    const normalizedOrders = orders.map(order => ({
      ...order,
      status: (order.status || 'pending').toLowerCase().trim(),
    }));

    // 3. Fetch all order items
    const orderItems = await sql`
      SELECT * FROM order_items ORDER BY order_id DESC
    `;

    // Attach order items to their respective orders
    const ordersWithItems = normalizedOrders.map(order => ({
      ...order,
      items: orderItems.filter(item => item.order_id === order.id),
    }));

    // 4. Calculate summary
    const totalIncome = normalizedOrders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

    const pending = normalizedOrders.filter(order => order.status === 'pending' || order.status === 'unpaid').length;

    const cancelled = normalizedOrders.filter(order => order.status === 'cancelled').length;

    // 5. Respond with all data combined
    return res.status(200).json({
      products,
      orders: ordersWithItems,
      summary: {
        totalIncome,
        pending,
        cancelled,
      },
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
