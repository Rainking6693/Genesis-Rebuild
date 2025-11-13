// src/api/user.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { body, validationResult } from 'express-validator';

const router = express.Router();

// In-memory user storage (replace with a database)
const users: any[] = [];

// Middleware for handling errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// POST /users - Create a new user
router.post(
  '/users',
  body('email').isEmail().normalizeEmail(),
  body('name').isString().isLength({ min: 1 }),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email } = req.body;
      const id = uuidv4();
      const newUser = { id, name, email };
      users.push(newUser);

      res.status(201).json(newUser);
    } catch (error: any) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// GET /users/:id - Get a user by ID
router.get('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// PUT /users/:id - Update a user by ID
router.put(
  '/users/:id',
  body('email').isEmail().normalizeEmail().optional(),
  body('name').isString().isLength({ min: 1 }).optional(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.params.id;
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { name, email } = req.body;
      if (name) users[userIndex].name = name;
      if (email) users[userIndex].email = email;

      res.json(users[userIndex]);
    } catch (error: any) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

// DELETE /users/:id - Delete a user by ID
router.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users.splice(userIndex, 1);
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.use(errorHandler);

export default router;

// src/api/user.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { body, validationResult } from 'express-validator';

const router = express.Router();

// In-memory user storage (replace with a database)
const users: any[] = [];

// Middleware for handling errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// POST /users - Create a new user
router.post(
  '/users',
  body('email').isEmail().normalizeEmail(),
  body('name').isString().isLength({ min: 1 }),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email } = req.body;
      const id = uuidv4();
      const newUser = { id, name, email };
      users.push(newUser);

      res.status(201).json(newUser);
    } catch (error: any) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// GET /users/:id - Get a user by ID
router.get('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// PUT /users/:id - Update a user by ID
router.put(
  '/users/:id',
  body('email').isEmail().normalizeEmail().optional(),
  body('name').isString().isLength({ min: 1 }).optional(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.params.id;
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { name, email } = req.body;
      if (name) users[userIndex].name = name;
      if (email) users[userIndex].email = email;

      res.json(users[userIndex]);
    } catch (error: any) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

// DELETE /users/:id - Delete a user by ID
router.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users.splice(userIndex, 1);
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.use(errorHandler);

export default router;