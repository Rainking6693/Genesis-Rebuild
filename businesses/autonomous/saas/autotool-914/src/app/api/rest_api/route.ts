// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Custom error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// User Management Endpoints
app.post('/users', async (req: Request, res: Response) => {
  try {
    // Simulate user creation (replace with actual database logic)
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }
    const newUser = { id: Math.random().toString(36).substring(7), username, email };
    console.log('Creating user:', newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Error creating user:', error);
    next(error); // Pass error to error handler
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    // Simulate retrieving user (replace with actual database logic)
    const userId = req.params.id;
    const user = { id: userId, username: 'testuser', email: 'test@example.com' }; // Placeholder
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Error getting user:', error);
    next(error); // Pass error to error handler
  }
});

// Subscription Management Endpoints (Example)
app.post('/subscriptions', async (req: Request, res: Response) => {
  try {
    // Simulate subscription creation
    const { userId, plan } = req.body;
    if (!userId || !plan) {
      return res.status(400).json({ error: 'User ID and plan are required' });
    }
    const newSubscription = { id: Math.random().toString(36).substring(7), userId, plan, status: 'active' };
    console.log('Creating subscription:', newSubscription);
    res.status(201).json(newSubscription);
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    next(error);
  }
});

// Data Access Endpoint (Example)
app.get('/data', async (req: Request, res: Response) => {
  try {
    // Simulate data retrieval (replace with actual database logic)
    const data = { message: 'Secure data accessed successfully' };
    res.json(data);
  } catch (error: any) {
    console.error('Error accessing data:', error);
    next(error);
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`REST API listening on port ${port}`);
});

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Custom error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

// User Management Endpoints
app.post('/users', async (req: Request, res: Response) => {
  try {
    // Simulate user creation (replace with actual database logic)
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }
    const newUser = { id: Math.random().toString(36).substring(7), username, email };
    console.log('Creating user:', newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Error creating user:', error);
    next(error); // Pass error to error handler
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    // Simulate retrieving user (replace with actual database logic)
    const userId = req.params.id;
    const user = { id: userId, username: 'testuser', email: 'test@example.com' }; // Placeholder
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Error getting user:', error);
    next(error); // Pass error to error handler
  }
});

// Subscription Management Endpoints (Example)
app.post('/subscriptions', async (req: Request, res: Response) => {
  try {
    // Simulate subscription creation
    const { userId, plan } = req.body;
    if (!userId || !plan) {
      return res.status(400).json({ error: 'User ID and plan are required' });
    }
    const newSubscription = { id: Math.random().toString(36).substring(7), userId, plan, status: 'active' };
    console.log('Creating subscription:', newSubscription);
    res.status(201).json(newSubscription);
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    next(error);
  }
});

// Data Access Endpoint (Example)
app.get('/data', async (req: Request, res: Response) => {
  try {
    // Simulate data retrieval (replace with actual database logic)
    const data = { message: 'Secure data accessed successfully' };
    res.json(data);
  } catch (error: any) {
    console.error('Error accessing data:', error);
    next(error);
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`REST API listening on port ${port}`);
});