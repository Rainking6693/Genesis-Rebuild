// src/api/restApi.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// Example endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const response: ApiResponse<{ status: string }> = {
    status: 'success',
    data: { status: 'ok' },
  };
  res.status(200).json(response);
});

// Example endpoint with error handling
app.post('/api/users', (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      const errorResponse: ApiResponse<null> = {
        status: 'error',
        message: 'Name and email are required',
      };
      return res.status(400).json(errorResponse);
    }

    // Simulate user creation
    const newUser = { id: Math.random().toString(36).substring(2, 15), name, email };

    const successResponse: ApiResponse<typeof newUser> = {
      status: 'success',
      data: newUser,
    };

    res.status(201).json(successResponse);

  } catch (error: any) {
    console.error("Error creating user:", error);
    const errorResponse: ApiResponse<null> = {
      status: 'error',
      message: 'Failed to create user',
    };
    res.status(500).json(errorResponse);
  }
});

// Generic error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  const errorResponse: ApiResponse<null> = {
    status: 'error',
    message: 'Something went wrong',
  };
  res.status(500).json(errorResponse);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// types.ts
export interface User {
    id: string;
    name: string;
    email: string;
}

// utils.ts
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// src/api/restApi.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// Example endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const response: ApiResponse<{ status: string }> = {
    status: 'success',
    data: { status: 'ok' },
  };
  res.status(200).json(response);
});

// Example endpoint with error handling
app.post('/api/users', (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      const errorResponse: ApiResponse<null> = {
        status: 'error',
        message: 'Name and email are required',
      };
      return res.status(400).json(errorResponse);
    }

    // Simulate user creation
    const newUser = { id: Math.random().toString(36).substring(2, 15), name, email };

    const successResponse: ApiResponse<typeof newUser> = {
      status: 'success',
      data: newUser,
    };

    res.status(201).json(successResponse);

  } catch (error: any) {
    console.error("Error creating user:", error);
    const errorResponse: ApiResponse<null> = {
      status: 'error',
      message: 'Failed to create user',
    };
    res.status(500).json(errorResponse);
  }
});

// Generic error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  const errorResponse: ApiResponse<null> = {
    status: 'error',
    message: 'Something went wrong',
  };
  res.status(500).json(errorResponse);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// types.ts
export interface User {
    id: string;
    name: string;
    email: string;
}

// utils.ts
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}