// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import * as fs from 'fs/promises'; // For file operations (example)

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Custom error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error
  res.status(500).json({ error: 'Internal Server Error' });
};

// Example: User Management API

// In-memory user storage (replace with a database in a real application)
const users: { [id: string]: { name: string; email: string } } = {};

// GET all users
app.get('/users', (req: Request, res: Response) => {
  try {
    res.json(Object.values(users));
  } catch (error: any) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// GET a specific user by ID
app.get('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[userId]);
  } catch (error: any) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

// POST a new user
app.post('/users', (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const id = uuidv4();
    users[id] = { name, email };
    res.status(201).json({ id, message: 'User created successfully' });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT (update) an existing user
app.put('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    if (!users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) users[userId].name = name;
    if (email) users[userId].email = email;

    res.json({ message: 'User updated successfully' });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE a user
app.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    delete users[userId];
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Example: Data Access API (Placeholder - replace with actual data access logic)
app.get('/data', (req: Request, res: Response) => {
  try {
    // Simulate data retrieval
    const data = { message: 'Data retrieved successfully' };
    res.json(data);
  } catch (error: any) {
    console.error("Error accessing data:", error);
    res.status(500).json({ error: 'Failed to access data' });
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import * as fs from 'fs/promises'; // For file operations (example)

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Custom error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error
  res.status(500).json({ error: 'Internal Server Error' });
};

// Example: User Management API

// In-memory user storage (replace with a database in a real application)
const users: { [id: string]: { name: string; email: string } } = {};

// GET all users
app.get('/users', (req: Request, res: Response) => {
  try {
    res.json(Object.values(users));
  } catch (error: any) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// GET a specific user by ID
app.get('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[userId]);
  } catch (error: any) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

// POST a new user
app.post('/users', (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const id = uuidv4();
    users[id] = { name, email };
    res.status(201).json({ id, message: 'User created successfully' });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT (update) an existing user
app.put('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    if (!users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) users[userId].name = name;
    if (email) users[userId].email = email;

    res.json({ message: 'User updated successfully' });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE a user
app.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    delete users[userId];
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Example: Data Access API (Placeholder - replace with actual data access logic)
app.get('/data', (req: Request, res: Response) => {
  try {
    // Simulate data retrieval
    const data = { message: 'Data retrieved successfully' };
    res.json(data);
  } catch (error: any) {
    console.error("Error accessing data:", error);
    res.status(500).json({ error: 'Failed to access data' });
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});