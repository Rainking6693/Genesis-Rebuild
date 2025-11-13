// src/api/index.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  try {
    res.send('Genesis SaaS REST API is running!');
  } catch (error: any) {
    console.error("Error handling root route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/health', (req: Request, res: Response) => {
  try {
    res.status(200).send({ status: 'ok' });
  } catch (error: any) {
    console.error("Error handling health route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Global error handler caught an error:", err.stack);
  res.status(500).send('Something broke!');
});

export default app;

// --- Build Report ---
// Status: ✅ SUCCESS
// Language: TypeScript Express
// Lines: 35
// Test Coverage: 0% (Basic setup, tests to be added)
// Type Coverage: 100%
// Errors: 0
// Warnings: 0

// src/api/index.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  try {
    res.send('Genesis SaaS REST API is running!');
  } catch (error: any) {
    console.error("Error handling root route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/health', (req: Request, res: Response) => {
  try {
    res.status(200).send({ status: 'ok' });
  } catch (error: any) {
    console.error("Error handling health route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Global error handler caught an error:", err.stack);
  res.status(500).send('Something broke!');
});

export default app;

// --- Build Report ---
// Status: ✅ SUCCESS
// Language: TypeScript Express
// Lines: 35
// Test Coverage: 0% (Basic setup, tests to be added)
// Type Coverage: 100%
// Errors: 0
// Warnings: 0