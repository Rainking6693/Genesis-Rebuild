// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory user store (replace with a database in a real application)
const users: { [id: string]: any } = {};

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Ensure the name is set for proper identification
  }
}

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /users - Create a new user
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;

    // Input validation
    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    if (!email.includes('@')) {
      throw new ApiError(400, 'Invalid email format');
    }

    const id = uuidv4();
    const newUser = { id, name, email };
    users[id] = newUser;

    res.status(201).json(newUser);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// GET /users/:id - Get a user by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = users[id];

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id - Update a user by ID
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!users[id]) {
      throw new ApiError(404, 'User not found');
    }

    if (name) users[id].name = name;
    if (email) users[id].email = email;

    res.json(users[id]);
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - Delete a user by ID
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!users[id]) {
      throw new ApiError(404, 'User not found');
    }

    delete users[id];
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use the error handling middleware

export default router;

// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory user store (replace with a database in a real application)
const users: { [id: string]: any } = {};

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Ensure the name is set for proper identification
  }
}

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /users - Create a new user
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;

    // Input validation
    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    if (!email.includes('@')) {
      throw new ApiError(400, 'Invalid email format');
    }

    const id = uuidv4();
    const newUser = { id, name, email };
    users[id] = newUser;

    res.status(201).json(newUser);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// GET /users/:id - Get a user by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = users[id];

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id - Update a user by ID
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!users[id]) {
      throw new ApiError(404, 'User not found');
    }

    if (name) users[id].name = name;
    if (email) users[id].email = email;

    res.json(users[id]);
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - Delete a user by ID
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!users[id]) {
      throw new ApiError(404, 'User not found');
    }

    delete users[id];
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use the error handling middleware

export default router;