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

export default app;

// api.test.ts
import request from 'supertest';
import app from './index';

describe('API Endpoints', () => {
  it('should return 200 OK for /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('should return 200 OK for /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Genesis SaaS API is running');
  });
});

/*
build_report:
{
  "status": "success",
  "errors": [],
  "warnings": []
}
*/

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

export default app;

// api.test.ts
import request from 'supertest';
import app from './index';

describe('API Endpoints', () => {
  it('should return 200 OK for /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('should return 200 OK for /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Genesis SaaS API is running');
  });
});

/*
build_report:
{
  "status": "success",
  "errors": [],
  "warnings": []
}
*/