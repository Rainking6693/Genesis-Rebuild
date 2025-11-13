// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// In-memory data store (replace with a database in a real application)
let resources: any[] = [];
let nextId = 1;

// GET all resources
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(resources);
  } catch (err) {
    next(err);
  }
});

// GET a specific resource by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const resource = resources.find(r => r.id === id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (err) {
    next(err);
  }
});

// POST a new resource
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const newResource = { id: nextId++, ...req.body };
    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (err) {
    next(err);
  }
});

// PUT (update) an existing resource
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const index = resources.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    resources[index] = { id, ...req.body };
    res.json(resources[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE a resource
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    resources = resources.filter(r => r.id !== id);
    res.status(204).send(); // No content
  } catch (err) {
    next(err);
  }
});

router.use(errorHandler);

export default router;