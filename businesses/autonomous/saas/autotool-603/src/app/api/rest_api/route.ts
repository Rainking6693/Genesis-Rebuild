// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom Error Classes
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
    Object.setPrototypeOf(this, APIError.prototype); // Required for extending Error in TypeScript
  }
}

// Mock Database (Replace with actual database connection)
const users: { [id: string]: any } = {};
const resources: { [id: string]: any } = {};

// --- User Management Endpoints ---

// Create User
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      throw new APIError("Username and email are required", 400);
    }

    const userId = uuidv4();
    users[userId] = { id: userId, username, email };

    res.status(201).json({ id: userId, message: "User created successfully" });

  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

// Get User by ID
app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = users[userId];

    if (!user) {
      throw new APIError("User not found", 404);
    }

    res.json(user);

  } catch (error) {
    next(error);
  }
});

// --- Resource Management Endpoints ---

// Create Resource
app.post('/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, ownerId } = req.body;

    if (!name || !description || !ownerId) {
      throw new APIError("Name, description, and ownerId are required", 400);
    }

    if (!users[ownerId]) {
      throw new APIError("Owner not found", 400);
    }

    const resourceId = uuidv4();
    resources[resourceId] = { id: resourceId, name, description, ownerId };

    res.status(201).json({ id: resourceId, message: "Resource created successfully" });

  } catch (error) {
    next(error);
  }
});

// Get Resource by ID
app.get('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const resourceId = req.params.id;
    const resource = resources[resourceId];

    if (!resource) {
      throw new APIError("Resource not found", 404);
    }

    res.json(resource);

  } catch (error) {
    next(error);
  }
});

// --- Error Handling Middleware ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Example Usage:
// POST /users { "username": "testuser", "email": "test@example.com" }
// GET /users/{userId}
// POST /resources { "name": "My Resource", "description": "A test resource", "ownerId": "{userId}" }
// GET /resources/{resourceId}

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom Error Classes
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
    Object.setPrototypeOf(this, APIError.prototype); // Required for extending Error in TypeScript
  }
}

// Mock Database (Replace with actual database connection)
const users: { [id: string]: any } = {};
const resources: { [id: string]: any } = {};

// --- User Management Endpoints ---

// Create User
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      throw new APIError("Username and email are required", 400);
    }

    const userId = uuidv4();
    users[userId] = { id: userId, username, email };

    res.status(201).json({ id: userId, message: "User created successfully" });

  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

// Get User by ID
app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = users[userId];

    if (!user) {
      throw new APIError("User not found", 404);
    }

    res.json(user);

  } catch (error) {
    next(error);
  }
});

// --- Resource Management Endpoints ---

// Create Resource
app.post('/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, ownerId } = req.body;

    if (!name || !description || !ownerId) {
      throw new APIError("Name, description, and ownerId are required", 400);
    }

    if (!users[ownerId]) {
      throw new APIError("Owner not found", 400);
    }

    const resourceId = uuidv4();
    resources[resourceId] = { id: resourceId, name, description, ownerId };

    res.status(201).json({ id: resourceId, message: "Resource created successfully" });

  } catch (error) {
    next(error);
  }
});

// Get Resource by ID
app.get('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const resourceId = req.params.id;
    const resource = resources[resourceId];

    if (!resource) {
      throw new APIError("Resource not found", 404);
    }

    res.json(resource);

  } catch (error) {
    next(error);
  }
});

// --- Error Handling Middleware ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Example Usage:
// POST /users { "username": "testuser", "email": "test@example.com" }
// GET /users/{userId}
// POST /resources { "name": "My Resource", "description": "A test resource", "ownerId": "{userId}" }
// GET /resources/{resourceId}