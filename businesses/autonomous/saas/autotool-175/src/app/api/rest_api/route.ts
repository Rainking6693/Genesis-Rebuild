// src/api/index.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  try {
    res.send('Genesis SaaS API is running!');
  } catch (error: any) {
    console.error("Error handling root route:", error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/health', (req: Request, res: Response) => {
  try {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
  } catch (error: any) {
    console.error("Error handling health route:", error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Optionally, perform cleanup actions before exiting
  process.exit(1); // Exit the process with an error code
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally, perform cleanup actions before exiting
  process.exit(1); // Exit the process with an error code
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
    console.error("Error fetching users:", error);
    res.status(500).send('Internal Server Error');
  }
});

// Middleware for handling 404 errors
app.use((req: Request, res: Response, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Shutting down gracefully...');
  // Perform cleanup tasks (e.g., closing database connections)
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal. Shutting down gracefully...');
  // Perform cleanup tasks (e.g., closing database connections)
  process.exit(0);
});

// src/api/index.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  try {
    res.send('Genesis SaaS API is running!');
  } catch (error: any) {
    console.error("Error handling root route:", error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/health', (req: Request, res: Response) => {
  try {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
  } catch (error: any) {
    console.error("Error handling health route:", error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Optionally, perform cleanup actions before exiting
  process.exit(1); // Exit the process with an error code
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally, perform cleanup actions before exiting
  process.exit(1); // Exit the process with an error code
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
    console.error("Error fetching users:", error);
    res.status(500).send('Internal Server Error');
  }
});

// Middleware for handling 404 errors
app.use((req: Request, res: Response, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Shutting down gracefully...');
  // Perform cleanup tasks (e.g., closing database connections)
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal. Shutting down gracefully...');
  // Perform cleanup tasks (e.g., closing database connections)
  process.exit(0);
});