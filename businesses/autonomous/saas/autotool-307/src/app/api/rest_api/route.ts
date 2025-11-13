// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).send({ error: 'Something went wrong!' });
});

// Mock Database (Replace with a real database in production)
const users: { [id: string]: any } = {};
const resources: { [id: string]: any } = {};

// -----------------------------------------------------------------------------
// User Authentication Endpoints
// -----------------------------------------------------------------------------

/**
 * @route POST /auth/register
 * @desc Registers a new user
 * @access Public
 */
app.post('/auth/register', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userId = uuidv4();
    users[userId] = { id: userId, username, email, password }; // Store password securely in production!

    res.status(201).json({ message: 'User registered successfully', userId });

  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

/**
 * @route POST /auth/login
 * @desc Logs in an existing user
 * @access Public
 */
app.post('/auth/login', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a real application, you'd query the database to find the user and verify the password.
    const user = Object.values(users).find(u => u.username === username && u.password === password); // Insecure!

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In a real application, you'd generate a JWT token here.
    const token = 'mock_token';

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// Resource Management Endpoints (Example)
// -----------------------------------------------------------------------------

/**
 * @route POST /resources
 * @desc Creates a new resource
 * @access Private (Requires Authentication)
 */
app.post('/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const resourceId = uuidv4();
    resources[resourceId] = { id: resourceId, name, description };

    res.status(201).json({ message: 'Resource created successfully', resourceId });

  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /resources/:id
 * @desc Gets a resource by ID
 * @access Private (Requires Authentication)
 */
app.get('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const resourceId = req.params.id;

    if (!resources[resourceId]) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(200).json(resources[resourceId]);

  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// Billing Endpoints (Placeholder)
// -----------------------------------------------------------------------------

/**
 * @route POST /billing/subscribe
 * @desc Subscribes a user to a plan
 * @access Private (Requires Authentication)
 */
app.post('/billing/subscribe', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder implementation
    res.status(200).json({ message: 'Subscription successful' });
  } catch (error) {
    next(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).send({ error: 'Something went wrong!' });
});

// Mock Database (Replace with a real database in production)
const users: { [id: string]: any } = {};
const resources: { [id: string]: any } = {};

// -----------------------------------------------------------------------------
// User Authentication Endpoints
// -----------------------------------------------------------------------------

/**
 * @route POST /auth/register
 * @desc Registers a new user
 * @access Public
 */
app.post('/auth/register', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userId = uuidv4();
    users[userId] = { id: userId, username, email, password }; // Store password securely in production!

    res.status(201).json({ message: 'User registered successfully', userId });

  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

/**
 * @route POST /auth/login
 * @desc Logs in an existing user
 * @access Public
 */
app.post('/auth/login', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a real application, you'd query the database to find the user and verify the password.
    const user = Object.values(users).find(u => u.username === username && u.password === password); // Insecure!

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In a real application, you'd generate a JWT token here.
    const token = 'mock_token';

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// Resource Management Endpoints (Example)
// -----------------------------------------------------------------------------

/**
 * @route POST /resources
 * @desc Creates a new resource
 * @access Private (Requires Authentication)
 */
app.post('/resources', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const resourceId = uuidv4();
    resources[resourceId] = { id: resourceId, name, description };

    res.status(201).json({ message: 'Resource created successfully', resourceId });

  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /resources/:id
 * @desc Gets a resource by ID
 * @access Private (Requires Authentication)
 */
app.get('/resources/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const resourceId = req.params.id;

    if (!resources[resourceId]) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(200).json(resources[resourceId]);

  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// Billing Endpoints (Placeholder)
// -----------------------------------------------------------------------------

/**
 * @route POST /billing/subscribe
 * @desc Subscribes a user to a plan
 * @access Private (Requires Authentication)
 */
app.post('/billing/subscribe', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder implementation
    res.status(200).json({ message: 'Subscription successful' });
  } catch (error) {
    next(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});