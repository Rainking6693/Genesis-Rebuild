// src/api/resources.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

interface Resource {
  id: string;
  name: string;
  description: string;
}

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET all resources
router.get('/', (req: Request, res: Response) => {
  try {
    // Simulate fetching resources from a database
    const resources: Resource[] = [
      { id: '1', name: 'Resource 1', description: 'This is resource 1' },
      { id: '2', name: 'Resource 2', description: 'This is resource 2' },
    ];
    res.json(resources);
  } catch (error: any) {
    next(error); // Pass error to error handler
  }
});

// GET a single resource by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // Simulate fetching a resource from a database
    const resource: Resource | undefined = { id: id, name: `Resource ${id}`, description: `This is resource ${id}` };

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error: any) {
    next(error); // Pass error to error handler
  }
});

// POST a new resource
router.post('/', (req: Request, res: Response) => {
  try {
    const newResource: Resource = {
      id: Math.random().toString(36).substring(2, 15), // Generate a random ID
      name: req.body.name,
      description: req.body.description,
    };
    // Simulate saving the resource to a database
    console.log('Creating new resource:', newResource);
    res.status(201).json(newResource); // 201 Created
  } catch (error: any) {
    next(error); // Pass error to error handler
  }
});

// PUT (update) an existing resource
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // Simulate updating a resource in a database
    console.log(`Updating resource with ID: ${id}`, req.body);
    res.json({ message: `Resource with ID ${id} updated successfully` });
  } catch (error: any) {
    next(error); // Pass error to error handler
  }
});

// DELETE a resource
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // Simulate deleting a resource from a database
    console.log(`Deleting resource with ID: ${id}`);
    res.status(204).send(); // 204 No Content
  } catch (error: any) {
    next(error); // Pass error to error handler
  }
});

router.use(errorHandler);

export default router;