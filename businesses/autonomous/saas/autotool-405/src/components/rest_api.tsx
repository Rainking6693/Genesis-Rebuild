// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

interface Resource {
  id: string;
  name: string;
  description: string;
}

let resources: Resource[] = [];

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

// GET all resources
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(resources);
  } catch (error: any) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

// GET a single resource by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const resource = resources.find(r => r.id === req.params.id);
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error: any) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ error: "Failed to fetch resource" });
  }
});

// POST a new resource
router.post('/', (req: Request, res: Response) => {
  try {
    const newResource: Resource = {
      id: Math.random().toString(36).substring(2, 15), // Generate a random ID
      ...req.body,
    };
    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(400).json({ error: "Invalid input" });
  }
});

// PUT (update) an existing resource
router.put('/:id', (req: Request, res: Response) => {
  try {
    const index = resources.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
      resources[index] = { ...resources[index], ...req.body };
      res.json(resources[index]);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(400).json({ error: "Invalid input" });
  }
});

// DELETE a resource
router.delete('/:id', (req: Request, res: Response) => {
  try {
    resources = resources.filter(r => r.id !== req.params.id);
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

router.use(errorHandler);

export default router;

// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

interface Resource {
  id: string;
  name: string;
  description: string;
}

let resources: Resource[] = [];

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

// GET all resources
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(resources);
  } catch (error: any) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

// GET a single resource by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const resource = resources.find(r => r.id === req.params.id);
    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error: any) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ error: "Failed to fetch resource" });
  }
});

// POST a new resource
router.post('/', (req: Request, res: Response) => {
  try {
    const newResource: Resource = {
      id: Math.random().toString(36).substring(2, 15), // Generate a random ID
      ...req.body,
    };
    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(400).json({ error: "Invalid input" });
  }
});

// PUT (update) an existing resource
router.put('/:id', (req: Request, res: Response) => {
  try {
    const index = resources.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
      resources[index] = { ...resources[index], ...req.body };
      res.json(resources[index]);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(400).json({ error: "Invalid input" });
  }
});

// DELETE a resource
router.delete('/:id', (req: Request, res: Response) => {
  try {
    resources = resources.filter(r => r.id !== req.params.id);
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

router.use(errorHandler);

export default router;