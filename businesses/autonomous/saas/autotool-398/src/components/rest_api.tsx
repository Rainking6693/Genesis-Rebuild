// src/api/routes/users.ts
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Placeholder for database interaction (replace with actual database logic)
const users = [];

// GET /api/users - Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    // Simulate database query
    // const users = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/users/:id - Get a user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    // Simulate database query
    // const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/users - Create a new user
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email } = req.body;
      // Simulate database insertion
      // const result = await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
      const newUser = { id: users.length + 1, name, email };
      users.push(newUser);

      res.status(201).json(newUser);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// PUT /api/users/:id - Update a user
router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = parseInt(req.params.id);
      const { name, email } = req.body;

      // Simulate database update
      // const result = await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      users[userIndex] = { id: userId, name, email };

      res.json({ message: 'User updated successfully' });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    // Simulate database deletion
    // const result = await db.query('DELETE FROM users WHERE id = ?', [userId]);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    users.splice(userIndex, 1);

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

// src/app.ts
import express from 'express';
import userRoutes from './api/routes/users';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};