// src/api/user.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface User {
  id: string;
  name: string;
  email: string;
}

let users: User[] = [];

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error: any) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// GET a specific user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
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

    users.push(newUser);
    res.status(201).json(newUser);

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

        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
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
        users = users.filter(u => u.id !== userId);
        res.status(204).send(); // No content
    } catch (error: any) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

export default router;

// src/api/user.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface User {
  id: string;
  name: string;
  email: string;
}

let users: User[] = [];

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error: any) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// GET a specific user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
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

    users.push(newUser);
    res.status(201).json(newUser);

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

        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
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
        users = users.filter(u => u.id !== userId);
        res.status(204).send(); // No content
    } catch (error: any) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

export default router;