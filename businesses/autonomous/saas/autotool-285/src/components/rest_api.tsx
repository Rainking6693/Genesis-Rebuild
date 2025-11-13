// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Mock data (replace with database integration in a real application)
const users = [];
const subscriptions = [];

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET /users
app.get('/users', (req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST /users
app.post('/users', (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser = { id: uuidv4(), name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// GET /subscriptions
app.get('/subscriptions', (req: Request, res: Response) => {
  try {
    res.json(subscriptions);
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});

// POST /subscriptions
app.post('/subscriptions', (req: Request, res: Response) => {
  try {
    const { userId, plan } = req.body;
    if (!userId || !plan) {
      return res.status(400).json({ error: 'User ID and plan are required' });
    }

    const newSubscription = { id: uuidv4(), userId, plan, startDate: new Date() };
    subscriptions.push(newSubscription);
    res.status(201).json(newSubscription);
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

app.use(errorHandler); // Use error handling middleware

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Export the app for testing purposes
export default app;