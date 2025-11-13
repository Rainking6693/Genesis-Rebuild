// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const router = express.Router();

// Define a schema for validating the resource data
const resourceSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

// Middleware for handling errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
};

// GET all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate fetching resources from a database
    const resources = [{ id: 1, name: 'Resource 1', description: 'Example resource' }];
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// GET a single resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }

    // Simulate fetching a resource from a database
    const resource = { id: id, name: 'Resource ' + id, description: 'Example resource' };
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// POST a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedResource = resourceSchema.parse(req.body); // Validate the request body
    // Simulate creating a new resource in a database
    const newResource = { id: Math.floor(Math.random() * 1000), ...parsedResource };
    res.status(201).json(newResource); // 201 Created
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// PUT (update) an existing resource
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }

    const parsedResource = resourceSchema.parse(req.body); // Validate the request body

    // Simulate updating a resource in a database
    const updatedResource = { id: id, ...parsedResource };
    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// DELETE a resource
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }

    // Simulate deleting a resource from a database
    res.status(204).send(); // 204 No Content (successful deletion)
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use the error handler middleware

export default router;

// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const router = express.Router();

// Define a schema for validating the resource data
const resourceSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

// Middleware for handling errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
};

// GET all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate fetching resources from a database
    const resources = [{ id: 1, name: 'Resource 1', description: 'Example resource' }];
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// GET a single resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }

    // Simulate fetching a resource from a database
    const resource = { id: id, name: 'Resource ' + id, description: 'Example resource' };
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// POST a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedResource = resourceSchema.parse(req.body); // Validate the request body
    // Simulate creating a new resource in a database
    const newResource = { id: Math.floor(Math.random() * 1000), ...parsedResource };
    res.status(201).json(newResource); // 201 Created
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// PUT (update) an existing resource
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }

    const parsedResource = resourceSchema.parse(req.body); // Validate the request body

    // Simulate updating a resource in a database
    const updatedResource = { id: id, ...parsedResource };
    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// DELETE a resource
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }

    // Simulate deleting a resource from a database
    res.status(204).send(); // 204 No Content (successful deletion)
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use the error handler middleware

export default router;