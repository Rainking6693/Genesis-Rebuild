// src/api/index.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import { userRouter } from './routes/userRoutes';
import { authRouter } from './routes/authRoutes';

const app: Express = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Routes
app.use('/users', userRouter);
app.use('/auth', authRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('SaaS API is running!');
});

export default app;

// src/api/routes/userRoutes.ts
import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    // Placeholder for fetching users from database
    const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
    res.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET a specific user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    // Placeholder for fetching a user from database by ID
    const user = { id: userId, name: `User ${userId}` };
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export const userRouter = router;

// src/api/routes/authRoutes.ts
import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// POST /auth/register - Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Placeholder for user registration logic
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Simulate user creation
    const newUser = { username, id: Math.floor(Math.random() * 1000) };

    res.status(201).json({ message: 'User registered successfully', user: newUser });

  } catch (error: any) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /auth/login - Log in an existing user
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Placeholder for user login logic
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Simulate user authentication
    const user = { username, id: 123 }; // Replace with actual authentication

    res.json({ message: 'Login successful', user });

  } catch (error: any) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

export const authRouter = router;

// src/api/index.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import { userRouter } from './routes/userRoutes';
import { authRouter } from './routes/authRoutes';

const app: Express = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Routes
app.use('/users', userRouter);
app.use('/auth', authRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('SaaS API is running!');
});

export default app;

// src/api/routes/userRoutes.ts
import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// GET all users
router.get('/', async (req: Request, res: Response) => {
  try {
    // Placeholder for fetching users from database
    const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
    res.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET a specific user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    // Placeholder for fetching a user from database by ID
    const user = { id: userId, name: `User ${userId}` };
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export const userRouter = router;

// src/api/routes/authRoutes.ts
import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// POST /auth/register - Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Placeholder for user registration logic
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Simulate user creation
    const newUser = { username, id: Math.floor(Math.random() * 1000) };

    res.status(201).json({ message: 'User registered successfully', user: newUser });

  } catch (error: any) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /auth/login - Log in an existing user
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Placeholder for user login logic
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Simulate user authentication
    const user = { username, id: 123 }; // Replace with actual authentication

    res.json({ message: 'Login successful', user });

  } catch (error: any) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

export const authRouter = router;