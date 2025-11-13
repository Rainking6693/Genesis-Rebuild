// src/api/resource.ts
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Placeholder for database interaction
const resources: any[] = [];
let nextResourceId = 1;

// Create a new resource
router.post(
  '/',
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('description').isString().optional(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;
      const newResource = { id: nextResourceId++, name, description };
      resources.push(newResource);

      res.status(201).json(newResource);
    } catch (error: any) {
      console.error('Error creating resource:', error);
      res.status(500).json({ error: 'Failed to create resource' });
    }
  }
);

// Get all resources
router.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json(resources);
  } catch (error: any) {
    console.error('Error getting resources:', error);
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// Get a specific resource by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const resourceId = parseInt(req.params.id);
    const resource = resources.find((r) => r.id === resourceId);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(200).json(resource);
  } catch (error: any) {
    console.error('Error getting resource:', error);
    res.status(500).json({ error: 'Failed to get resource' });
  }
});

// Update an existing resource
router.put(
  '/:id',
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('description').isString().optional(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const resourceId = parseInt(req.params.id);
      const resourceIndex = resources.findIndex((r) => r.id === resourceId);

      if (resourceIndex === -1) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      const { name, description } = req.body;
      resources[resourceIndex] = { id: resourceId, name, description };

      res.status(200).json(resources[resourceIndex]);
    } catch (error: any) {
      console.error('Error updating resource:', error);
      res.status(500).json({ error: 'Failed to update resource' });
    }
  }
);

// Delete a resource
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const resourceId = parseInt(req.params.id);
    const resourceIndex = resources.findIndex((r) => r.id === resourceId);

    if (resourceIndex === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    resources.splice(resourceIndex, 1);
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

export default router;

// index.ts (example usage)
import express from 'express';
import resourceRoutes from './api/resource';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/resources', resourceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});