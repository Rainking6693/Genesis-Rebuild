// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store (replace with a database in production)
const data: { [key: string]: any } = {};

// Generic error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  // Customize error responses based on error type
  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET all resources
app.get('/api/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = Object.values(data);
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// GET a specific resource by ID
app.get('/api/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(data[id]);
  } catch (error) {
    next(error);
  }
});

// POST a new resource
app.post('/api/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = uuidv4();
    const newResource = { id, ...req.body };
    data[id] = newResource;
    res.status(201).json(newResource);
  } catch (error) {
    next(error);
  }
});

// PUT (update) an existing resource
app.put('/api/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const updatedResource = { id, ...req.body };
    data[id] = updatedResource;
    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// DELETE a resource
app.delete('/api/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    delete data[id];
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    next(error);
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store (replace with a database in production)
const data: { [key: string]: any } = {};

// Generic error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  // Customize error responses based on error type
  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET all resources
app.get('/api/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = Object.values(data);
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// GET a specific resource by ID
app.get('/api/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(data[id]);
  } catch (error) {
    next(error);
  }
});

// POST a new resource
app.post('/api/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = uuidv4();
    const newResource = { id, ...req.body };
    data[id] = newResource;
    res.status(201).json(newResource);
  } catch (error) {
    next(error);
  }
});

// PUT (update) an existing resource
app.put('/api/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    const updatedResource = { id, ...req.body };
    data[id] = updatedResource;
    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// DELETE a resource
app.delete('/api/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    delete data[id];
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    next(error);
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;