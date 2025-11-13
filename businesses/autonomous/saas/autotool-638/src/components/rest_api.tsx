import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.use(express.json());

// Interface for User data
interface User {
  id: string;
  name: string;
  email: string;
}

// Mock user data (replace with database interaction in a real application)
let users: User[] = [];

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET /users - Get all users
app.get('/users', (req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// POST /users - Create a new user
app.post('/users', (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
    };

    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// GET /users/:id - Get a user by ID
app.get('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id - Update a user by ID
app.put('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    users[userIndex] = { ...users[userIndex], name, email };

    res.json(users[userIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - Delete a user by ID
app.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    users = users.filter((u) => u.id !== userId);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;