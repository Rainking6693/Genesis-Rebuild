// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom Error Class
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError"; // Add the name property
    Object.setPrototypeOf(this, APIError.prototype); // Restore prototype chain
  }
}

// Generic Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace
  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User Management Endpoints
app.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body (example)
    if (!req.body.email || !req.body.password) {
      throw new APIError('Missing email or password', 400);
    }

    // Simulate user creation
    const newUser = { id: Math.random().toString(36).substring(7), email: req.body.email };

    res.status(201).json(newUser);
  } catch (error: any) {
    next(error); // Pass error to error handling middleware
  }
});

app.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    // Simulate user retrieval
    const user = { id: userId, email: `user${userId}@example.com` };

    if (!user) {
      throw new APIError('User not found', 404);
    }

    res.json(user);
  } catch (error: any) {
    next(error);
  }
});

// Data Retrieval Endpoint (Example)
app.get('/data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate data retrieval
    const data = [{ id: 1, value: 'Example Data 1' }, { id: 2, value: 'Example Data 2' }];
    res.json(data);
  } catch (error: any) {
    next(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom Error Class
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError"; // Add the name property
    Object.setPrototypeOf(this, APIError.prototype); // Restore prototype chain
  }
}

// Generic Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace
  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User Management Endpoints
app.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body (example)
    if (!req.body.email || !req.body.password) {
      throw new APIError('Missing email or password', 400);
    }

    // Simulate user creation
    const newUser = { id: Math.random().toString(36).substring(7), email: req.body.email };

    res.status(201).json(newUser);
  } catch (error: any) {
    next(error); // Pass error to error handling middleware
  }
});

app.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    // Simulate user retrieval
    const user = { id: userId, email: `user${userId}@example.com` };

    if (!user) {
      throw new APIError('User not found', 404);
    }

    res.json(user);
  } catch (error: any) {
    next(error);
  }
});

// Data Retrieval Endpoint (Example)
app.get('/data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate data retrieval
    const data = [{ id: 1, value: 'Example Data 1' }, { id: 2, value: 'Example Data 2' }];
    res.json(data);
  } catch (error: any) {
    next(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;