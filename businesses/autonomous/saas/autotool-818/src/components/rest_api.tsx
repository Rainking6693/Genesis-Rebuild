// src/api/users.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock database (replace with actual database integration)
const users: { [id: string]: any } = {};

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Add the name property
  }
}

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: any) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET all users
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(Object.values(users));
  } catch (error: any) {
    console.error("Error getting users:", error);
    errorHandler(new ApiError(500, "Failed to retrieve users"), req, res, null);
  }
});

// GET a specific user by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      throw new ApiError(404, 'User not found');
    }
    res.json(users[userId]);
  } catch (error: any) {
    console.error("Error getting user:", error);
    errorHandler(error, req, res, null);
  }
});

// POST a new user
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    // Input validation
    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    const userId = uuidv4();
    users[userId] = { id: userId, name, email };
    res.status(201).json(users[userId]);
  } catch (error: any) {
    console.error("Error creating user:", error);
    errorHandler(error, req, res, null);
  }
});

// PUT (update) an existing user
router.put('/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      throw new ApiError(404, 'User not found');
    }

    const { name, email } = req.body;

    // Input validation
    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    users[userId] = { ...users[userId], name, email };
    res.json(users[userId]);
  } catch (error: any) {
    console.error("Error updating user:", error);
    errorHandler(error, req, res, null);
  }
});

// DELETE a user
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      throw new ApiError(404, 'User not found');
    }

    delete users[userId];
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting user:", error);
    errorHandler(error, req, res, null);
  }
});

router.use(errorHandler);

export default router;