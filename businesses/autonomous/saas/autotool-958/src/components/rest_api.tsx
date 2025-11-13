// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Define a simple data store (replace with a database in a real application)
const data: { [key: string]: any } = {};

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
  console.error(err); // Log the error

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create (POST)
router.post('/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = uuidv4();
    const resource = { id, ...req.body };
    data[id] = resource;
    res.status(201).json(resource);
  } catch (error: any) {
    next(error);
  }
});

// Read (GET) - Get all resources
router.get('/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = Object.values(data);
    res.json(resources);
  } catch (error: any) {
    next(error);
  }
});

// Read (GET) - Get a specific resource by ID
router.get('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      throw new ApiError('Resource not found', 404);
    }
    res.json(data[id]);
  } catch (error: any) {
    next(error);
  }
});

// Update (PUT)
router.put('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      throw new ApiError('Resource not found', 404);
    }
    const updatedResource = { ...data[id], ...req.body };
    data[id] = updatedResource;
    res.json(updatedResource);
  } catch (error: any) {
    next(error);
  }
});

// Delete (DELETE)
router.delete('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      throw new ApiError('Resource not found', 404);
    }
    delete data[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    next(error);
  }
});

router.use(errorHandler);

export default router;

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Define a simple data store (replace with a database in a real application)
const data: { [key: string]: any } = {};

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
  console.error(err); // Log the error

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create (POST)
router.post('/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = uuidv4();
    const resource = { id, ...req.body };
    data[id] = resource;
    res.status(201).json(resource);
  } catch (error: any) {
    next(error);
  }
});

// Read (GET) - Get all resources
router.get('/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = Object.values(data);
    res.json(resources);
  } catch (error: any) {
    next(error);
  }
});

// Read (GET) - Get a specific resource by ID
router.get('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      throw new ApiError('Resource not found', 404);
    }
    res.json(data[id]);
  } catch (error: any) {
    next(error);
  }
});

// Update (PUT)
router.put('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      throw new ApiError('Resource not found', 404);
    }
    const updatedResource = { ...data[id], ...req.body };
    data[id] = updatedResource;
    res.json(updatedResource);
  } catch (error: any) {
    next(error);
  }
});

// Delete (DELETE)
router.delete('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      throw new ApiError('Resource not found', 404);
    }
    delete data[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    next(error);
  }
});

router.use(errorHandler);

export default router;