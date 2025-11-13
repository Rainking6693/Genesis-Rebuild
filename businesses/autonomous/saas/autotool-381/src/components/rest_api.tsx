// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Custom Error Class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Add the name property
  }
}

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// In-memory data store (replace with a database in a real application)
const resources: any[] = [];
let nextId = 1;

// Create a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.body;

    if (!data) {
      throw new ApiError(400, "Data is required");
    }

    const newResource = { id: nextId++, data };
    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (error) {
    next(error);
  }
});

// Get all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// Get a specific resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const resource = resources.find(r => r.id === id);

    if (!resource) {
      throw new ApiError(404, "Resource not found");
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Update a resource by ID
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const { data } = req.body;

    if (!data) {
      throw new ApiError(400, "Data is required");
    }

    const index = resources.findIndex(r => r.id === id);

    if (index === -1) {
      throw new ApiError(404, "Resource not found");
    }

    resources[index] = { id, data };
    res.json({ id, data });
  } catch (error) {
    next(error);
  }
});

// Delete a resource by ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const index = resources.findIndex(r => r.id === id);

    if (index === -1) {
      throw new ApiError(404, "Resource not found");
    }

    resources.splice(index, 1);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;

// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Custom Error Class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Add the name property
  }
}

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// In-memory data store (replace with a database in a real application)
const resources: any[] = [];
let nextId = 1;

// Create a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.body;

    if (!data) {
      throw new ApiError(400, "Data is required");
    }

    const newResource = { id: nextId++, data };
    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (error) {
    next(error);
  }
});

// Get all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// Get a specific resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const resource = resources.find(r => r.id === id);

    if (!resource) {
      throw new ApiError(404, "Resource not found");
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Update a resource by ID
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const { data } = req.body;

    if (!data) {
      throw new ApiError(400, "Data is required");
    }

    const index = resources.findIndex(r => r.id === id);

    if (index === -1) {
      throw new ApiError(404, "Resource not found");
    }

    resources[index] = { id, data };
    res.json({ id, data });
  } catch (error) {
    next(error);
  }
});

// Delete a resource by ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const index = resources.findIndex(r => r.id === id);

    if (index === -1) {
      throw new ApiError(404, "Resource not found");
    }

    resources.splice(index, 1);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;