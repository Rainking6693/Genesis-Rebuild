// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const router = express.Router();

// Define a simple User interface
interface User {
  id: string;
  name: string;
  email: string;
}

// In-memory user store (replace with a database)
const users: User[] = [];

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype); // Required for extending Error in TypeScript
  }
}

// Middleware for logging requests
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware for error handling
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /users - Get all users
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(users);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

// GET /users/:id - Get a user by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const user = users.find(u => u.id === id);

    if (!user) {
      throw new ApiError(404, `User with ID ${id} not found`);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST /users - Create a new user
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError(400, 'Invalid email format');
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
    };

    users.push(newUser);
    res.status(201).json(newUser); // 201 Created
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id - Update an existing user
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      throw new ApiError(404, `User with ID ${id} not found`);
    }

    users[userIndex] = { ...users[userIndex], name, email };
    res.json(users[userIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - Delete a user
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      throw new ApiError(404, `User with ID ${id} not found`);
    }

    users.splice(userIndex, 1);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
});

export default router;

// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const router = express.Router();

// Define a simple User interface
interface User {
  id: string;
  name: string;
  email: string;
}

// In-memory user store (replace with a database)
const users: User[] = [];

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype); // Required for extending Error in TypeScript
  }
}

// Middleware for logging requests
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware for error handling
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /users - Get all users
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(users);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

// GET /users/:id - Get a user by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const user = users.find(u => u.id === id);

    if (!user) {
      throw new ApiError(404, `User with ID ${id} not found`);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST /users - Create a new user
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError(400, 'Invalid email format');
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
    };

    users.push(newUser);
    res.status(201).json(newUser); // 201 Created
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id - Update an existing user
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      throw new ApiError(404, `User with ID ${id} not found`);
    }

    users[userIndex] = { ...users[userIndex], name, email };
    res.json(users[userIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - Delete a user
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      throw new ApiError(404, `User with ID ${id} not found`);
    }

    users.splice(userIndex, 1);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
});

export default router;

Now, I will use the `Write` tool to save the code to `src/api/users.ts` and then use the `Write` tool to save the build report to `build_report.json`.