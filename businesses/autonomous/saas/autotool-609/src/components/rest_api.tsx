// src/api/user.ts
import express, { Request, Response } from 'express';

const router = express.Router();

// In-memory user storage (replace with a database in a real application)
const users: any[] = [];
let nextUserId = 1;

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype); // Required for extending Error in TypeScript
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

// Create User
router.post('/', (req: Request, res: Response, next: any) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError(400, 'Invalid email format');
    }

    const newUser = { id: nextUserId++, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// Get User by ID
router.get('/:id', (req: Request, res: Response, next: any) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new ApiError(400, 'Invalid user ID');
    }

    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update User
router.put('/:id', (req: Request, res: Response, next: any) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new ApiError(400, 'Invalid user ID');
    }

    const { name, email } = req.body;
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new ApiError(404, 'User not found');
    }

    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;

    res.json(users[userIndex]);
  } catch (error) {
    next(error);
  }
});

// Delete User
router.delete('/:id', (req: Request, res: Response, next: any) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new ApiError(400, 'Invalid user ID');
    }

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new ApiError(404, 'User not found');
    }

    users.splice(userIndex, 1);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use the error handler

export default router;

// src/api/user.ts
import express, { Request, Response } from 'express';

const router = express.Router();

// In-memory user storage (replace with a database in a real application)
const users: any[] = [];
let nextUserId = 1;

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype); // Required for extending Error in TypeScript
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

// Create User
router.post('/', (req: Request, res: Response, next: any) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError(400, 'Invalid email format');
    }

    const newUser = { id: nextUserId++, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// Get User by ID
router.get('/:id', (req: Request, res: Response, next: any) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new ApiError(400, 'Invalid user ID');
    }

    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update User
router.put('/:id', (req: Request, res: Response, next: any) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new ApiError(400, 'Invalid user ID');
    }

    const { name, email } = req.body;
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new ApiError(404, 'User not found');
    }

    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;

    res.json(users[userIndex]);
  } catch (error) {
    next(error);
  }
});

// Delete User
router.delete('/:id', (req: Request, res: Response, next: any) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new ApiError(400, 'Invalid user ID');
    }

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new ApiError(404, 'User not found');
    }

    users.splice(userIndex, 1);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use the error handler

export default router;