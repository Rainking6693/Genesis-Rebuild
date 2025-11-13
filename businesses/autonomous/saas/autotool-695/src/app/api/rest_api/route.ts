// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.use(express.json());

// Simulated database (replace with actual database integration)
const users: any[] = [];
const resources: any[] = [];

// Define interfaces for type safety
interface User {
  id: string;
  name: string;
  email: string;
}

interface Resource {
  id: string;
  name: string;
  description: string;
  ownerId: string;
}

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// User management endpoints
app.post('/users', (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
    };

    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    next(error);
  }
});

app.get('/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    next(error);
  }
});

// Resource management endpoints
app.post('/resources', (req: Request, res: Response) => {
  try {
    const { name, description, ownerId } = req.body;

    if (!name || !description || !ownerId) {
      return res.status(400).json({ error: 'Name, description, and ownerId are required' });
    }

    const newResource: Resource = {
      id: uuidv4(),
      name,
      description,
      ownerId,
    };

    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (error: any) {
    next(error);
  }
});

app.get('/resources/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = resources.find((r) => r.id === id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error: any) {
    next(error);
  }
});

// Use error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`REST API listening at http://localhost:${port}`);
});

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.use(express.json());

// Simulated database (replace with actual database integration)
const users: any[] = [];
const resources: any[] = [];

// Define interfaces for type safety
interface User {
  id: string;
  name: string;
  email: string;
}

interface Resource {
  id: string;
  name: string;
  description: string;
  ownerId: string;
}

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// User management endpoints
app.post('/users', (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
    };

    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    next(error);
  }
});

app.get('/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    next(error);
  }
});

// Resource management endpoints
app.post('/resources', (req: Request, res: Response) => {
  try {
    const { name, description, ownerId } = req.body;

    if (!name || !description || !ownerId) {
      return res.status(400).json({ error: 'Name, description, and ownerId are required' });
    }

    const newResource: Resource = {
      id: uuidv4(),
      name,
      description,
      ownerId,
    };

    resources.push(newResource);
    res.status(201).json(newResource);
  } catch (error: any) {
    next(error);
  }
});

app.get('/resources/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = resources.find((r) => r.id === id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error: any) {
    next(error);
  }
});

// Use error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`REST API listening at http://localhost:${port}`);
});

Now, I will use the `Write` tool to save the code to `src/api/rest_api.ts` and the build report to `build_report.json`.