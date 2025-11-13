// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Middleware to handle errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Create resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate resource creation (replace with actual database logic)
    const newResource = { id: Math.random().toString(36).substring(2, 15), ...req.body };
    res.status(201).json(newResource);
  } catch (error) {
    next(error);
  }
});

// Read resource
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Simulate resource retrieval (replace with actual database logic)
    const resource = { id, name: `Resource ${id}` };
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Update resource
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Simulate resource update (replace with actual database logic)
    const updatedResource = { id, ...req.body };
    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// Delete resource
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Simulate resource deletion (replace with actual database logic)
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use error handler middleware

export default router;

// index.ts (entry point)
import express from 'express';
import resourceRoutes from './api/resource';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/resources', resourceRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Middleware to handle errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Create resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate resource creation (replace with actual database logic)
    const newResource = { id: Math.random().toString(36).substring(2, 15), ...req.body };
    res.status(201).json(newResource);
  } catch (error) {
    next(error);
  }
});

// Read resource
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Simulate resource retrieval (replace with actual database logic)
    const resource = { id, name: `Resource ${id}` };
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Update resource
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Simulate resource update (replace with actual database logic)
    const updatedResource = { id, ...req.body };
    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// Delete resource
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Simulate resource deletion (replace with actual database logic)
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Use error handler middleware

export default router;

// index.ts (entry point)
import express from 'express';
import resourceRoutes from './api/resource';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/resources', resourceRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

Now, let's format the output according to the schema: