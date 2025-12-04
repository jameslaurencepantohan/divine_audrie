import { sql } from '../../../lib/neon';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Allow GET for testing if you want, otherwise just 405
    return res.status(405).json({ message: 'Method not allowed. Use POST.' });
  }

  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if username exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await sql`
      INSERT INTO users (username, password, role)
      VALUES (${username}, ${hashedPassword}, ${role})
      RETURNING id, username, role
    `;
    const newUser = result[0];

    return res.status(201).json({
      message: 'Account created successfully!',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Register API error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
