// src/api/items.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface Item {
  id: string;
  name: string;
  description: string;
}

let items: Item[] = [];

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET all items
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET a specific item by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const item = items.find(item => item.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST a new item
router.post('/', (req: Request, res: Response, next: NextFunction) => {
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
  } catch (err) {
    next(err);
  }
});

// PUT (update) an existing item
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    items[itemIndex] = { ...items[itemIndex], name, description };
    res.json(items[itemIndex]);
  } catch (err) {
    next(err);
  }
});

// DELETE an item
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    items = items.filter(item => item.id !== id);
    res.status(204).send(); // No content
  } catch (err) {
    next(err);
  }
});

router.use(errorHandler);

export default router;

// src/api/items.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface Item {
  id: string;
  name: string;
  description: string;
}

let items: Item[] = [];

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// GET all items
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET a specific item by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const item = items.find(item => item.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST a new item
router.post('/', (req: Request, res: Response, next: NextFunction) => {
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
  } catch (err) {
    next(err);
  }
});

// PUT (update) an existing item
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    items[itemIndex] = { ...items[itemIndex], name, description };
    res.json(items[itemIndex]);
  } catch (err) {
    next(err);
  }
});

// DELETE an item
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    items = items.filter(item => item.id !== id);
    res.status(204).send(); // No content
  } catch (err) {
    next(err);
  }
});

router.use(errorHandler);

export default router;