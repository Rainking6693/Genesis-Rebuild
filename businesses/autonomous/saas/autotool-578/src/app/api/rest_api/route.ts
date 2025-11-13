// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store (replace with a database in a real application)
const data: any[] = [];
let nextId = 1;

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging
  res.status(500).json({ error: 'Internal Server Error' });
};

// Error boundary (example - can be expanded)
const errorBoundary = (handler: (req: Request, res: Response) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error); // Pass error to error handling middleware
    }
  };
};

// Create (POST)
app.post('/items', errorBoundary(async (req: Request, res: Response) => {
  try {
    const newItem = { id: nextId++, ...req.body };
    data.push(newItem);
    res.status(201).json(newItem); // 201 Created
  } catch (error: any) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: 'Failed to create item' });
  }
}));

// Read (GET all)
app.get('/items', errorBoundary(async (req: Request, res: Response) => {
  try {
    res.status(200).json(data); // 200 OK
  } catch (error: any) {
    console.error("Error getting items:", error);
    res.status(500).json({ error: 'Failed to retrieve items' });
  }
}));

// Read (GET one)
app.get('/items/:id', errorBoundary(async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = data.find(item => item.id === id);

    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: 'Item not found' }); // 404 Not Found
    }
  } catch (error: any) {
    console.error("Error getting item:", error);
    res.status(500).json({ error: 'Failed to retrieve item' });
  }
}));

// Update (PUT)
app.put('/items/:id', errorBoundary(async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const itemIndex = data.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
      data[itemIndex] = { id, ...req.body };
      res.status(200).json(data[itemIndex]);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error: any) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: 'Failed to update item' });
  }
}));

// Delete (DELETE)
app.delete('/items/:id', errorBoundary(async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const itemIndex = data.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
      data.splice(itemIndex, 1);
      res.status(204).send(); // 204 No Content (successful deletion)
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error: any) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
}));

// Use error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store (replace with a database in a real application)
const data: any[] = [];
let nextId = 1;

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging
  res.status(500).json({ error: 'Internal Server Error' });
};

// Error boundary (example - can be expanded)
const errorBoundary = (handler: (req: Request, res: Response) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error); // Pass error to error handling middleware
    }
  };
};

// Create (POST)
app.post('/items', errorBoundary(async (req: Request, res: Response) => {
  try {
    const newItem = { id: nextId++, ...req.body };
    data.push(newItem);
    res.status(201).json(newItem); // 201 Created
  } catch (error: any) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: 'Failed to create item' });
  }
}));

// Read (GET all)
app.get('/items', errorBoundary(async (req: Request, res: Response) => {
  try {
    res.status(200).json(data); // 200 OK
  } catch (error: any) {
    console.error("Error getting items:", error);
    res.status(500).json({ error: 'Failed to retrieve items' });
  }
}));

// Read (GET one)
app.get('/items/:id', errorBoundary(async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = data.find(item => item.id === id);

    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: 'Item not found' }); // 404 Not Found
    }
  } catch (error: any) {
    console.error("Error getting item:", error);
    res.status(500).json({ error: 'Failed to retrieve item' });
  }
}));

// Update (PUT)
app.put('/items/:id', errorBoundary(async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const itemIndex = data.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
      data[itemIndex] = { id, ...req.body };
      res.status(200).json(data[itemIndex]);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error: any) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: 'Failed to update item' });
  }
}));

// Delete (DELETE)
app.delete('/items/:id', errorBoundary(async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const itemIndex = data.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
      data.splice(itemIndex, 1);
      res.status(204).send(); // 204 No Content (successful deletion)
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error: any) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
}));

// Use error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});