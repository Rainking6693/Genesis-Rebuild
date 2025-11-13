// src/api/rest_api.ts

import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

// Middleware to handle errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// User Management Routes
app.post('/users', async (req: Request, res: Response) => {
  try {
    // Simulate user creation (replace with actual database logic)
    const newUser = { id: Math.random().toString(36).substring(7), ...req.body };
    console.log('Creating user:', newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    // Simulate user retrieval (replace with actual database logic)
    const user = { id: userId, name: 'Example User' };
    console.log('Retrieving user:', user);
    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Authentication Routes
app.post('/login', async (req: Request, res: Response) => {
  try {
    // Simulate login (replace with actual authentication logic)
    const { username, password } = req.body;
    if (username === 'test' && password === 'password') {
      const token = 'fake_jwt_token';
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error: any) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message });
  }
});

// Data Retrieval Routes
app.get('/data', async (req: Request, res: Response) => {
  try {
    // Simulate data retrieval (replace with actual database logic)
    const data = [{ id: 1, value: 'Example Data' }];
    console.log('Retrieving data:', data);
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Apply error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`REST API listening at http://localhost:${port}`);
});

// src/api/rest_api.ts

import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

// Middleware to handle errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// User Management Routes
app.post('/users', async (req: Request, res: Response) => {
  try {
    // Simulate user creation (replace with actual database logic)
    const newUser = { id: Math.random().toString(36).substring(7), ...req.body };
    console.log('Creating user:', newUser);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    // Simulate user retrieval (replace with actual database logic)
    const user = { id: userId, name: 'Example User' };
    console.log('Retrieving user:', user);
    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Authentication Routes
app.post('/login', async (req: Request, res: Response) => {
  try {
    // Simulate login (replace with actual authentication logic)
    const { username, password } = req.body;
    if (username === 'test' && password === 'password') {
      const token = 'fake_jwt_token';
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error: any) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message });
  }
});

// Data Retrieval Routes
app.get('/data', async (req: Request, res: Response) => {
  try {
    // Simulate data retrieval (replace with actual database logic)
    const data = [{ id: 1, value: 'Example Data' }];
    console.log('Retrieving data:', data);
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Apply error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`REST API listening at http://localhost:${port}`);
});