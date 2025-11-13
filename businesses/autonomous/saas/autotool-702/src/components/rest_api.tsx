// src/api/users.ts
import express, { Request, Response } from 'express';

const router = express.Router();

interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
];

// GET all users
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error: any) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a user by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new user
router.post('/', (req: Request, res: Response) => {
  try {
    const newUser: User = {
      id: users.length + 1,
      name: req.body.name,
      email: req.body.email,
    };

    if (!newUser.name || !newUser.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT (update) an existing user
router.put('/:id', (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex((u) => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser: User = {
            id: userId,
            name: req.body.name || users[userIndex].name,
            email: req.body.email || users[userIndex].email,
        };

        users[userIndex] = updatedUser;
        res.json(updatedUser);

    } catch (error: any) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a user
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    users = users.filter((u) => u.id !== userId);
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

// src/api/users.ts
import express, { Request, Response } from 'express';

const router = express.Router();

interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
];

// GET all users
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error: any) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a user by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new user
router.post('/', (req: Request, res: Response) => {
  try {
    const newUser: User = {
      id: users.length + 1,
      name: req.body.name,
      email: req.body.email,
    };

    if (!newUser.name || !newUser.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT (update) an existing user
router.put('/:id', (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex((u) => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser: User = {
            id: userId,
            name: req.body.name || users[userIndex].name,
            email: req.body.email || users[userIndex].email,
        };

        users[userIndex] = updatedUser;
        res.json(updatedUser);

    } catch (error: any) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a user
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    users = users.filter((u) => u.id !== userId);
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

Now, I'll use the tools to write the code to a file and output the build report.