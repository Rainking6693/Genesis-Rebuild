// src/api/resource.ts
import express, { Request, Response } from 'express';

const router = express.Router();

// In-memory data store (replace with a database in a real application)
let resources: any[] = [];
let nextId = 1;

// GET all resources
router.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json(resources);
  } catch (error: any) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

// GET a specific resource by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const resource = resources.find(r => r.id === id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.status(200).json(resource);
  } catch (error: any) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ error: "Failed to fetch resource" });
  }
});

// POST a new resource
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    const newResource = {
      id: nextId++,
      name,
      description
    };

    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

// PUT (update) an existing resource
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    const resourceIndex = resources.findIndex(r => r.id === id);

    if (resourceIndex === -1) {
      return res.status(404).json({ error: "Resource not found" });
    }

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    resources[resourceIndex] = {
      id,
      name,
      description
    };

    res.status(200).json(resources[resourceIndex]);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Failed to update resource" });
  }
});

// DELETE a resource
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    resources = resources.filter(r => r.id !== id);
    res.status(204).send(); // No content on successful deletion
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

export default router;

// server.ts (Example usage - minimal Express setup)
import express from 'express';
import resourceRoutes from './api/resource';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use('/resources', resourceRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// src/api/resource.ts
import express, { Request, Response } from 'express';

const router = express.Router();

// In-memory data store (replace with a database in a real application)
let resources: any[] = [];
let nextId = 1;

// GET all resources
router.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json(resources);
  } catch (error: any) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

// GET a specific resource by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const resource = resources.find(r => r.id === id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.status(200).json(resource);
  } catch (error: any) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ error: "Failed to fetch resource" });
  }
});

// POST a new resource
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    const newResource = {
      id: nextId++,
      name,
      description
    };

    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

// PUT (update) an existing resource
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    const resourceIndex = resources.findIndex(r => r.id === id);

    if (resourceIndex === -1) {
      return res.status(404).json({ error: "Resource not found" });
    }

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    resources[resourceIndex] = {
      id,
      name,
      description
    };

    res.status(200).json(resources[resourceIndex]);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Failed to update resource" });
  }
});

// DELETE a resource
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    resources = resources.filter(r => r.id !== id);
    res.status(204).send(); // No content on successful deletion
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

export default router;

// server.ts (Example usage - minimal Express setup)
import express from 'express';
import resourceRoutes from './api/resource';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use('/resources', resourceRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});