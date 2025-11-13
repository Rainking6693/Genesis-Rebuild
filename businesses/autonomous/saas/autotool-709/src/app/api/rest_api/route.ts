// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Simulated database (replace with actual database integration)
const data: any[] = [];
let nextId = 1;

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET all items
app.get('/items', (req: Request, res: Response) => {
  try {
    res.json(data);
  } catch (error: any) {
    next(error);
  }
});

// GET item by ID
app.get('/items/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = data.find(item => item.id === id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error: any) {
    next(error);
  }
});

// POST new item
app.post('/items', (req: Request, res: Response) => {
  try {
    const newItem = { id: nextId++, ...req.body };
    data.push(newItem);
    res.status(201).json(newItem);
  } catch (error: any) {
    next(error);
  }
});

// PUT update item
app.put('/items/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const index = data.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    data[index] = { id, ...req.body };
    res.json(data[index]);
  } catch (error: any) {
    next(error);
  }
});

// DELETE item
app.delete('/items/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const index = data.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    data.splice(index, 1);
    res.status(204).send(); // No content
  } catch (error: any) {
    next(error);
  }
});

app.use(errorHandler); // Use the error handler

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

### Build Report