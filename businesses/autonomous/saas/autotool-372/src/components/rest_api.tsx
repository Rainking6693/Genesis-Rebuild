// src/api/auth.ts
import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Custom error class
class AuthenticationError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AuthenticationError.prototype); // Required for extending Error in TypeScript
  }
}

// Registration endpoint
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Simulate database interaction (replace with actual database logic)
      // In a real application, you'd hash the password and store it securely.
      if (email === 'existinguser@example.com') {
        throw new AuthenticationError('Email already exists', 409);
      }

      // Placeholder for user creation
      console.log(`Creating user with email: ${email}`);

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
      next(error); // Pass error to error handling middleware
    }
  }
);

// Login endpoint
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Simulate database interaction (replace with actual database logic)
      // In a real application, you'd verify the password against the stored hash.
      if (email !== 'test@example.com' || password !== 'password') {
        throw new AuthenticationError('Invalid credentials');
      }

      // Placeholder for session management (e.g., JWT)
      const token = 'fake_jwt_token';
      res.status(200).json({ message: 'Login successful', token });
    } catch (error: any) {
      next(error); // Pass error to error handling middleware
    }
  }
);

// Error handling middleware
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof AuthenticationError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

// src/index.ts
import express from 'express';
import authRoutes from './api/auth';

const app = express();
const port = 3000;

app.use(express.json()); // Parse JSON request bodies
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});