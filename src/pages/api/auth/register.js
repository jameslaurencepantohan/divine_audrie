import { sql } from '../../../lib/neon';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') 
    return res.status(405).json({ message: 'Method not allowed' });

  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the username already exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with role and return the new row
    const [newUser] = await sql`
      INSERT INTO users (username, password, role)
      VALUES (${username}, ${hashedPassword}, ${role})
      RETURNING *;
    `;

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
