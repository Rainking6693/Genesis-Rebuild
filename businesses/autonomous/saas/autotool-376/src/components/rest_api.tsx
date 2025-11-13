// src/api/users.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory user store (replace with a database)
const users: { [id: string]: any } = {};

// Custom error class
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}

// Middleware for error handling
router.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    res.json(Object.values(users));
  } catch (error: any) {
    console.error("Error getting users:", error);
    next(new APIError("Failed to retrieve users", 500));
  }
});

// GET a specific user by ID
router.get('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return next(new APIError("User not found", 404));
    }
    res.json(users[userId]);
  } catch (error: any) {
    console.error("Error getting user:", error);
    next(new APIError("Failed to retrieve user", 500));
  }
});

// POST a new user
router.post('/', async (req: Request, res: Response, next: any) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return next(new APIError("Name and email are required", 400));
    }

    const id = uuidv4();
    users[id] = { id, name, email };
    res.status(201).json(users[id]);
  } catch (error: any) {
    console.error("Error creating user:", error);
    next(new APIError("Failed to create user", 500));
  }
});

// PUT (update) an existing user
router.put('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return next(new APIError("User not found", 404));
    }

    const { name, email } = req.body;
    if (!name || !email) {
      return next(new APIError("Name and email are required", 400));
    }

    users[userId] = { ...users[userId], name, email };
    res.json(users[userId]);
  } catch (error: any) {
    console.error("Error updating user:", error);
    next(new APIError("Failed to update user", 500));
  }
});

// DELETE a user
router.delete('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return next(new APIError("User not found", 404));
    }

    delete users[userId];
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting user:", error);
    next(new APIError("Failed to delete user", 500));
  }
});

export default router;

// src/api/users.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory user store (replace with a database)
const users: { [id: string]: any } = {};

// Custom error class
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}

// Middleware for error handling
router.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    res.json(Object.values(users));
  } catch (error: any) {
    console.error("Error getting users:", error);
    next(new APIError("Failed to retrieve users", 500));
  }
});

// GET a specific user by ID
router.get('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return next(new APIError("User not found", 404));
    }
    res.json(users[userId]);
  } catch (error: any) {
    console.error("Error getting user:", error);
    next(new APIError("Failed to retrieve user", 500));
  }
});

// POST a new user
router.post('/', async (req: Request, res: Response, next: any) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return next(new APIError("Name and email are required", 400));
    }

    const id = uuidv4();
    users[id] = { id, name, email };
    res.status(201).json(users[id]);
  } catch (error: any) {
    console.error("Error creating user:", error);
    next(new APIError("Failed to create user", 500));
  }
});

// PUT (update) an existing user
router.put('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return next(new APIError("User not found", 404));
    }

    const { name, email } = req.body;
    if (!name || !email) {
      return next(new APIError("Name and email are required", 400));
    }

    users[userId] = { ...users[userId], name, email };
    res.json(users[userId]);
  } catch (error: any) {
    console.error("Error updating user:", error);
    next(new APIError("Failed to update user", 500));
  }
});

// DELETE a user
router.delete('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return next(new APIError("User not found", 404));
    }

    delete users[userId];
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting user:", error);
    next(new APIError("Failed to delete user", 500));
  }
});

export default router;

Now, I will output the code and the build report using the specified format.