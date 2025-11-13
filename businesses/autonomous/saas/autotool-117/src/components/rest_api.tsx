// src/api/routes/example.ts

import express, { Request, Response, NextFunction } from 'express';
import { validateCreateExampleRequest, validateUpdateExampleRequest } from '../middleware/validation';
import { authenticate } from '../middleware/auth'; // Placeholder for actual authentication

const router = express.Router();

// Custom Error Classes
class ExampleNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExampleNotFoundError';
  }
}

class InvalidExampleDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidExampleDataError';
  }
}

// Mock Database (replace with actual database interaction)
const examples: any[] = [];
let nextId = 1;

/**
 * @route GET /examples
 * @description Get all examples
 * @access Public (replace with appropriate access control)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(examples);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

/**
 * @route GET /examples/:id
 * @description Get a single example by ID
 * @access Public (replace with appropriate access control)
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const example = examples.find(e => e.id === id);

    if (!example) {
      throw new ExampleNotFoundError(`Example with ID ${id} not found`);
    }

    res.json(example);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /examples
 * @description Create a new example
 * @access Private (replace with appropriate access control)
 */
router.post('/', authenticate, validateCreateExampleRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newExample = { id: nextId++, ...req.body };
    examples.push(newExample);
    res.status(201).json(newExample); // 201 Created
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /examples/:id
 * @description Update an existing example
 * @access Private (replace with appropriate access control)
 */
router.put('/:id', authenticate, validateUpdateExampleRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const exampleIndex = examples.findIndex(e => e.id === id);

    if (exampleIndex === -1) {
      throw new ExampleNotFoundError(`Example with ID ${id} not found`);
    }

    examples[exampleIndex] = { ...examples[exampleIndex], ...req.body };
    res.json(examples[exampleIndex]);
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /examples/:id
 * @description Delete an example
 * @access Private (replace with appropriate access control)
 */
router.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const exampleIndex = examples.findIndex(e => e.id === id);

    if (exampleIndex === -1) {
      throw new ExampleNotFoundError(`Example with ID ${id} not found`);
    }

    examples.splice(exampleIndex, 1);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
});

// Error handling middleware (must be defined after routes)
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error

  if (err instanceof ExampleNotFoundError) {
    return res.status(404).json({ error: err.message });
  }

  if (err instanceof InvalidExampleDataError) {
    return res.status(400).json({ error: err.message });
  }

  // Generic error handler
  res.status(500).json({ error: 'Internal Server Error' });
});

export default router;

// src/middleware/validation.ts

import { Request, Response, NextFunction } from 'express';

export const validateCreateExampleRequest = (req: Request, res: Response, next: NextFunction) => {
  // Example validation logic (replace with actual validation)
  if (!req.body.name || typeof req.body.name !== 'string') {
    return res.status(400).json({ error: 'Name is required and must be a string' });
  }
  next();
};

export const validateUpdateExampleRequest = (req: Request, res: Response, next: NextFunction) => {
  // Example validation logic (replace with actual validation)
  if (req.body.description && typeof req.body.description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string' });
  }
  next();
};

// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Placeholder for authentication logic
  // In a real application, you would verify a JWT or session token here
  // For now, we'll just allow all requests
  console.warn("Authentication middleware is a placeholder.  Implement actual authentication logic!");
  next();
};

// src/api/routes/example.ts

import express, { Request, Response, NextFunction } from 'express';
import { validateCreateExampleRequest, validateUpdateExampleRequest } from '../middleware/validation';
import { authenticate } from '../middleware/auth'; // Placeholder for actual authentication

const router = express.Router();

// Custom Error Classes
class ExampleNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExampleNotFoundError';
  }
}

class InvalidExampleDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidExampleDataError';
  }
}

// Mock Database (replace with actual database interaction)
const examples: any[] = [];
let nextId = 1;

/**
 * @route GET /examples
 * @description Get all examples
 * @access Public (replace with appropriate access control)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(examples);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

/**
 * @route GET /examples/:id
 * @description Get a single example by ID
 * @access Public (replace with appropriate access control)
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const example = examples.find(e => e.id === id);

    if (!example) {
      throw new ExampleNotFoundError(`Example with ID ${id} not found`);
    }

    res.json(example);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /examples
 * @description Create a new example
 * @access Private (replace with appropriate access control)
 */
router.post('/', authenticate, validateCreateExampleRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newExample = { id: nextId++, ...req.body };
    examples.push(newExample);
    res.status(201).json(newExample); // 201 Created
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /examples/:id
 * @description Update an existing example
 * @access Private (replace with appropriate access control)
 */
router.put('/:id', authenticate, validateUpdateExampleRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const exampleIndex = examples.findIndex(e => e.id === id);

    if (exampleIndex === -1) {
      throw new ExampleNotFoundError(`Example with ID ${id} not found`);
    }

    examples[exampleIndex] = { ...examples[exampleIndex], ...req.body };
    res.json(examples[exampleIndex]);
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /examples/:id
 * @description Delete an example
 * @access Private (replace with appropriate access control)
 */
router.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const exampleIndex = examples.findIndex(e => e.id === id);

    if (exampleIndex === -1) {
      throw new ExampleNotFoundError(`Example with ID ${id} not found`);
    }

    examples.splice(exampleIndex, 1);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
});

// Error handling middleware (must be defined after routes)
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error

  if (err instanceof ExampleNotFoundError) {
    return res.status(404).json({ error: err.message });
  }

  if (err instanceof InvalidExampleDataError) {
    return res.status(400).json({ error: err.message });
  }

  // Generic error handler
  res.status(500).json({ error: 'Internal Server Error' });
});

export default router;

// src/middleware/validation.ts

import { Request, Response, NextFunction } from 'express';

export const validateCreateExampleRequest = (req: Request, res: Response, next: NextFunction) => {
  // Example validation logic (replace with actual validation)
  if (!req.body.name || typeof req.body.name !== 'string') {
    return res.status(400).json({ error: 'Name is required and must be a string' });
  }
  next();
};

export const validateUpdateExampleRequest = (req: Request, res: Response, next: NextFunction) => {
  // Example validation logic (replace with actual validation)
  if (req.body.description && typeof req.body.description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string' });
  }
  next();
};

// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Placeholder for authentication logic
  // In a real application, you would verify a JWT or session token here
  // For now, we'll just allow all requests
  console.warn("Authentication middleware is a placeholder.  Implement actual authentication logic!");
  next();
};