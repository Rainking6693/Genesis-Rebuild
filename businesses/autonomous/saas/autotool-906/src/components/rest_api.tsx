// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; //Properly setting the name for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype); //Properly setting the prototype
  }
}

// Middleware for handling errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET all users
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate fetching users from a database
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
    res.json(users);
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

// GET a specific user by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      throw new ApiError("Invalid user ID", 400);
    }

    // Simulate fetching a user from a database
    const user = { id: userId, name: `User ${userId}` };

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.json(user);
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

// POST a new user
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new ApiError('Name is required', 400);
    }

    // Simulate creating a new user in a database
    const newUser = { id: Math.floor(Math.random() * 100), name };
    res.status(201).json(newUser); // 201 Created
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

// PUT (update) an existing user
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            throw new ApiError("Invalid user ID", 400);
        }

        const { name } = req.body;
        if (!name) {
            throw new ApiError("Name is required", 400);
        }

        // Simulate updating a user in a database
        const updatedUser = { id: userId, name: name };
        res.json(updatedUser);
    } catch (error: any) {
        next(error);
    }
});

// DELETE a user
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            throw new ApiError("Invalid user ID", 400);
        }

        // Simulate deleting a user from a database
        res.status(204).send(); // 204 No Content
    } catch (error: any) {
        next(error);
    }
});

router.use(errorHandler); // Use the error handler middleware

export default router;

// src/api/users.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; //Properly setting the name for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype); //Properly setting the prototype
  }
}

// Middleware for handling errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET all users
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate fetching users from a database
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
    res.json(users);
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

// GET a specific user by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      throw new ApiError("Invalid user ID", 400);
    }

    // Simulate fetching a user from a database
    const user = { id: userId, name: `User ${userId}` };

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.json(user);
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

// POST a new user
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new ApiError('Name is required', 400);
    }

    // Simulate creating a new user in a database
    const newUser = { id: Math.floor(Math.random() * 100), name };
    res.status(201).json(newUser); // 201 Created
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

// PUT (update) an existing user
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            throw new ApiError("Invalid user ID", 400);
        }

        const { name } = req.body;
        if (!name) {
            throw new ApiError("Name is required", 400);
        }

        // Simulate updating a user in a database
        const updatedUser = { id: userId, name: name };
        res.json(updatedUser);
    } catch (error: any) {
        next(error);
    }
});

// DELETE a user
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            throw new ApiError("Invalid user ID", 400);
        }

        // Simulate deleting a user from a database
        res.status(204).send(); // 204 No Content
    } catch (error: any) {
        next(error);
    }
});

router.use(errorHandler); // Use the error handler middleware

export default router;