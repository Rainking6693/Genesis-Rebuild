// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan'; // HTTP request logger
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev')); // Log HTTP requests

// Generate a unique request ID for each request
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = uuidv4();
  next();
});

// Custom error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`Request ID: ${req.id} - Error:`, err); // Log the error with the request ID
    res.status(500).json({
        requestId: req.id,
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong'
    });
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('SaaS REST API is running!');
});

// User management routes (example)
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate user creation
    const newUser = { id: uuidv4(), ...req.body };
    console.log(`Request ID: ${req.id} - Created user:`, newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        // Simulate fetching user
        if (userId === '123') {
            res.json({ id: userId, name: 'Example User' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error: any) {
        next(error);
    }
});

// Billing routes (example)
app.post('/billing/subscribe', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate subscription process
    console.log(`Request ID: ${req.id} - Subscription request:`, req.body);
    res.json({ success: true, message: 'Subscription successful' });
  } catch (error: any) {
    next(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan'; // HTTP request logger
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev')); // Log HTTP requests

// Generate a unique request ID for each request
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = uuidv4();
  next();
});

// Custom error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`Request ID: ${req.id} - Error:`, err); // Log the error with the request ID
    res.status(500).json({
        requestId: req.id,
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong'
    });
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('SaaS REST API is running!');
});

// User management routes (example)
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate user creation
    const newUser = { id: uuidv4(), ...req.body };
    console.log(`Request ID: ${req.id} - Created user:`, newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        // Simulate fetching user
        if (userId === '123') {
            res.json({ id: userId, name: 'Example User' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error: any) {
        next(error);
    }
});

// Billing routes (example)
app.post('/billing/subscribe', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate subscription process
    console.log(`Request ID: ${req.id} - Subscription request:`, req.body);
    res.json({ success: true, message: 'Subscription successful' });
  } catch (error: any) {
    next(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});