import { useEffect } from 'react';

export default function TestRegister() {
  useEffect(() => {
    async function testRegister() {
      try {
        const payload = {
          username: 'testuser123',
          password: 'password123',
          role: 'Cashier'
        };

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        console.log('Response status:', res.status);

        // Try to parse JSON safely
        let data;
        try {
          data = await res.json();
        } catch (err) {
          console.error('Failed to parse JSON:', err);
        }

        console.log('Response body:', data);

      } catch (err) {
        console.error('Fetch error:', err);
      }
    }

    testRegister();
  }, []);

  return (
    <div>
      <h1>Test Register API</h1>
      <p>Check your console for output.</p>
    </div>
  );
}