// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(bodyParser.json());

interface Item {
  id: string;
  name: string;
  description: string;
}

let items: Item[] = [];

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// Middleware for input validation
const validateItem = (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).send({ error: 'Name and description are required.' });
  }
  next();
};

// GET all items
app.get('/items', (req: Request, res: Response) => {
  res.json(items);
});

// GET a specific item by ID
app.get('/items/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const item = items.find((item) => item.id === id);
  if (!item) {
    return res.status(404).send({ error: 'Item not found.' });
  }
  res.json(item);
});

// POST a new item
app.post('/items', validateItem, (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const newItem: Item = {
      id: uuidv4(),
      name,
      description,
    };
    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error: any) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
});

// PUT (update) an existing item
app.put('/items/:id', validateItem, (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).send({ error: 'Item not found.' });
  }

  items[itemIndex] = { ...items[itemIndex], name, description };
  res.json(items[itemIndex]);
});

// DELETE an item
app.delete('/items/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  items = items.filter((item) => item.id !== id);
  res.status(204).send(); // No content
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// config.ts
export const port = 3000;