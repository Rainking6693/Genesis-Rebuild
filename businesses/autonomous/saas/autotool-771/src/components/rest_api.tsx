// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock database (replace with actual database integration)
const users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
];

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET all users
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error: any) {
    next(error); // Pass error to error handler
  }
});

// GET a user by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    next(error);
  }
});

// POST a new user
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
      };

      users.push(newUser);
      res.status(201).json(newUser);
    } catch (error: any) {
      next(error);
    }
  }
);

// PUT (update) an existing user
router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = parseInt(req.params.id);
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }

      users[userIndex] = { ...users[userIndex], ...req.body };
      res.json(users[userIndex]);
    } catch (error: any) {
      next(error);
    }
  }
);

// DELETE a user
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users.splice(userIndex, 1);
    res.status(204).send(); // No content
  } catch (error: any) {
    next(error);
  }
});

router.use(errorHandler); // Apply error handling middleware

export default router;

// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock database (replace with actual database integration)
const users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
];

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET all users
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(users);
  } catch (error: any) {
    next(error); // Pass error to error handler
  }
});

// GET a user by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    next(error);
  }
});

// POST a new user
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
      };

      users.push(newUser);
      res.status(201).json(newUser);
    } catch (error: any) {
      next(error);
    }
  }
);

// PUT (update) an existing user
router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = parseInt(req.params.id);
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }

      users[userIndex] = { ...users[userIndex], ...req.body };
      res.json(users[userIndex]);
    } catch (error: any) {
      next(error);
    }
  }
);

// DELETE a user
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users.splice(userIndex, 1);
    res.status(204).send(); // No content
  } catch (error: any) {
    next(error);
  }
});

router.use(errorHandler); // Apply error handling middleware

export default router;