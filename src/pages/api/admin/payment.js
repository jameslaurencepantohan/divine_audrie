import { sql } from '../../../lib/neon';

export default async function handler(req, res) {
  try {
    // ======================
    // 🔵 GET → fetch all orders with items
    // ======================
    if (req.method === 'GET') {
      const orders = await sql`
        SELECT *, COALESCE(status, 'pending') AS status
        FROM orders
        ORDER BY created_at DESC;
      `;

      const items = await sql`
        SELECT * FROM order_items ORDER BY order_id DESC;
      `;

      const ordersWithItems = orders.map(order => ({
        ...order,
        items: items.filter(i => i.order_id === order.id),
      }));

      return res.status(200).json({ orders: ordersWithItems });
    }

    // ======================
    // 🔵 POST → mark order as paid
    // ======================
    if (req.method === 'POST') {
      const { order_id, payment_method } = req.body;

      if (!order_id || !payment_method) {
        return res.status(400).json({ message: "Order ID and payment method are required." });
      }

      await sql`
        UPDATE orders
        SET status = 'paid',
            payment_method = ${payment_method},
            paid_at = NOW()
        WHERE id = ${order_id};
      `;

      return res.status(200).json({ message: "Payment recorded successfully." });
    }

    // ======================
    // 🔵 DELETE → cancel order
    // ======================
    if (req.method === 'DELETE') {
      const { order_id } = req.body;

      if (!order_id) {
        return res.status(400).json({ message: "Order ID is required." });
      }

      await sql`
        UPDATE orders
        SET status = 'cancelled',
            cancelled_at = NOW()
        WHERE id = ${order_id};
      `;

      return res.status(200).json({ message: "Order cancelled successfully." });
    }

    // Invalid method
    res.setHeader("Allow", ["GET","POST","DELETE"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed.` });

  } catch (error) {
    console.error("Payment API Error:", error.message);
    console.error(error.stack);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
}
