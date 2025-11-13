// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory data store (replace with a database in production)
const data: { [key: string]: any } = {};

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Middleware for request validation (example)
const validateCreateRequest = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  next();
};

// GET all resources
app.get('/resources', (req: Request, res: Response) => {
  try {
    res.json(Object.values(data));
  } catch (error: any) {
    console.error("Error getting resources:", error);
    res.status(500).json({ error: "Failed to retrieve resources" });
  }
});

// GET a specific resource by ID
app.get('/resources/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(data[id]);
  } catch (error: any) {
    console.error("Error getting resource:", error);
    res.status(500).json({ error: "Failed to retrieve resource" });
  }
});

// POST a new resource
app.post('/resources', validateCreateRequest, (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    data[id] = { id, ...req.body };
    res.status(201).json(data[id]);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

// PUT (update) an existing resource
app.put('/resources/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    data[id] = { ...data[id], ...req.body };
    res.json(data[id]);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Failed to update resource" });
  }
});

// DELETE a resource
app.delete('/resources/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    delete data[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;