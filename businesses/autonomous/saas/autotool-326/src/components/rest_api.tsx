// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory user store (replace with a database in a real application)
const users: { [id: string]: { id: string; name: string; email: string } } = {};

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Middleware for request validation (example)
const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  next();
};

// GET all users
router.get('/', (req: Request, res: Response) => {
  try {
    const userList = Object.values(users);
    res.json(userList);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET a specific user by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = users[userId];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST a new user
router.post('/', validateCreateUser, (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const id = uuidv4();
    const newUser = { id, name, email };
    users[id] = newUser;
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT (update) an existing user
router.put('/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    if (!users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userId] = { ...users[userId], name, email };
    res.json(users[userId]);
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE a user
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }

    delete users[userId];
    res.status(204).send(); // No content on successful deletion
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.use(errorHandler); // Use error handling middleware

export default router;

**Explanation:**

*   **Code:** The code defines a basic REST API for managing users. It includes endpoints for creating, reading, updating, and deleting users.  It uses Express.js for routing and middleware.  Error handling is included using a middleware function.  Request validation is included for the POST endpoint.
*   **Build Report:** The build report provides information about the code, including its status, language, line count, and any errors or warnings.  It highlights the need for a real database connection, unit tests, and security measures.