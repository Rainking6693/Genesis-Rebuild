// src/api/resources.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Custom error class for resource not found
class ResourceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResourceNotFoundError";
  }
}

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging

  if (err instanceof ResourceNotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate fetching resources from a database
    const resources = [{ id: 1, name: 'Resource 1' }, { id: 2, name: 'Resource 2' }];
    res.json(resources);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// GET a specific resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    // Simulate fetching a resource from a database
    const resource = { id: id, name: `Resource ${id}` };

    if (!resource) {
      throw new ResourceNotFoundError(`Resource with ID ${id} not found`);
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// POST a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newResource = req.body;

    // Simulate saving the new resource to a database
    newResource.id = Math.floor(Math.random() * 100); // Assign a random ID
    res.status(201).json(newResource); // 201 Created
  } catch (error) {
    next(error);
  }
});

// PUT (update) an existing resource
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const updatedResource = req.body;

    // Simulate updating the resource in a database
    updatedResource.id = id;

    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// DELETE a resource
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    // Simulate deleting the resource from a database
    res.status(204).send(); // 204 No Content (successful deletion)
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;

// src/api/resources.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Custom error class for resource not found
class ResourceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResourceNotFoundError";
  }
}

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging

  if (err instanceof ResourceNotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate fetching resources from a database
    const resources = [{ id: 1, name: 'Resource 1' }, { id: 2, name: 'Resource 2' }];
    res.json(resources);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// GET a specific resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    // Simulate fetching a resource from a database
    const resource = { id: id, name: `Resource ${id}` };

    if (!resource) {
      throw new ResourceNotFoundError(`Resource with ID ${id} not found`);
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// POST a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newResource = req.body;

    // Simulate saving the new resource to a database
    newResource.id = Math.floor(Math.random() * 100); // Assign a random ID
    res.status(201).json(newResource); // 201 Created
  } catch (error) {
    next(error);
  }
});

// PUT (update) an existing resource
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const updatedResource = req.body;

    // Simulate updating the resource in a database
    updatedResource.id = id;

    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// DELETE a resource
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    // Simulate deleting the resource from a database
    res.status(204).send(); // 204 No Content (successful deletion)
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;