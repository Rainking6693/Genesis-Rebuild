// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Placeholder for user data (replace with database interaction)
let users: { [id: string]: { id: string; name: string; email: string } } = {};

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET all users
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(Object.values(users));
  } catch (error) {
    next(error);
  }
});

// GET a user by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[userId]);
  } catch (error) {
    next(error);
  }
});

// POST a new user
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const id = uuidv4();
    users[id] = { id, name, email };
    res.status(201).json(users[id]);
  } catch (error) {
    next(error);
  }
});

// PUT (update) an existing user
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    users[userId] = { id: userId, name, email };
    res.json(users[userId]);
  } catch (error) {
    next(error);
  }
});

// DELETE a user
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    if (!users[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    delete users[userId];
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;

// index.ts (Example of how to use the router)
import express from 'express';
import usersRouter from './api/users';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});