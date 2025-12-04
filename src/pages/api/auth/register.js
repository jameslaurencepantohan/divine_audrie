import { sql } from '../../../lib/neon';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Ensure JSON body is parsed
  let body;
  try {
    body = req.body;
  } catch {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  const { username, password, role } = body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user exists
    const existingUsers = await sql`SELECT id FROM users WHERE username = ${username}`;
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
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
      user: newUser,
    });
  } catch (err) {
    console.error('Register API error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
