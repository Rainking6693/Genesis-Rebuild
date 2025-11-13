// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Add name property for better identification
  }
}

// Middleware for handling errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Generic server error
  return res.status(500).json({ error: 'Internal Server Error' });
};

// User Authentication Routes
app.post('/api/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error: ' + errors.array().map(e => e.msg).join(', '));
    }

    // Placeholder for user registration logic
    const { email, password } = req.body;
    console.log(`Registering user: ${email}`);
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error: any) {
    next(error);
  }
});

app.post('/api/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder for user login logic
    const { email, password } = req.body;
    console.log(`Logging in user: ${email}`);
    res.json({ message: 'User logged in successfully', token: 'dummy_token' });
  } catch (error) {
    next(error);
  }
});

// Resource Management Routes (Example: Products)
app.get('/api/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder for fetching products
    const products = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.post('/api/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder for creating a product
    const { name } = req.body;
    console.log(`Creating product: ${name}`);
    res.status(201).json({ message: 'Product created successfully', id: 3 });
  } catch (error) {
    next(error);
  }
});

// Billing Routes (Placeholder)
app.post('/api/subscribe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder for subscription logic
    res.json({ message: 'Subscribed successfully' });
  } catch (error) {
    next(error);
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Add name property for better identification
  }
}

// Middleware for handling errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Generic server error
  return res.status(500).json({ error: 'Internal Server Error' });
};

// User Authentication Routes
app.post('/api/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error: ' + errors.array().map(e => e.msg).join(', '));
    }

    // Placeholder for user registration logic
    const { email, password } = req.body;
    console.log(`Registering user: ${email}`);
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error: any) {
    next(error);
  }
});

app.post('/api/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder for user login logic
    const { email, password } = req.body;
    console.log(`Logging in user: ${email}`);
    res.json({ message: 'User logged in successfully', token: 'dummy_token' });
  } catch (error) {
    next(error);
  }
});

// Resource Management Routes (Example: Products)
app.get('/api/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder for fetching products
    const products = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.post('/api/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder for creating a product
    const { name } = req.body;
    console.log(`Creating product: ${name}`);
    res.status(201).json({ message: 'Product created successfully', id: 3 });
  } catch (error) {
    next(error);
  }
});

// Billing Routes (Placeholder)
app.post('/api/subscribe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder for subscription logic
    res.json({ message: 'Subscribed successfully' });
  } catch (error) {
    next(error);
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});