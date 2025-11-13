// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Custom Error Classes
class APIError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError"; // Proper class name for identification
  }
}

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Placeholder for database interaction
const users: any[] = [];

// API Endpoints

// 1. User Registration
app.post('/register', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new APIError(400, 'Username and password are required');
    }

    const userId = uuidv4();
    const newUser = { id: userId, username, password };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully', userId: userId });

  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

// 2. User Login
app.post('/login', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      throw new APIError(401, 'Invalid credentials');
    }

    res.status(200).json({ message: 'Login successful', userId: user.id });

  } catch (error) {
    next(error);
  }
});

// 3. Get User (requires authentication - placeholder)
app.get('/users/:userId', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authentication middleware would go here in a real application
    const userId = req.params.userId;
    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new APIError(404, 'User not found');
    }

    res.status(200).json(user);

  } catch (error) {
    next(error);
  }
});

// Apply error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

### Build Report