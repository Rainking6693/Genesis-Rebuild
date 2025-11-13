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

// Middleware for input validation
const validateInput = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }
  next();
};

// Create a new resource
router.post('/', validateInput, (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const { name } = req.body;
    resources[id] = { id, name };
    res.status(201).json(resources[id]);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// Get all resources
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(Object.values(resources));
  } catch (error: any) {
    console.error("Error getting all resources:", error);
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// Get a specific resource by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resources[id]);
  } catch (error: any) {
    console.error("Error getting resource by ID:", error);
    res.status(500).json({ error: 'Failed to get resource' });
  }
});

// Update an existing resource
router.put('/:id', validateInput, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const { name } = req.body;
    resources[id] = { id, name };
    res.json(resources[id]);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete a resource
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
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

router.use(errorHandler);

export default router;

// src/index.ts
import express from 'express';
import resourceRoutes from './api/resource';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/resources', resourceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

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

// Middleware for input validation
const validateInput = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }
  next();
};

// Create a new resource
router.post('/', validateInput, (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const { name } = req.body;
    resources[id] = { id, name };
    res.status(201).json(resources[id]);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// Get all resources
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(Object.values(resources));
  } catch (error: any) {
    console.error("Error getting all resources:", error);
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// Get a specific resource by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resources[id]);
  } catch (error: any) {
    console.error("Error getting resource by ID:", error);
    res.status(500).json({ error: 'Failed to get resource' });
  }
});

// Update an existing resource
router.put('/:id', validateInput, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const { name } = req.body;
    resources[id] = { id, name };
    res.json(resources[id]);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete a resource
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
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

router.use(errorHandler);

export default router;

// src/index.ts
import express from 'express';
import resourceRoutes from './api/resource';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/resources', resourceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

Now, I will use the `Write` tool to save this code to `src/api/resource.ts` and `src/index.ts`.

Finally, I will output the code and build report.