// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Simple in-memory data store (replace with a database in a real application)
const data: { [key: string]: any } = {};

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Internal Server Error' });
});

// GET all resources
app.get('/api/resources', (req: Request, res: Response) => {
  try {
    res.json(Object.values(data));
  } catch (error: any) {
    console.error("Error fetching resources:", error);
    next(error); // Pass error to error handling middleware
  }
});

// GET a specific resource by ID
app.get('/api/resources/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).send({ error: 'Resource not found' });
    }
    res.json(data[id]);
  } catch (error: any) {
    console.error("Error fetching resource by ID:", error);
    next(error);
  }
});

// POST a new resource
app.post('/api/resources', (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const newResource = { id, ...req.body };
    data[id] = newResource;
    res.status(201).json(newResource);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    next(error);
  }
});

// PUT (update) an existing resource
app.put('/api/resources/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).send({ error: 'Resource not found' });
    }
    const updatedResource = { id, ...req.body };
    data[id] = updatedResource;
    res.json(updatedResource);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    next(error);
  }
});

// DELETE a resource
app.delete('/api/resources/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).send({ error: 'Resource not found' });
    }
    delete data[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;