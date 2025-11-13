// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory data store (replace with a database in a real application)
const resources: { [id: string]: any } = {};

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Middleware for request validation (example)
const validateResource = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  next();
};

// GET all resources
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(Object.values(resources));
  } catch (error: any) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

// GET a specific resource by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resources[id]);
  } catch (error: any) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ error: "Failed to fetch resource" });
  }
});

// POST a new resource
router.post('/', validateResource, (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const newResource = { id, ...req.body };
    resources[id] = newResource;
    res.status(201).json(newResource);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

// PUT (update) an existing resource
router.put('/:id', validateResource, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const updatedResource = { ...resources[id], ...req.body };
    resources[id] = updatedResource;
    res.json(updatedResource);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Failed to update resource" });
  }
});

// DELETE a resource
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    delete resources[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

router.use(errorHandler); // Apply error handling middleware

export default router;

// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory data store (replace with a database in a real application)
const resources: { [id: string]: any } = {};

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Middleware for request validation (example)
const validateResource = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  next();
};

// GET all resources
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(Object.values(resources));
  } catch (error: any) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

// GET a specific resource by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resources[id]);
  } catch (error: any) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ error: "Failed to fetch resource" });
  }
});

// POST a new resource
router.post('/', validateResource, (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const newResource = { id, ...req.body };
    resources[id] = newResource;
    res.status(201).json(newResource);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

// PUT (update) an existing resource
router.put('/:id', validateResource, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const updatedResource = { ...resources[id], ...req.body };
    resources[id] = updatedResource;
    res.json(updatedResource);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Failed to update resource" });
  }
});

// DELETE a resource
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    delete resources[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

router.use(errorHandler); // Apply error handling middleware

export default router;