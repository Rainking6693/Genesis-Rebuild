// src/api/users.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
// Assuming a database connection is established elsewhere
// import { db } from '../db'; // Example: Import your database connection

const router = express.Router();

interface User {
  id: string;
  name: string;
  email: string;
}

// Mock user data (replace with database interaction)
let users: User[] = [];

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    // const users = await db.query('SELECT * FROM users'); // Example database query
    res.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET a specific user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    // const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]); // Example database query
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST a new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
    };

    users.push(newUser); // Replace with database insertion

    // await db.query('INSERT INTO users (id, name, email) VALUES ($1, $2, $3)', [newUser.id, name, email]); // Example database insertion

    res.status(201).json(newUser); // 201 Created
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT (update) an existing user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // const updatedUser = await db.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, userId]); // Example database update
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users[userIndex] = { ...users[userIndex], name, email };

    res.json(users[userIndex]);
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE a user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    // await db.query('DELETE FROM users WHERE id = $1', [userId]); // Example database deletion

    users = users.filter(u => u.id !== userId);

    res.status(204).send(); // 204 No Content (successful deletion)
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;

// src/api/users.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
// Assuming a database connection is established elsewhere
// import { db } from '../db'; // Example: Import your database connection

const router = express.Router();

interface User {
  id: string;
  name: string;
  email: string;
}

// Mock user data (replace with database interaction)
let users: User[] = [];

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    // const users = await db.query('SELECT * FROM users'); // Example database query
    res.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET a specific user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    // const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]); // Example database query
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST a new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
    };

    users.push(newUser); // Replace with database insertion

    // await db.query('INSERT INTO users (id, name, email) VALUES ($1, $2, $3)', [newUser.id, name, email]); // Example database insertion

    res.status(201).json(newUser); // 201 Created
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT (update) an existing user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // const updatedUser = await db.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, userId]); // Example database update
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users[userIndex] = { ...users[userIndex], name, email };

    res.json(users[userIndex]);
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE a user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    // await db.query('DELETE FROM users WHERE id = $1', [userId]); // Example database deletion

    users = users.filter(u => u.id !== userId);

    res.status(204).send(); // 204 No Content (successful deletion)
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;