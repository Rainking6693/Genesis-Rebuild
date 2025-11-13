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

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Global error handler caught an error:", err.stack);
  res.status(500).send('Something broke!');
});

// Catch-all route for undefined endpoints
app.use((req: Request, res: Response) => {
  res.status(404).send("Resource not found");
});

export default app;

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

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Global error handler caught an error:", err.stack);
  res.status(500).send('Something broke!');
});

// Catch-all route for undefined endpoints
app.use((req: Request, res: Response) => {
  res.status(404).send("Resource not found");
});

export default app;