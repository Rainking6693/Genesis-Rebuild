// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Custom error class
class APIError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}

// Centralized error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Sample User Data (In-memory for demonstration purposes)
const users: { [id: string]: { name: string, email: string } } = {};

// API Endpoints

// GET /users - Get all users
app.get('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(Object.values(users));
  } catch (error: any) {
    next(error);
  }
});

// GET /users/:id - Get a specific user by ID
app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      throw new APIError(404, 'User not found');
    }
    res.json(users[userId]);
  } catch (error: any) {
    next(error);
  }
});

// POST /users - Create a new user
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new APIError(400, 'Name and email are required');
    }

    const userId = uuidv4();
    users[userId] = { name, email };
    res.status(201).json({ id: userId, message: 'User created successfully' });

  } catch (error: any) {
    next(error);
  }
});

// PUT /users/:id - Update an existing user
app.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    if (!users[userId]) {
      throw new APIError(404, 'User not found');
    }

    if (!name && !email) {
      throw new APIError(400, 'At least one of name or email is required');
    }

    if (name) users[userId].name = name;
    if (email) users[userId].email = email;

    res.json({ message: 'User updated successfully' });

  } catch (error: any) {
    next(error);
  }
});

// DELETE /users/:id - Delete a user
app.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      throw new APIError(404, 'User not found');
    }

    delete users[userId];
    res.json({ message: 'User deleted successfully' });

  } catch (error: any) {
    next(error);
  }
});

// Use the error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;