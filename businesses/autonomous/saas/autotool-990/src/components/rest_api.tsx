// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Zod schema for user creation
const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging
  if (err instanceof z.ZodError) {
    return res.status(400).json({ message: "Validation error", errors: err.errors });
  }
  res.status(500).json({ message: 'Internal Server Error' });
};

// Route for creating a new user
app.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      return next(result.error); // Pass ZodError to error handler
    }

    // Simulate user creation (replace with actual database logic)
    const newUser = {
      id: Math.floor(Math.random() * 1000),
      username: result.data.username,
      email: result.data.email,
    };

    console.log("User created:", newUser);
    res.status(201).json(newUser);

  } catch (error) {
    next(error); // Pass any other errors to the error handler
  }
});

// Example route for getting user data
app.get('/users/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  // Simulate fetching user data (replace with actual database logic)
  const user = { id: userId, username: 'exampleUser', email: 'user@example.com' };

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Use the error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;