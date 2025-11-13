// src/api/resource.ts

import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory data store (replace with a database in a real application)
let resources: { [id: string]: any } = {};

// Custom Error Classes
class ResourceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResourceNotFoundError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging

  if (err instanceof ResourceNotFoundError) {
    return res.status(404).json({ error: err.message });
  } else if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

// Create a new resource
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      throw new ValidationError("Name and description are required.");
    }

    const id = uuidv4();
    const newResource = { id, name, description };
    resources[id] = newResource;

    res.status(201).json(newResource);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Get all resources
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(Object.values(resources));
  } catch (error) {
    next(error);
  }
});

// Get a specific resource by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const resource = resources[id];

    if (!resource) {
      throw new ResourceNotFoundError(`Resource with ID ${id} not found`);
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Update an existing resource
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!resources[id]) {
      throw new ResourceNotFoundError(`Resource with ID ${id} not found`);
    }

    if (!name || !description) {
      throw new ValidationError("Name and description are required.");
    }

    const updatedResource = { id, name, description };
    resources[id] = updatedResource;

    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// Delete a resource
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!resources[id]) {
      throw new ResourceNotFoundError(`Resource with ID ${id} not found`);
    }

    delete resources[id];
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Apply error handling middleware

export default router;

// src/api/resource.ts

import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory data store (replace with a database in a real application)
let resources: { [id: string]: any } = {};

// Custom Error Classes
class ResourceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResourceNotFoundError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging

  if (err instanceof ResourceNotFoundError) {
    return res.status(404).json({ error: err.message });
  } else if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

// Create a new resource
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      throw new ValidationError("Name and description are required.");
    }

    const id = uuidv4();
    const newResource = { id, name, description };
    resources[id] = newResource;

    res.status(201).json(newResource);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Get all resources
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(Object.values(resources));
  } catch (error) {
    next(error);
  }
});

// Get a specific resource by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const resource = resources[id];

    if (!resource) {
      throw new ResourceNotFoundError(`Resource with ID ${id} not found`);
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Update an existing resource
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!resources[id]) {
      throw new ResourceNotFoundError(`Resource with ID ${id} not found`);
    }

    if (!name || !description) {
      throw new ValidationError("Name and description are required.");
    }

    const updatedResource = { id, name, description };
    resources[id] = updatedResource;

    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// Delete a resource
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!resources[id]) {
      throw new ResourceNotFoundError(`Resource with ID ${id} not found`);
    }

    delete resources[id];
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Apply error handling middleware

export default router;