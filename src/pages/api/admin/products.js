import { db } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
      return res.status(200).json({ products: rows });
    }

    if (req.method === 'POST') {
      const { name, price, description } = req.body;

      if (!name || !price || !description) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const result = await db.query(
        `INSERT INTO products (name, price, description)
         VALUES (?, ?, ?)`,
        [name, price, description]
      );

      return res.status(200).json({
        message: 'Product added successfully!',
        productId: result.insertId
      });
    }

    if (req.method === 'PUT') {
      const { id, name, price, description } = req.body;

      if (!id || !name || !price || !description) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      await db.query(
        `UPDATE products
         SET name=?, price=?, description=?, updated_at=NOW()
         WHERE id=?`,
        [name, price, description, id]
      );

      return res.status(200).json({ message: 'Product updated successfully.' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'Product ID is required.' });
      }

      await db.query('DELETE FROM products WHERE id=?', [id]);
      return res.status(200).json({ message: 'Product deleted successfully.' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} not allowed.` });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
