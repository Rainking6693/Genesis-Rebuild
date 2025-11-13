// src/api/restApi.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

// Example endpoint
app.get('/api/health', (req: Request, res: Response) => {
  try {
    const response: ApiResponse<string> = {
      status: 200,
      data: 'API is healthy',
    };
    res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Error in /health endpoint:', error);
    const response: ApiResponse<undefined> = {
      status: 500,
      error: 'Internal Server Error',
    };
    res.status(response.status).json(response);
  }
});

// Example POST endpoint
interface ExampleRequest {
  name: string;
  value: number;
}

interface ExampleResponse {
  message: string;
}

app.post('/api/example', (req: Request, res: Response) => {
  try {
    const requestBody: ExampleRequest = req.body;

    if (!requestBody.name || !requestBody.value) {
      const response: ApiResponse<undefined> = {
        status: 400,
        error: 'Name and value are required',
      };
      return res.status(response.status).json(response);
    }

    const responseData: ExampleResponse = {
      message: `Received name: ${requestBody.name}, value: ${requestBody.value}`,
    };

    const response: ApiResponse<ExampleResponse> = {
      status: 200,
      data: responseData,
    };

    res.status(response.status).json(response);

  } catch (error: any) {
    console.error('Error in /example endpoint:', error);
    const response: ApiResponse<undefined> = {
      status: 500,
      error: 'Internal Server Error',
    };
    res.status(response.status).json(response);
  }
});

// Generic error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Global error handler caught an error:', err);
  const response: ApiResponse<undefined> = {
    status: 500,
    error: 'Internal Server Error',
  };
  res.status(response.status).json(response);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// build_report.json
// {
//   "status": "success",
//   "errors": [],
//   "warnings": []
// }

// src/api/restApi.ts

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

// Example endpoint
app.get('/api/health', (req: Request, res: Response) => {
  try {
    const response: ApiResponse<string> = {
      status: 200,
      data: 'API is healthy',
    };
    res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Error in /health endpoint:', error);
    const response: ApiResponse<undefined> = {
      status: 500,
      error: 'Internal Server Error',
    };
    res.status(response.status).json(response);
  }
});

// Example POST endpoint
interface ExampleRequest {
  name: string;
  value: number;
}

interface ExampleResponse {
  message: string;
}

app.post('/api/example', (req: Request, res: Response) => {
  try {
    const requestBody: ExampleRequest = req.body;

    if (!requestBody.name || !requestBody.value) {
      const response: ApiResponse<undefined> = {
        status: 400,
        error: 'Name and value are required',
      };
      return res.status(response.status).json(response);
    }

    const responseData: ExampleResponse = {
      message: `Received name: ${requestBody.name}, value: ${requestBody.value}`,
    };

    const response: ApiResponse<ExampleResponse> = {
      status: 200,
      data: responseData,
    };

    res.status(response.status).json(response);

  } catch (error: any) {
    console.error('Error in /example endpoint:', error);
    const response: ApiResponse<undefined> = {
      status: 500,
      error: 'Internal Server Error',
    };
    res.status(response.status).json(response);
  }
});

// Generic error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Global error handler caught an error:', err);
  const response: ApiResponse<undefined> = {
    status: 500,
    error: 'Internal Server Error',
  };
  res.status(response.status).json(response);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// build_report.json
// {
//   "status": "success",
//   "errors": [],
//   "warnings": []
// }