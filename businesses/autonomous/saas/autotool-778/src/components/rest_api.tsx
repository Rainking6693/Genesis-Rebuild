// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory data store (replace with a database in a real application)
const resources: { [id: string]: any } = {};

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.body;

    if (!data) {
      throw new ApiError("Data is required", 400);
    }

    const id = uuidv4();
    resources[id] = { id, data };
    res.status(201).json(resources[id]);

  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

// Get all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(Object.values(resources));
  } catch (error) {
    next(error);
  }
});

// Get a specific resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      throw new ApiError("Resource not found", 404);
    }
    res.json(resources[id]);
  } catch (error) {
    next(error);
  }
});

// Update a resource by ID
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    if (!resources[id]) {
      throw new ApiError("Resource not found", 404);
    }

    if (!data) {
      throw new ApiError("Data is required", 400);
    }

    resources[id] = { id, data };
    res.json(resources[id]);
  } catch (error) {
    next(error);
  }
});

// Delete a resource by ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      throw new ApiError("Resource not found", 404);
    }
    delete resources[id];
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use error handling middleware

export default router;

// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory data store (replace with a database in a real application)
const resources: { [id: string]: any } = {};

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.body;

    if (!data) {
      throw new ApiError("Data is required", 400);
    }

    const id = uuidv4();
    resources[id] = { id, data };
    res.status(201).json(resources[id]);

  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

// Get all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(Object.values(resources));
  } catch (error) {
    next(error);
  }
});

// Get a specific resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      throw new ApiError("Resource not found", 404);
    }
    res.json(resources[id]);
  } catch (error) {
    next(error);
  }
});

// Update a resource by ID
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    if (!resources[id]) {
      throw new ApiError("Resource not found", 404);
    }

    if (!data) {
      throw new ApiError("Data is required", 400);
    }

    resources[id] = { id, data };
    res.json(resources[id]);
  } catch (error) {
    next(error);
  }
});

// Delete a resource by ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!resources[id]) {
      throw new ApiError("Resource not found", 404);
    }
    delete resources[id];
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use error handling middleware

export default router;