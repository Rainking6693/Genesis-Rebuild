// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Custom Error Class
class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype); // Required for extending Error in TypeScript
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

// GET route - Retrieve a resource
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    // Simulate fetching data from a database
    if (id === '123') {
      res.json({ id: id, name: 'Example Resource' });
    } else {
      throw new ApiError(404, 'Resource not found');
    }
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// POST route - Create a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new ApiError(400, 'Name is required');
    }

    // Simulate creating a new resource in a database
    const newResource = { id: '456', name: name };
    res.status(201).json(newResource); // 201 Created
  } catch (error) {
    next(error);
  }
});

// PUT route - Update an existing resource
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      throw new ApiError(400, 'Name is required');
    }

    // Simulate updating a resource in a database
    res.json({ id: id, name: name });
  } catch (error) {
    next(error);
  }
});

// DELETE route - Delete a resource
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    // Simulate deleting a resource from a database
    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use error handling middleware

export default router;