// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Placeholder for database interaction
const db = {
  resources: [] as any[],
};

// Create a new resource
router.post(
  '/',
  body('name').isString().notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.body;
      const newResource = { id: db.resources.length + 1, name };
      db.resources.push(newResource);
      res.status(201).json(newResource);
    } catch (error) {
      next(error);
    }
  }
);

// Get all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(db.resources);
  } catch (error) {
    next(error);
  }
});

// Get a specific resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const resource = db.resources.find((r) => r.id === id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Update a resource by ID
router.put(
  '/:id',
  body('name').isString().notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const { name } = req.body;
      const resourceIndex = db.resources.findIndex((r) => r.id === id);
      if (resourceIndex === -1) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      db.resources[resourceIndex] = { id, name };
      res.json({ id, name });
    } catch (error) {
      next(error);
    }
  }
);

// Delete a resource by ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const resourceIndex = db.resources.findIndex((r) => r.id === id);
    if (resourceIndex === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    db.resources.splice(resourceIndex, 1);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;