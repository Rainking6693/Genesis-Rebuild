// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const router = express.Router();

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

// Error handling middleware
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User Schema
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

// POST /users - Create a new user
router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      throw new ApiError(400, `Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }

    // Simulate user creation (replace with actual database logic)
    const newUser = { id: Math.random().toString(36).substring(2, 15), ...value };

    res.status(201).json(newUser);
  } catch (error: any) {
    next(error);
  }
});

// GET /users/:id - Get a user by ID
router.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    // Simulate fetching user from database (replace with actual database logic)
    const user = { id: userId, username: 'testuser', email: 'test@example.com' };

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json(user);
  } catch (error: any) {
    next(error);
  }
});

// Data Schema
const dataSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.any().required(),
});

// POST /data - Create new data
router.post('/data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = dataSchema.validate(req.body);

    if (error) {
      throw new ApiError(400, `Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }

    // Simulate data creation (replace with actual database logic)
    const newData = { id: Math.random().toString(36).substring(2, 15), ...value };

    res.status(201).json(newData);
  } catch (error: any) {
    next(error);
  }
});

export default router;

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const router = express.Router();

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

// Error handling middleware
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User Schema
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

// POST /users - Create a new user
router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      throw new ApiError(400, `Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }

    // Simulate user creation (replace with actual database logic)
    const newUser = { id: Math.random().toString(36).substring(2, 15), ...value };

    res.status(201).json(newUser);
  } catch (error: any) {
    next(error);
  }
});

// GET /users/:id - Get a user by ID
router.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    // Simulate fetching user from database (replace with actual database logic)
    const user = { id: userId, username: 'testuser', email: 'test@example.com' };

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json(user);
  } catch (error: any) {
    next(error);
  }
});

// Data Schema
const dataSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.any().required(),
});

// POST /data - Create new data
router.post('/data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = dataSchema.validate(req.body);

    if (error) {
      throw new ApiError(400, `Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }

    // Simulate data creation (replace with actual database logic)
    const newData = { id: Math.random().toString(36).substring(2, 15), ...value };

    res.status(201).json(newData);
  } catch (error: any) {
    next(error);
  }
});

export default router;