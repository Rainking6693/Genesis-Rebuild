// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Define a type for the resource
interface Resource {
  id: string;
  name: string;
  description: string;
}

// In-memory data store (replace with a database)
const resources: Resource[] = [];

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET all resources
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(resources);
  } catch (err) {
    next(err);
  }
});

// GET a single resource by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const resource = resources.find((r) => r.id === id);

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
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const newResource: Resource = {
      id: uuidv4(),
      name,
      description,
    };

    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (err) {
    next(err);
  }
});

// PUT (update) an existing resource
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const resourceIndex = resources.findIndex((r) => r.id === id);

    if (resourceIndex === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    resources[resourceIndex] = {
      id,
      name,
      description,
    };

    res.json(resources[resourceIndex]);
  } catch (err) {
    next(err);
  }
});

// DELETE a resource
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const resourceIndex = resources.findIndex((r) => r.id === id);

    if (resourceIndex === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    resources.splice(resourceIndex, 1);
    res.status(204).send(); // No content
  } catch (err) {
    next(err);
  }
});

router.use(errorHandler);

export default router;