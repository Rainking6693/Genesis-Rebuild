// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Generic error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Example endpoint: GET /items
app.get('/items', (req: Request, res: Response) => {
  try {
    // Simulate fetching items from a database
    const items = [{ id: uuidv4(), name: 'Example Item' }];
    res.json(items);
  } catch (error: any) {
    console.error("Error fetching items:", error);
    next(error); // Pass the error to the error handling middleware
  }
});

// Example endpoint: POST /items
app.post('/items', (req: Request, res: Response) => {
  try {
    const newItem = req.body; // Assuming the request body contains the new item data
    if (!newItem || typeof newItem !== 'object' || !newItem.name) {
      return res.status(400).json({ error: 'Invalid item data.  Name is required.' });
    }

    newItem.id = uuidv4(); // Assign a unique ID
    // Simulate saving the item to a database
    console.log('New item created:', newItem);
    res.status(201).json(newItem); // 201 Created status code
  } catch (error: any) {
    console.error("Error creating item:", error);
    next(error);
  }
});

// Example endpoint: GET /items/:id
app.get('/items/:id', (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;
        // Simulate fetching an item from a database based on ID
        const item = { id: itemId, name: 'Example Item' }; // Replace with actual database lookup
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error: any) {
        console.error("Error fetching item:", error);
        next(error);
    }
});

// Example endpoint: PUT /items/:id
app.put('/items/:id', (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;
        const updatedItem = req.body;
        if (!updatedItem || typeof updatedItem !== 'object' || !updatedItem.name) {
            return res.status(400).json({ error: 'Invalid item data. Name is required.' });
        }
        // Simulate updating the item in a database
        console.log(`Item with ID ${itemId} updated:`, updatedItem);
        res.json({ message: `Item with ID ${itemId} updated successfully` });
    } catch (error: any) {
        console.error("Error updating item:", error);
        next(error);
    }
});

// Example endpoint: DELETE /items/:id
app.delete('/items/:id', (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;
        // Simulate deleting the item from a database
        console.log(`Item with ID ${itemId} deleted`);
        res.json({ message: `Item with ID ${itemId} deleted successfully` });
    } catch (error: any) {
        console.error("Error deleting item:", error);
        next(error);
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Generic error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Example endpoint: GET /items
app.get('/items', (req: Request, res: Response) => {
  try {
    // Simulate fetching items from a database
    const items = [{ id: uuidv4(), name: 'Example Item' }];
    res.json(items);
  } catch (error: any) {
    console.error("Error fetching items:", error);
    next(error); // Pass the error to the error handling middleware
  }
});

// Example endpoint: POST /items
app.post('/items', (req: Request, res: Response) => {
  try {
    const newItem = req.body; // Assuming the request body contains the new item data
    if (!newItem || typeof newItem !== 'object' || !newItem.name) {
      return res.status(400).json({ error: 'Invalid item data.  Name is required.' });
    }

    newItem.id = uuidv4(); // Assign a unique ID
    // Simulate saving the item to a database
    console.log('New item created:', newItem);
    res.status(201).json(newItem); // 201 Created status code
  } catch (error: any) {
    console.error("Error creating item:", error);
    next(error);
  }
});

// Example endpoint: GET /items/:id
app.get('/items/:id', (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;
        // Simulate fetching an item from a database based on ID
        const item = { id: itemId, name: 'Example Item' }; // Replace with actual database lookup
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error: any) {
        console.error("Error fetching item:", error);
        next(error);
    }
});

// Example endpoint: PUT /items/:id
app.put('/items/:id', (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;
        const updatedItem = req.body;
        if (!updatedItem || typeof updatedItem !== 'object' || !updatedItem.name) {
            return res.status(400).json({ error: 'Invalid item data. Name is required.' });
        }
        // Simulate updating the item in a database
        console.log(`Item with ID ${itemId} updated:`, updatedItem);
        res.json({ message: `Item with ID ${itemId} updated successfully` });
    } catch (error: any) {
        console.error("Error updating item:", error);
        next(error);
    }
});

// Example endpoint: DELETE /items/:id
app.delete('/items/:id', (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;
        // Simulate deleting the item from a database
        console.log(`Item with ID ${itemId} deleted`);
        res.json({ message: `Item with ID ${itemId} deleted successfully` });
    } catch (error: any) {
        console.error("Error deleting item:", error);
        next(error);
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});