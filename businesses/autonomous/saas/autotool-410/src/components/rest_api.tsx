// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Middleware to handle errors
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// In-memory user data (replace with database later)
let users: any[] = [];

// GET all users
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET a specific user by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST a new user
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = {
      id: users.length + 1,
      ...req.body
    };
    users.push(newUser);
    res.status(201).json(newUser); // 201 Created
  } catch (error) {
    next(error);
  }
});

// PUT (update) an existing user
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex] = {
      id: id,
      ...req.body
    };

    res.json(users[userIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE a user
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);
    res.status(204).send(); // 204 No Content (successful deletion)
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;