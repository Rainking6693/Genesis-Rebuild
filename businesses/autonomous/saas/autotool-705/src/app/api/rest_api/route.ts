// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// Custom error class
class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// User Management Endpoints (Placeholder)
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate user creation
    const newUser = { id: Math.random().toString(36).substring(7), ...req.body };
    console.log("Creating user:", newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    next(error); // Pass error to error handler
  }
});

app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    // Simulate user retrieval
    if (userId === '123') {
      res.json({ id: userId, name: 'Example User' });
    } else {
      throw new ApiError(404, `User with ID ${userId} not found`);
    }
  } catch (error: any) {
    next(error);
  }
});

app.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        // Simulate user update
        console.log(`Updating user with ID: ${userId}`);
        res.json({ id: userId, message: `User with ID ${userId} updated successfully` });
    } catch (error: any) {
        next(error);
    }
});

app.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        // Simulate user deletion
        console.log(`Deleting user with ID: ${userId}`);
        res.status(204).send(); // No content on successful deletion
    } catch (error: any) {
        next(error);
    }
});

// Data Retrieval Endpoint (Placeholder)
app.get('/data', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate data retrieval
    const data = [{ id: 1, value: 'Example Data' }, { id: 2, value: 'Another Example' }];
    res.json(data);
  } catch (error: any) {
    next(error);
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// Custom error class
class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// User Management Endpoints (Placeholder)
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate user creation
    const newUser = { id: Math.random().toString(36).substring(7), ...req.body };
    console.log("Creating user:", newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    next(error); // Pass error to error handler
  }
});

app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    // Simulate user retrieval
    if (userId === '123') {
      res.json({ id: userId, name: 'Example User' });
    } else {
      throw new ApiError(404, `User with ID ${userId} not found`);
    }
  } catch (error: any) {
    next(error);
  }
});

app.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        // Simulate user update
        console.log(`Updating user with ID: ${userId}`);
        res.json({ id: userId, message: `User with ID ${userId} updated successfully` });
    } catch (error: any) {
        next(error);
    }
});

app.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        // Simulate user deletion
        console.log(`Deleting user with ID: ${userId}`);
        res.status(204).send(); // No content on successful deletion
    } catch (error: any) {
        next(error);
    }
});

// Data Retrieval Endpoint (Placeholder)
app.get('/data', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate data retrieval
    const data = [{ id: 1, value: 'Example Data' }, { id: 2, value: 'Another Example' }];
    res.json(data);
  } catch (error: any) {
    next(error);
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});