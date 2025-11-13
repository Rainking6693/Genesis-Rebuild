// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const router = express.Router();

// Mock database (replace with actual database integration)
const resources: any[] = [];
let nextId = 1;

// Define data validation schema
const resourceSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

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
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else if (err instanceof z.ZodError) {
    res.status(400).json({ error: err.errors });
  }
  else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// GET a single resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const resource = resources.find(r => r.id === id);

    if (!resource) {
      throw new ApiError(404, 'Resource not found');
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// POST a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = resourceSchema.parse(req.body);

    const newResource = {
      id: nextId++,
      ...validatedData,
    };

    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (error) {
    next(error);
  }
});

// PUT (update) an existing resource
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = resourceSchema.parse(req.body);

    const resourceIndex = resources.findIndex(r => r.id === id);

    if (resourceIndex === -1) {
      throw new ApiError(404, 'Resource not found');
    }

    resources[resourceIndex] = { id, ...validatedData };
    res.json(resources[resourceIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE a resource
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const resourceIndex = resources.findIndex(r => r.id === id);

    if (resourceIndex === -1) {
      throw new ApiError(404, 'Resource not found');
    }

    resources.splice(resourceIndex, 1);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

export { router as resourceRouter, errorHandler };

// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const router = express.Router();

// Mock database (replace with actual database integration)
const resources: any[] = [];
let nextId = 1;

// Define data validation schema
const resourceSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

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
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else if (err instanceof z.ZodError) {
    res.status(400).json({ error: err.errors });
  }
  else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// GET a single resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const resource = resources.find(r => r.id === id);

    if (!resource) {
      throw new ApiError(404, 'Resource not found');
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// POST a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = resourceSchema.parse(req.body);

    const newResource = {
      id: nextId++,
      ...validatedData,
    };

    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (error) {
    next(error);
  }
});

// PUT (update) an existing resource
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = resourceSchema.parse(req.body);

    const resourceIndex = resources.findIndex(r => r.id === id);

    if (resourceIndex === -1) {
      throw new ApiError(404, 'Resource not found');
    }

    resources[resourceIndex] = { id, ...validatedData };
    res.json(resources[resourceIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE a resource
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const resourceIndex = resources.findIndex(r => r.id === id);

    if (resourceIndex === -1) {
      throw new ApiError(404, 'Resource not found');
    }

    resources.splice(resourceIndex, 1);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

export { router as resourceRouter, errorHandler };