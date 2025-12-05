import { sql } from '../../../lib/neon';

export default async function handler(req, res) {
  try {
    // ======================
    // 🔵 CREATE ORDER
    // ======================
    if (req.method === 'POST') {
      const { products } = req.body;

      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'No products selected.' });
      }

      const productIds = products.map(p => Number(p.id)).filter(Boolean);
      if (!productIds.length) {
        return res.status(400).json({ message: 'Invalid product IDs.' });
      }

      // Fetch product data
      const dbProducts = await sql`
        SELECT id, name, price
        FROM products
        WHERE id = ANY(${productIds})
      `;

      if (!dbProducts || dbProducts.length === 0) {
        return res.status(400).json({ message: 'Selected products not found.' });
      }

      // Validate all products exist and have customer names
      for (const ordered of products) {
        const found = dbProducts.find(p => Number(p.id) === Number(ordered.id));
        if (!found) {
          return res.status(400).json({ message: `Product ID ${ordered.id} not found.` });
        }
        if (!ordered.customerName || ordered.customerName.trim() === '') {
          return res.status(400).json({ 
            message: `Customer name is required for product: ${found.name}` 
          });
        }
      }

      // Group products by customer name
      const ordersByCustomer = {};
      products.forEach(ordered => {
        const customerName = ordered.customerName.trim();
        if (!ordersByCustomer[customerName]) {
          ordersByCustomer[customerName] = [];
        }
        ordersByCustomer[customerName].push(ordered);
      });

      // Create separate order for each customer
      const createdOrders = [];
      
      for (const [customerName, customerProducts] of Object.entries(ordersByCustomer)) {
        // Calculate total amount for this customer's order
        const totalAmount = customerProducts.reduce((sum, ordered) => {
          const found = dbProducts.find(p => Number(p.id) === Number(ordered.id));
          return sum + found.price * ordered.quantity;
        }, 0);

        // Insert order with customer name (other columns will use default values)
        const [orderResult] = await sql`
          INSERT INTO orders (customer_name, total_amount, status)
          VALUES (${customerName}, ${totalAmount}, 'pending')
          RETURNING *;
        `;

        const orderId = orderResult?.id;
        if (!orderId) {
          return res.status(500).json({ message: 'Failed to create order.' });
        }

        // Insert order items for this customer
        for (const ordered of customerProducts) {
          const found = dbProducts.find(p => Number(p.id) === Number(ordered.id));
          await sql`
            INSERT INTO order_items
              (order_id, product_id, product_name, quantity, price, customer_name)
            VALUES
              (${orderId}, ${found.id}, ${found.name}, ${ordered.quantity}, ${found.price}, ${customerName});
          `;
        }

        createdOrders.push({
          orderId,
          customerName,
          totalAmount,
          productCount: customerProducts.length
        });
      }

      return res.status(201).json({
        message: `${Object.keys(ordersByCustomer).length} order(s) created successfully!`,
        orders: createdOrders
      });
    }

    // ======================
    // 🔵 GET ORDERS + ITEMS
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
        order_items: items.filter(i => i.order_id === order.id),
      }));

      return res.status(200).json({ orders: ordersWithItems });
    }

    // Invalid method
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });

  } catch (error) {
    console.error('Orders API Error:', error.message);
    console.error(error.stack);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
}