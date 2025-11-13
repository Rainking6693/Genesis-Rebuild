// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// In-memory data store (replace with a database in a real application)
const data: { [key: string]: any } = {};

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// Middleware for input validation
const validateInput = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({ error: 'Request body is empty.' });
  }
  next();
};

// GET all resources
app.get('/api/resources', (req: Request, res: Response) => {
  try {
    res.json(Object.values(data));
  } catch (error: any) {
    console.error("Error getting resources:", error);
    res.status(500).json({ error: "Failed to retrieve resources" });
  }
});

// GET a specific resource by ID
app.get('/api/resources/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).send({ error: 'Resource not found.' });
    }
    res.json(data[id]);
  } catch (error: any) {
    console.error("Error getting resource by ID:", error);
    res.status(500).json({ error: "Failed to retrieve resource" });
  }
});

// POST a new resource
app.post('/api/resources', validateInput, (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    data[id] = req.body;
    res.status(201).json({ id, ...req.body });
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

// PUT (update) an existing resource
app.put('/api/resources/:id', validateInput, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).send({ error: 'Resource not found.' });
    }
    data[id] = { ...data[id], ...req.body };
    res.json(data[id]);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Failed to update resource" });
  }
});

// DELETE a resource
app.delete('/api/resources/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).send({ error: 'Resource not found.' });
    }
    delete data[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

app.use(errorHandler); // Use error handling middleware

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// In-memory data store (replace with a database in a real application)
const data: { [key: string]: any } = {};

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// Middleware for input validation
const validateInput = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({ error: 'Request body is empty.' });
  }
  next();
};

// GET all resources
app.get('/api/resources', (req: Request, res: Response) => {
  try {
    res.json(Object.values(data));
  } catch (error: any) {
    console.error("Error getting resources:", error);
    res.status(500).json({ error: "Failed to retrieve resources" });
  }
});

// GET a specific resource by ID
app.get('/api/resources/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).send({ error: 'Resource not found.' });
    }
    res.json(data[id]);
  } catch (error: any) {
    console.error("Error getting resource by ID:", error);
    res.status(500).json({ error: "Failed to retrieve resource" });
  }
});

// POST a new resource
app.post('/api/resources', validateInput, (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    data[id] = req.body;
    res.status(201).json({ id, ...req.body });
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

// PUT (update) an existing resource
app.put('/api/resources/:id', validateInput, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).send({ error: 'Resource not found.' });
    }
    data[id] = { ...data[id], ...req.body };
    res.json(data[id]);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Failed to update resource" });
  }
});

// DELETE a resource
app.delete('/api/resources/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      return res.status(404).send({ error: 'Resource not found.' });
    }
    delete data[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

app.use(errorHandler); // Use error handling middleware

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});