// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Custom Error Class
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
    Object.setPrototypeOf(this, APIError.prototype); // Required for extending Error in TypeScript
  }
}

// Generic Resource Interface
interface Resource {
  id: string;
  [key: string]: any;
}

// In-memory data store (replace with database in production)
const resources: { [id: string]: Resource } = {};

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// --- CRUD Operations ---

// Create
app.post('/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Math.random().toString(36).substring(2, 15); // Generate a random ID
    const newResource: Resource = { id, ...req.body };
    resources[id] = newResource;
    res.status(201).json(newResource);
  } catch (error: any) {
    next(new APIError(error.message, 500));
  }
});

// Read (by ID)
app.get('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const resource = resources[id];
    if (!resource) {
      throw new APIError('Resource not found', 404);
    }
    res.json(resource);
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

// Update
app.put('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!resources[id]) {
      throw new APIError('Resource not found', 404);
    }
    const updatedResource: Resource = { id, ...req.body };
    resources[id] = updatedResource;
    res.json(updatedResource);
  } catch (error: any) {
    next(error);
  }
});

// Delete
app.delete('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!resources[id]) {
      throw new APIError('Resource not found', 404);
    }
    delete resources[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    next(error);
  }
});

// --- End CRUD Operations ---

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Custom Error Class
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
    Object.setPrototypeOf(this, APIError.prototype); // Required for extending Error in TypeScript
  }
}

// Generic Resource Interface
interface Resource {
  id: string;
  [key: string]: any;
}

// In-memory data store (replace with database in production)
const resources: { [id: string]: Resource } = {};

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// --- CRUD Operations ---

// Create
app.post('/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Math.random().toString(36).substring(2, 15); // Generate a random ID
    const newResource: Resource = { id, ...req.body };
    resources[id] = newResource;
    res.status(201).json(newResource);
  } catch (error: any) {
    next(new APIError(error.message, 500));
  }
});

// Read (by ID)
app.get('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const resource = resources[id];
    if (!resource) {
      throw new APIError('Resource not found', 404);
    }
    res.json(resource);
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

// Update
app.put('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!resources[id]) {
      throw new APIError('Resource not found', 404);
    }
    const updatedResource: Resource = { id, ...req.body };
    resources[id] = updatedResource;
    res.json(updatedResource);
  } catch (error: any) {
    next(error);
  }
});

// Delete
app.delete('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!resources[id]) {
      throw new APIError('Resource not found', 404);
    }
    delete resources[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    next(error);
  }
});

// --- End CRUD Operations ---

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});