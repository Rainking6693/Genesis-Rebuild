// src/api/index.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  try {
    res.send('Genesis SaaS API is running');
  } catch (error: any) {
    console.error('Error handling root route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/health', (req: Request, res: Response) => {
  try {
    res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Health check failed:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Example route (replace with actual SaaS API endpoints)
app.get('/api/v1/users', (req: Request, res: Response) => {
  try {
    // Simulate fetching users from a database
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Example route with error handling
app.post('/api/v1/users', (req: Request, res: Response) => {
  try {
    // Simulate creating a new user
    const newUser = { id: 3, name: 'New User' };
    // Simulate a database error
    if (Math.random() < 0.2) {
      throw new Error('Database connection error');
    }
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

export {};

// src/api/index.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  try {
    res.send('Genesis SaaS API is running');
  } catch (error: any) {
    console.error('Error handling root route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/health', (req: Request, res: Response) => {
  try {
    res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Health check failed:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Example route (replace with actual SaaS API endpoints)
app.get('/api/v1/users', (req: Request, res: Response) => {
  try {
    // Simulate fetching users from a database
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Example route with error handling
app.post('/api/v1/users', (req: Request, res: Response) => {
  try {
    // Simulate creating a new user
    const newUser = { id: 3, name: 'New User' };
    // Simulate a database error
    if (Math.random() < 0.2) {
      throw new Error('Database connection error');
    }
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

export {};