// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Add the name property
  }
}

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Example endpoint: Get all users
app.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate fetching users from a database
    const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
    res.json(users);
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

// Example endpoint: Get a specific user
app.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      throw new ApiError(400, "Invalid user ID. Must be a number.");
    }

    // Simulate fetching a user from a database
    const user = { id: userId, name: `User ${userId}` };

    if (!user) {
      throw new ApiError(404, `User with ID ${userId} not found`);
    }

    res.json(user);
  } catch (error: any) {
    next(error);
  }
});

// Example endpoint: Create a new user
app.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new ApiError(400, "Name is required");
    }

    // Simulate creating a new user in a database
    const newUser = { id: Math.floor(Math.random() * 100), name: name };
    res.status(201).json(newUser); // 201 Created
  } catch (error: any) {
    next(error);
  }
});

// Example endpoint: Update an existing user
app.put('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);
        const { name } = req.body;

        if (isNaN(userId)) {
            throw new ApiError(400, "Invalid user ID. Must be a number.");
        }

        if (!name) {
            throw new ApiError(400, "Name is required");
        }

        // Simulate updating a user in a database
        const updatedUser = { id: userId, name: name };
        res.json(updatedUser);
    } catch (error: any) {
        next(error);
    }
});

// Example endpoint: Delete a user
app.delete('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            throw new ApiError(400, "Invalid user ID. Must be a number.");
        }

        // Simulate deleting a user from a database
        res.status(204).send(); // 204 No Content
    } catch (error: any) {
        next(error);
    }
});

// Use the error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Total lines: ~130