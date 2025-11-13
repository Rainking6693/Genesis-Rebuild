// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

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
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// In-memory user database (for demonstration purposes)
const users: { [id: string]: { name: string, email: string } } = {};

// API Endpoints

// 1. Create User (POST /users)
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new ApiError(400, 'Name and email are required.');
    }

    const id = uuidv4();
    users[id] = { name, email };
    res.status(201).json({ id, message: 'User created successfully.' });
  } catch (error: any) {
    next(error); // Pass the error to the error handling middleware
  }
});

// 2. Get User (GET /users/:id)
app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = users[userId];

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    res.json(user);
  } catch (error: any) {
    next(error);
  }
});

// 3. Update User (PUT /users/:id)
app.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    if (!users[userId]) {
      throw new ApiError(404, 'User not found.');
    }

    users[userId] = { name: name || users[userId].name, email: email || users[userId].email };
    res.json({ message: 'User updated successfully.' });
  } catch (error: any) {
    next(error);
  }
});

// 4. Delete User (DELETE /users/:id)
app.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    if (!users[userId]) {
      throw new ApiError(404, 'User not found.');
    }

    delete users[userId];
    res.status(204).send(); // No content
  } catch (error: any) {
    next(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the app for testing purposes
export default app;