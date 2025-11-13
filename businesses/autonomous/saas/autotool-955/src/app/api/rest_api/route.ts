// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something broke!' });
};

// User Management Routes
app.post('/users', (req: Request, res: Response) => {
  try {
    // Logic to create a new user
    const newUser = { id: 1, name: req.body.name, email: req.body.email }; // Placeholder
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', (req: Request, res: Response) => {
  try {
    // Logic to retrieve a user by ID
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = { id: userId, name: 'Example User', email: 'user@example.com' }; // Placeholder
    res.json(user);
  } catch (error: any) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Subscription Management Routes (Placeholder)
app.post('/subscriptions', (req: Request, res: Response) => {
  try {
    // Logic to create a new subscription
    res.status(201).json({ message: 'Subscription created' });
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: error.message });
  }
});

// Data Access Routes (Placeholder)
app.get('/data', (req: Request, res: Response) => {
  try {
    // Logic to retrieve data
    res.json({ data: 'Example data' });
  } catch (error: any) {
    console.error("Error getting data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// .env file (example)
// PORT=3000