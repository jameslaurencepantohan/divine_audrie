import { db } from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if a user exists with username and role
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? AND role = ?',
      [username, role]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials or role' });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials or role' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
