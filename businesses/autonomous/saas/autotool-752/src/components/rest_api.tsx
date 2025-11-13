// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Middleware to handle errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

// GET all users
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate fetching users from a database
    const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
    res.json(users);
  } catch (error) {
    next(error); // Pass error to error handler
  }
});

// GET a user by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    // Simulate fetching a user from a database
    const user = { id: userId, name: `User ${userId}` };
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST a new user
router.post(
  '/',
  [
    // Validate request body
    body('name').isString().notEmpty().withMessage('Name is required'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Simulate creating a new user in the database
      const newUser = { id: Math.floor(Math.random() * 100), name: req.body.name };
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

// PUT (update) an existing user
router.put(
  '/:id',
  [
    // Validate request body
    body('name').isString().notEmpty().withMessage('Name is required'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = parseInt(req.params.id);
      // Simulate updating a user in the database
      const updatedUser = { id: userId, name: req.body.name };
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE a user
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    // Simulate deleting a user from the database
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use the error handler

export default router;

// src/index.ts
import express from 'express';
import usersRouter from './api/users';

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Middleware to handle errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

// GET all users
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate fetching users from a database
    const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
    res.json(users);
  } catch (error) {
    next(error); // Pass error to error handler
  }
});

// GET a user by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    // Simulate fetching a user from a database
    const user = { id: userId, name: `User ${userId}` };
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST a new user
router.post(
  '/',
  [
    // Validate request body
    body('name').isString().notEmpty().withMessage('Name is required'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Simulate creating a new user in the database
      const newUser = { id: Math.floor(Math.random() * 100), name: req.body.name };
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

// PUT (update) an existing user
router.put(
  '/:id',
  [
    // Validate request body
    body('name').isString().notEmpty().withMessage('Name is required'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = parseInt(req.params.id);
      // Simulate updating a user in the database
      const updatedUser = { id: userId, name: req.body.name };
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE a user
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    // Simulate deleting a user from the database
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use the error handler

export default router;

// src/index.ts
import express from 'express';
import usersRouter from './api/users';

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

Now, I will use the `Write` tool to create these files.