import { sql } from '../../../lib/neon';

export default async function handler(req, res) {
  try {

    // ======================
    // 🔵 CREATE ORDER
    // ======================
    if (req.method === 'POST') {
      const { products } = req.body;

      if (!products || !products.length) {
        return res.status(400).json({ message: 'No products selected.' });
      }

      // Fetch product data from DB
      const productIds = products.map(p => p.id);

      const dbProducts = await sql`
        SELECT id, name, price
        FROM products
        WHERE id IN (${sql(productIds)})
      `;

      // Validate that all selected products exist
      for (const ordered of products) {
        const found = dbProducts.find(p => p.id === ordered.id);
        if (!found) {
          return res.status(400).json({ message: `Product ID ${ordered.id} not found.` });
        }
      }

      // Calculate total
      let totalAmount = 0;
      for (const ordered of products) {
        const found = dbProducts.find(p => p.id === ordered.id);
        totalAmount += found.price * ordered.quantity;
      }

      // Insert order
      const [orderResult] = await sql`
        INSERT INTO orders (customer_name, total_amount)
        VALUES ('Admin', ${totalAmount})
        RETURNING *;
      `;

      const orderId = orderResult.id;

      // Insert each item into order_items table
      for (const ordered of products) {
        const found = dbProducts.find(p => p.id === ordered.id);

        await sql`
          INSERT INTO order_items
            (order_id, product_id, product_name, quantity, price)
          VALUES
            (${orderId}, ${found.id}, ${found.name}, ${ordered.quantity}, ${found.price});
        `;
      }

      return res.status(200).json({
        message: 'Order created successfully!',
        orderId,
      });
    }

    // ======================
    // 🔵 GET ORDERS + ITEMS
    // ======================
    if (req.method === 'GET') {
      // Fetch all orders
      const orders = await sql`
        SELECT * FROM orders ORDER BY created_at DESC
      `;

      // Fetch all items
      const items = await sql`
        SELECT id, order_id, product_id, product_name, quantity, price
        FROM order_items
        ORDER BY order_id DESC
      `;

      // Attach items to corresponding orders
      const ordersWithItems = orders.map(order => ({
        ...order,
        items: items.filter(i => i.order_id === order.id),
      }));

      return res.status(200).json({ orders: ordersWithItems });
    }

    // Invalid method
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });

  } catch (error) {
    console.error('Order API Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
