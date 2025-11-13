import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Add the name property
  }
}

// Generic error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example data store (in-memory for demonstration)
const data: { [key: string]: any } = {};

// GET endpoint to retrieve data by ID
app.get('/api/data/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      throw new ApiError(404, `Data with ID ${id} not found`);
    }
    res.json(data[id]);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// POST endpoint to create new data
app.post('/api/data', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = uuidv4();
    data[id] = req.body;
    res.status(201).json({ id, message: 'Data created successfully' });
  } catch (error) {
    next(error);
  }
});

// PUT endpoint to update existing data
app.put('/api/data/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      throw new ApiError(404, `Data with ID ${id} not found`);
    }
    data[id] = { ...data[id], ...req.body };
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE endpoint to delete data
app.delete('/api/data/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!data[id]) {
      throw new ApiError(404, `Data with ID ${id} not found`);
    }
    delete data[id];
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

{
  "build_report": {
    "status": "success",
    "errors": [],
    "warnings": [],
    "language": "TypeScript",
    "framework": "Node.js/Express",
    "lines": 118,
    "description": "Basic REST API with CRUD operations and error handling."
  },
  "generated_code": {
    "code_file": "src/api/rest_api.ts",
    "language": "TypeScript",
    "error_handling": "Comprehensive error handling with custom error classes and middleware."
  }
}