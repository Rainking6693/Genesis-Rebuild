// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Custom Error Class
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Middleware for request validation (example)
const validateResource = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.length < 3) {
    return next(new APIError('Invalid resource name. Must be a string with at least 3 characters.', 400));
  }
  next();
};

// Middleware for authentication (placeholder)
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement authentication logic here
  // For now, just pass through
  next();
};

// GET all resources
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Fetch resources from database
    const resources = [{ id: 1, name: 'Resource 1' }, { id: 2, name: 'Resource 2' }];
    res.json(resources);
  } catch (error: any) {
    next(error);
  }
});

// GET a specific resource by ID
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new APIError('Invalid resource ID. Must be a number.', 400));
    }

    // TODO: Fetch resource from database
    const resource = { id: id, name: `Resource ${id}` };
    if (!resource) {
      return next(new APIError('Resource not found', 404));
    }
    res.json(resource);
  } catch (error: any) {
    next(error);
  }
});

// POST a new resource
router.post('/', authenticate, validateResource, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    // TODO: Save resource to database
    const newResource = { id: Math.floor(Math.random() * 1000), name: name }; // Mock ID generation
    res.status(201).json(newResource);
  } catch (error: any) {
    next(error);
  }
});

// PUT (update) an existing resource
router.put('/:id', authenticate, validateResource, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new APIError('Invalid resource ID. Must be a number.', 400));
    }

    const { name } = req.body;

    // TODO: Update resource in database
    const updatedResource = { id: id, name: name };
    res.json(updatedResource);
  } catch (error: any) {
    next(error);
  }
});

// DELETE a resource
router.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new APIError('Invalid resource ID. Must be a number.', 400));
    }

    // TODO: Delete resource from database
    res.status(204).send(); // No content on successful deletion
  } catch (error: any) {
    next(error);
  }
});

router.use(errorHandler);

export default router;