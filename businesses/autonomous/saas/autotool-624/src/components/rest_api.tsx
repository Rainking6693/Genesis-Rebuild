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

// Example POST endpoint with error handling
interface RequestBody {
  name: string;
}

app.post('/api/data', (req: Request, res: Response) => {
  try {
    const { name }: RequestBody = req.body;

    if (!name) {
      const errorResponse: ApiResponse<null> = {
        status: 'error',
        message: 'Name is required in the request body.',
      };
      return res.status(400).json(errorResponse);
    }

    const responseData = {
      message: `Hello, ${name}!`,
    };

    const successResponse: ApiResponse<typeof responseData> = {
      status: 'success',
      data: responseData,
    };

    res.status(201).json(successResponse);
  } catch (error: any) {
    console.error('Error processing request:', error);
    const errorResponse: ApiResponse<null> = {
      status: 'error',
      message: 'Internal server error.',
    };
    res.status(500).json(errorResponse);
  }
});

// Generic error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  const errorResponse: ApiResponse<null> = {
    status: 'error',
    message: 'Internal server error.',
  };
  res.status(500).json(errorResponse);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Export the Express app for testing or other modules
export default app;

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

// Example POST endpoint with error handling
interface RequestBody {
  name: string;
}

app.post('/api/data', (req: Request, res: Response) => {
  try {
    const { name }: RequestBody = req.body;

    if (!name) {
      const errorResponse: ApiResponse<null> = {
        status: 'error',
        message: 'Name is required in the request body.',
      };
      return res.status(400).json(errorResponse);
    }

    const responseData = {
      message: `Hello, ${name}!`,
    };

    const successResponse: ApiResponse<typeof responseData> = {
      status: 'success',
      data: responseData,
    };

    res.status(201).json(successResponse);
  } catch (error: any) {
    console.error('Error processing request:', error);
    const errorResponse: ApiResponse<null> = {
      status: 'error',
      message: 'Internal server error.',
    };
    res.status(500).json(errorResponse);
  }
});

// Generic error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  const errorResponse: ApiResponse<null> = {
    status: 'error',
    message: 'Internal server error.',
  };
  res.status(500).json(errorResponse);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Export the Express app for testing or other modules
export default app;