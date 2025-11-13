// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Custom Error Classes
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype); // Required for extending Error class
  }
}

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Placeholder for database interaction
const users: any[] = [];

// API Endpoints

// Create User
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required');
    }

    const newUser = { id: uuidv4(), name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

// Get User by ID
app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
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
app.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const { name, email } = req.body;

      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        throw new ApiError(404, 'User not found');
      }

      if (!name || !email) {
        throw new ApiError(400, 'Name and email are required');
      }

      users[userIndex] = { ...users[userIndex], name, email };

      res.json(users[userIndex]);
    } catch (error) {
      next(error);
    }
  });

// Delete User
app.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        throw new ApiError(404, 'User not found');
      }

      users.splice(userIndex, 1);
      res.status(204).send(); // No content on successful deletion
    } catch (error) {
      next(error);
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the app for testing purposes
export default app;