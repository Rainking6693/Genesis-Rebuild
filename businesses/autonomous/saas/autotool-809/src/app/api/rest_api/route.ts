// src/api/user.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface User {
  id: string;
  name: string;
  email: string;
}

let users: User[] = [];

// Custom Error Classes
class APIError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.name = "APIError";
  }
}

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET all users
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET a single user by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
      throw new APIError(404, 'User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST a new user
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new APIError(400, 'Name and email are required');
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
    };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// PUT (update) an existing user
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      throw new APIError(404, 'User not found');
    }

    if (!name || !email) {
      throw new APIError(400, 'Name and email are required');
    }

    users[userIndex] = { ...users[userIndex], name, email };
    res.json(users[userIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE a user
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      throw new APIError(404, 'User not found');
    }

    users.splice(userIndex, 1);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

export { router as userRouter, errorHandler };