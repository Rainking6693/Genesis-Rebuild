// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// In-memory data store (replace with a database in a real application)
const items: { [id: string]: any } = {};

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// API Endpoints

// Create item
app.post('/items', (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const newItem = { id, ...req.body };
    items[id] = newItem;
    res.status(201).send(newItem);
  } catch (error: any) {
    console.error("Error creating item:", error);
    res.status(500).send({ error: "Failed to create item" });
  }
});

// Read item
app.get('/items/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (items[id]) {
      res.send(items[id]);
    } else {
      res.status(404).send({ error: 'Item not found' });
    }
  } catch (error: any) {
    console.error("Error reading item:", error);
    res.status(500).send({ error: "Failed to read item" });
  }
});

// Update item
app.put('/items/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (items[id]) {
      items[id] = { ...items[id], ...req.body };
      res.send(items[id]);
    } else {
      res.status(404).send({ error: 'Item not found' });
    }
  } catch (error: any) {
    console.error("Error updating item:", error);
    res.status(500).send({ error: "Failed to update item" });
  }
});

// Delete item
app.delete('/items/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (items[id]) {
      delete items[id];
      res.status(204).send(); // No content
    } else {
      res.status(404).send({ error: 'Item not found' });
    }
  } catch (error: any) {
    console.error("Error deleting item:", error);
    res.status(500).send({ error: "Failed to delete item" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

Now, I'll use the tools to output the code and the build report.