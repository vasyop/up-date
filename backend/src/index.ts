import express = require('express');
import cors = require('cors')
import { User } from './types';
import { assertValidPhoneNumber, assertValidString } from './validators';
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

(async () => {
  const { JSONFilePreset } = await import('lowdb/node');

  const db = await JSONFilePreset<{ users: User[] }>('db.json', {
    users: [],
  });

  app.post<string, string, object, User>(
    '/create-user',
    async (req, res) => {
      const { phone, password, name } = req.body;

      assertValidPhoneNumber(phone);
      assertValidString(password);
      assertValidString(name);

      const existingUser = db.data.users.find((user) => user.phone === phone);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      await db.update((data) => data.users.push({ phone, password, name, sub: 'user' }));
      res.status(201).json({ message: 'User created successfully' });
    },
  );

  app.post<string, string, object, User>(
    '/login',
    async (req, res) => {
      const { phone, password } = req.body;

      assertValidPhoneNumber(phone);
      assertValidString(password);

      const user = db.data.users.find((user) => user.phone === phone && user.password === password);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.status(200).json({ message: 'Login successful', user });
    },
  );

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
