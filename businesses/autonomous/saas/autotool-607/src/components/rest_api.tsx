// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.use(express.json());

// Placeholder for database interaction
const users: any[] = [];
const resources: any[] = [];

// Custom Error Classes
class APIError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.name = "APIError";
  }
}

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User Endpoints
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new APIError(400, "Name and email are required");
    }
    const newUser = { id: uuidv4(), name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new APIError(404, "User not found");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new APIError(404, "User not found");
    }
    users[userIndex] = { ...users[userIndex], name, email };
    res.json(users[userIndex]);
  } catch (error) {
    next(error);
  }
});

app.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new APIError(404, "User not found");
    }
    users.splice(userIndex, 1);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Resource Endpoints (Example)
app.post('/resources', (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      if (!name || !description) {
        throw new APIError(400, "Name and description are required");
      }
      const newResource = { id: uuidv4(), name, description };
      resources.push(newResource);
      res.status(201).json(newResource);
    } catch (error) {
      next(error);
    }
  });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Export the app for testing purposes
export default app;