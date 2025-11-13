// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Define data type (example)
interface Item {
  id: string;
  name: string;
  description: string;
}

// In-memory data store (replace with database later)
const items: Item[] = [];

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET all items
router.get('/items', (req: Request, res: Response) => {
  try {
    res.json(items);
  } catch (error: any) {
    console.error("Error fetching items:", error);
    next(error); // Pass error to error handler
  }
});

// GET a specific item by ID
router.get('/items/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const item = items.find((item) => item.id === id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error: any) {
    console.error("Error fetching item:", error);
    next(error);
  }
});

// POST a new item
router.post('/items', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const newItem: Item = {
      id: uuidv4(),
      name,
      description,
    };

    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error: any) {
    console.error("Error creating item:", error);
    next(error);
  }
});

// PUT (update) an existing item
router.put('/items/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    items[itemIndex] = {
      id,
      name,
      description,
    };

    res.json(items[itemIndex]);
  } catch (error: any) {
    console.error("Error updating item:", error);
    next(error);
  }
});

// DELETE an item
router.delete('/items/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    items.splice(itemIndex, 1);
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting item:", error);
    next(error);
  }
});

router.use(errorHandler);

export default router;

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Define data type (example)
interface Item {
  id: string;
  name: string;
  description: string;
}

// In-memory data store (replace with database later)
const items: Item[] = [];

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET all items
router.get('/items', (req: Request, res: Response) => {
  try {
    res.json(items);
  } catch (error: any) {
    console.error("Error fetching items:", error);
    next(error); // Pass error to error handler
  }
});

// GET a specific item by ID
router.get('/items/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const item = items.find((item) => item.id === id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error: any) {
    console.error("Error fetching item:", error);
    next(error);
  }
});

// POST a new item
router.post('/items', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const newItem: Item = {
      id: uuidv4(),
      name,
      description,
    };

    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error: any) {
    console.error("Error creating item:", error);
    next(error);
  }
});

// PUT (update) an existing item
router.put('/items/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    items[itemIndex] = {
      id,
      name,
      description,
    };

    res.json(items[itemIndex]);
  } catch (error: any) {
    console.error("Error updating item:", error);
    next(error);
  }
});

// DELETE an item
router.delete('/items/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    items.splice(itemIndex, 1);
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting item:", error);
    next(error);
  }
});

router.use(errorHandler);

export default router;