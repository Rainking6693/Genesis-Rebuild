// src/api/user.ts
import express, { Request, Response } from 'express';

const router = express.Router();

// In-memory user data (replace with database)
const users: any[] = [];

// GET all users
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error: any) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// POST create a new user
router.post('/', (req: Request, res: Response) => {
  try {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: "Invalid user data" });
  }
});

// GET a specific user by ID (example)
router.get('/:id', (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error: any) {
        console.error("Error getting user:", error);
        res.status(500).json({ error: "Failed to retrieve user" });
    }
});

export default router;

// src/index.ts
import express from 'express';
import userApi from './api/user';

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api/users', userApi);

app.get('/', (req, res) => {
  res.send('Hello, SaaS API!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// src/api/user.ts
import express, { Request, Response } from 'express';

const router = express.Router();

// In-memory user data (replace with database)
const users: any[] = [];

// GET all users
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error: any) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// POST create a new user
router.post('/', (req: Request, res: Response) => {
  try {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: "Invalid user data" });
  }
});

// GET a specific user by ID (example)
router.get('/:id', (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error: any) {
        console.error("Error getting user:", error);
        res.status(500).json({ error: "Failed to retrieve user" });
    }
});

export default router;

// src/index.ts
import express from 'express';
import userApi from './api/user';

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api/users', userApi);

app.get('/', (req, res) => {
  res.send('Hello, SaaS API!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});