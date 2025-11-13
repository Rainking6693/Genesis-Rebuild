// src/api/index.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  try {
    res.send('Genesis SaaS REST API is running');
  } catch (error: any) {
    console.error('Error handling root route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/health', (req: Request, res: Response) => {
  try {
    res.status(200).send({ status: 'ok' });
  } catch (error: any) {
    console.error('Error handling health check:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Catch-all route for unhandled requests
app.use((req: Request, res: Response) => {
  res.status(404).send("Sorry can't find that!");
});

export {};

// api.test.ts
import request from 'supertest';
import express from 'express';

const app = express();

app.get('/test', (req, res) => {
  res.status(200).send({ message: 'Test endpoint' });
});

describe('API Endpoints', () => {
  it('should return 200 OK for /test endpoint', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Test endpoint' });
  });

  it('should handle errors gracefully', async () => {
    const appWithError = express();
    appWithError.get('/error', (req, res) => {
      throw new Error('Simulated error');
    });

    appWithError.use((err: any, req: any, res: any, next: any) => {
      console.error(err.stack);
      res.status(500).send('Internal Server Error');
    });

    const res = await request(appWithError).get('/error');
    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual('Internal Server Error');
  });
});

// src/api/index.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  try {
    res.send('Genesis SaaS REST API is running');
  } catch (error: any) {
    console.error('Error handling root route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/health', (req: Request, res: Response) => {
  try {
    res.status(200).send({ status: 'ok' });
  } catch (error: any) {
    console.error('Error handling health check:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Catch-all route for unhandled requests
app.use((req: Request, res: Response) => {
  res.status(404).send("Sorry can't find that!");
});

export {};

// api.test.ts
import request from 'supertest';
import express from 'express';

const app = express();

app.get('/test', (req, res) => {
  res.status(200).send({ message: 'Test endpoint' });
});

describe('API Endpoints', () => {
  it('should return 200 OK for /test endpoint', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Test endpoint' });
  });

  it('should handle errors gracefully', async () => {
    const appWithError = express();
    appWithError.get('/error', (req, res) => {
      throw new Error('Simulated error');
    });

    appWithError.use((err: any, req: any, res: any, next: any) => {
      console.error(err.stack);
      res.status(500).send('Internal Server Error');
    });

    const res = await request(appWithError).get('/error');
    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual('Internal Server Error');
  });
});