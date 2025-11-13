// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory data store (replace with a database)
const data: { [key: string]: any } = {};

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Middleware for validating UUIDs
const validateUuid = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  if (!validate(id)) {
    return res.status(400).json({ error: 'Invalid UUID' });
  }
  next();
};

// Type definition for the resource
interface Resource {
  id: string;
  name: string;
  description: string;
}

// API Endpoints

// Create
app.post('/resources', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const id = uuidv4();
    const newResource: Resource = { id, name, description };
    data[id] = newResource;

    res.status(201).json(newResource);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// Read (all)
app.get('/resources', (req: Request, res: Response) => {
  try {
    const resources = Object.values(data);
    res.json(resources);
  } catch (error: any) {
    console.error("Error getting all resources:", error);
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// Read (one)
app.get('/resources/:id', validateUuid, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const resource = data[id];

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error: any) {
    console.error("Error getting resource:", error);
    res.status(500).json({ error: 'Failed to get resource' });
  }
});

// Update
app.put('/resources/:id', validateUuid, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const updatedResource: Resource = { id, name, description };
    data[id] = updatedResource;

    res.json(updatedResource);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete
app.delete('/resources/:id', validateUuid, (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    delete data[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory data store (replace with a database)
const data: { [key: string]: any } = {};

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Middleware for validating UUIDs
const validateUuid = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  if (!validate(id)) {
    return res.status(400).json({ error: 'Invalid UUID' });
  }
  next();
};

// Type definition for the resource
interface Resource {
  id: string;
  name: string;
  description: string;
}

// API Endpoints

// Create
app.post('/resources', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const id = uuidv4();
    const newResource: Resource = { id, name, description };
    data[id] = newResource;

    res.status(201).json(newResource);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// Read (all)
app.get('/resources', (req: Request, res: Response) => {
  try {
    const resources = Object.values(data);
    res.json(resources);
  } catch (error: any) {
    console.error("Error getting all resources:", error);
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// Read (one)
app.get('/resources/:id', validateUuid, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const resource = data[id];

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error: any) {
    console.error("Error getting resource:", error);
    res.status(500).json({ error: 'Failed to get resource' });
  }
});

// Update
app.put('/resources/:id', validateUuid, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const updatedResource: Resource = { id, name, description };
    data[id] = updatedResource;

    res.json(updatedResource);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete
app.delete('/resources/:id', validateUuid, (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!data[id]) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    delete data[id];
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});