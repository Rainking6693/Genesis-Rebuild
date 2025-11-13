// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { validate } from 'uuid'; // For validating UUIDs

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store (replace with a database in a real application)
const data: { [key: string]: any } = {};

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging
  res.status(500).json({ error: 'Internal Server Error' });
};

// Generic validation middleware
const validateInput = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    console.error("Validation Error:", error);
    res.status(400).json({ error: 'Invalid input', details: error.errors });
  }
};

// Example Zod schema for input validation (install zod: npm install zod)
import { z } from 'zod';

const itemSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

// --- CRUD Operations ---

// Create
app.post('/items', validateInput(itemSchema), (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    data[id] = { ...req.body, id };
    res.status(201).json(data[id]);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Read (Single Item)
app.get('/items/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  if (!validate(id)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
  }

  if (!data[id]) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(data[id]);
});

// Read (All Items)
app.get('/items', (req: Request, res: Response) => {
  res.json(Object.values(data));
});

// Update
app.put('/items/:id', validateInput(itemSchema), (req: Request, res: Response) => {
  const { id } = req.params;

  if (!validate(id)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
  }

  if (!data[id]) {
    return res.status(404).json({ error: 'Item not found' });
  }

  try {
    data[id] = { ...data[id], ...req.body, id };
    res.json(data[id]);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete
app.delete('/items/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  if (!validate(id)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
  }

  if (!data[id]) {
    return res.status(404).json({ error: 'Item not found' });
  }

  try {
    delete data[id];
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Use error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;