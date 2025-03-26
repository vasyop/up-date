import express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

(async () => {
  const { JSONFilePreset } = await import('lowdb/node');

  const db = await JSONFilePreset('db.json', {
    users: [] as { phone: string; password: string }[],
  });

  // Create user endpoint
  app.post('/create-user', async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: 'Phone and password are required' });
    }

    // Check if user already exists
    const existingUser = db.data.users.find((user) => user.phone === phone);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Add user to the "database"
    await db.update(data => data.users.push({ phone, password }));
    res.status(201).json({ message: 'User created successfully' });
  });

  // Login user endpoint
  app.post('/login', (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: 'Phone and password are required' });
    }

    // Check if user exists and password matches
    const user = db.data.users.find(
      (user) => user.phone === phone && user.password === password,
    );
    if (user) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false });
    }
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
