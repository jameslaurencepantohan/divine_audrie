import { sql } from '../../../lib/neon';

export default async function handler(req, res) {
  try {
    // ======================
    // 🔵 GET → fetch all orders with items
    // ======================
    if (req.method === 'GET') {
      const orders = await sql`
        SELECT 
          id,
          customer_name,
          total_amount,
          created_at,
          status,
          paid_at,
          payment_method,
          cancelled_at,
          processed_by
        FROM orders
        ORDER BY created_at DESC;
      `;

      const items = await sql`
        SELECT 
          id,
          order_id,
          product_id,
          product_name,
          quantity,
          price
        FROM order_items 
        ORDER BY order_id DESC;
      `;

      const ordersWithItems = orders.map(order => ({
        ...order,
        items: items.filter(i => i.order_id === order.id),
        total_amount: parseFloat(order.total_amount) || 0
      }));

      return res.status(200).json({ 
        success: true,
        orders: ordersWithItems 
      });
    }

    // ======================
    // 🔵 POST → mark order as paid (with EXACT amount validation)
    // ======================
    if (req.method === 'POST') {
      const { order_id, amount_paid, payment_method } = req.body;

      if (!order_id || !amount_paid || !payment_method) {
        return res.status(400).json({ 
          success: false,
          message: "Order ID, amount paid, and payment method are required." 
        });
      }

      // Get current user from session/headers (adjust based on your auth)
      const user = JSON.parse(req.headers['x-user'] || '{"role": "Admin"}'); // Example
      const processedBy = user.role || 'Admin';

      // Get the order to validate amount
      const [order] = await sql`
        SELECT total_amount, status
        FROM orders
        WHERE id = ${order_id};
      `;

      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: "Order not found." 
        });
      }

      // Check if order is already paid or cancelled
      if (order.status === 'paid') {
        return res.status(400).json({ 
          success: false,
          message: "Order is already paid." 
        });
      }

      if (order.status === 'cancelled') {
        return res.status(400).json({ 
          success: false,
          message: "Order is cancelled and cannot be paid." 
        });
      }

      const totalAmount = parseFloat(order.total_amount);
      const paidAmount = parseFloat(amount_paid);

      // Validate amount
      if (isNaN(paidAmount) || paidAmount <= 0) {
        return res.status(400).json({ 
          success: false,
          message: "Amount paid must be greater than zero." 
        });
      }

      // Check for EXACT amount (not less, not more)
      if (paidAmount !== totalAmount) {
        return res.status(400).json({ 
          success: false,
          message: `Payment must be exact amount. Required: ₱${totalAmount.toFixed(2)}, Provided: ₱${paidAmount.toFixed(2)}`,
          details: {
            required_amount: totalAmount,
            provided_amount: paidAmount,
            difference: Math.abs(totalAmount - paidAmount).toFixed(2)
          }
        });
      }

      // Update order status to paid with who processed it
      const [updatedOrder] = await sql`
        UPDATE orders
        SET 
          status = 'paid',
          payment_method = ${payment_method},
          paid_at = NOW(),
          processed_by = ${processedBy}
        WHERE id = ${order_id}
        RETURNING 
          id,
          customer_name,
          total_amount,
          status,
          payment_method,
          paid_at,
          processed_by;
      `;

      return res.status(200).json({ 
        success: true,
        message: `Payment recorded successfully by ${processedBy}. Exact amount received.`,
        order: updatedOrder
      });
    }

    // ======================
    // 🔵 PUT → update order status (alternative method)
    // ======================
    if (req.method === 'PUT') {
      const { order_id, status, payment_method, amount_paid } = req.body;

      if (!order_id || !status) {
        return res.status(400).json({ 
          success: false,
          message: "Order ID and status are required." 
        });
      }

      // Get current user from session/headers
      const user = JSON.parse(req.headers['x-user'] || '{"role": "Admin"}');
      const processedBy = user.role || 'Admin';

      // Get current order status
      const [order] = await sql`
        SELECT status, total_amount
        FROM orders
        WHERE id = ${order_id};
      `;

      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: "Order not found." 
        });
      }

      let updateQuery;
      
      if (status === 'paid') {
        if (order.status === 'paid') {
          return res.status(400).json({ 
            success: false,
            message: "Order is already paid." 
          });
        }
        if (order.status === 'cancelled') {
          return res.status(400).json({ 
            success: false,
            message: "Cancelled orders cannot be paid." 
          });
        }
        
        const totalAmount = parseFloat(order.total_amount);
        const paidAmount = parseFloat(amount_paid || 0);
        
        if (paidAmount !== totalAmount) {
          return res.status(400).json({ 
            success: false,
            message: `Payment must be exact amount. Required: ₱${totalAmount.toFixed(2)}, Provided: ₱${paidAmount.toFixed(2)}`
          });
        }
        
        updateQuery = sql`
          UPDATE orders
          SET 
            status = 'paid',
            payment_method = ${payment_method || 'Cash'},
            paid_at = NOW(),
            processed_by = ${processedBy}
          WHERE id = ${order_id}
          RETURNING *;
        `;
      } else if (status === 'cancelled') {
        if (order.status === 'paid') {
          return res.status(400).json({ 
            success: false,
            message: "Paid orders cannot be cancelled." 
          });
        }
        if (order.status === 'cancelled') {
          return res.status(400).json({ 
            success: false,
            message: "Order is already cancelled." 
          });
        }
        
        updateQuery = sql`
          UPDATE orders
          SET 
            status = 'cancelled',
            cancelled_at = NOW(),
            processed_by = ${processedBy}
          WHERE id = ${order_id}
          RETURNING *;
        `;
      } else {
        return res.status(400).json({ 
          success: false,
          message: "Invalid status update." 
        });
      }

      const [updatedOrder] = await updateQuery;

      return res.status(200).json({ 
        success: true,
        message: `Order marked as ${status} successfully by ${processedBy}!`,
        order: updatedOrder
      });
    }

    // ======================
    // 🔵 DELETE → cancel order
    // ======================
    if (req.method === 'DELETE') {
      const { order_id } = req.body;

      if (!order_id) {
        return res.status(400).json({ 
          success: false,
          message: "Order ID is required." 
        });
      }

      // Get current user from session/headers
      const user = JSON.parse(req.headers['x-user'] || '{"role": "Admin"}');
      const processedBy = user.role || 'Admin';
      

      // Check if order exists and can be cancelled
      const [order] = await sql`
        SELECT status
        FROM orders
        WHERE id = ${order_id};
      `;

      if (!order) {
        return res.status(404).json({ 
          success: false,
          message: "Order not found." 
        });
      }

      if (order.status === 'paid') {
        return res.status(400).json({ 
          success: false,
          message: "Paid orders cannot be cancelled." 
        });
      }

      if (order.status === 'cancelled') {
        return res.status(400).json({ 
          success: false,
          message: "Order is already cancelled." 
        });
      }

      await sql`
        UPDATE orders
        SET 
          status = 'cancelled',
          cancelled_at = NOW(),
          processed_by = ${processedBy}
        WHERE id = ${order_id}
      `;

      return res.status(200).json({ 
        success: true,
        message: `Order cancelled successfully by ${processedBy}.` 
      });
    }

    // Invalid method
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ 
      success: false,
      message: `Method ${req.method} not allowed.` 
    });

  } catch (error) {
    console.error("Payment API Error:", error.message);
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}