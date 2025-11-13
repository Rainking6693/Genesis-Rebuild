// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Custom error handler middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// User management endpoints
app.post('/users',
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Simulate user creation (replace with actual database logic)
      const { email, password } = req.body;
      console.log(`Creating user with email: ${email}`);
      res.status(201).json({ message: 'User created successfully', user: { email } });
    } catch (error: any) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    // Simulate fetching user (replace with actual database logic)
    console.log(`Fetching user with id: ${userId}`);
    res.json({ id: userId, email: 'test@example.com' });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Data management endpoints (example)
app.post('/data', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    // Simulate data processing (replace with actual database logic)
    console.log("Received data:", data);
    res.status(201).json({ message: 'Data received successfully', data });
  } catch (error: any) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: 'Failed to process data' });
  }
});

// Apply error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the app for testing purposes
export default app;