// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Optional: Set the name of the error for better identification
  }
}

// Generic error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// In-memory data store (replace with a database in a real application)
const data: any[] = [];
let nextId = 1;

// Create (POST)
app.post('/api/items', (req: Request, res: Response, next: NextFunction) => {
  try {
    const newItem = { id: nextId++, ...req.body };
    data.push(newItem);
    res.status(201).json(newItem); // 201 Created
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

// Read (GET all)
app.get('/api/items', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(data);
  } catch (error: any) {
    next(error);
  }
});

// Read (GET one)
app.get('/api/items/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, "Invalid ID format.  ID must be an integer.");
    }
    const item = data.find(item => item.id === id);
    if (!item) {
      throw new ApiError(404, 'Item not found');
    }
    res.json(item);
  } catch (error: any) {
    next(error);
  }
});

// Update (PUT)
app.put('/api/items/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, "Invalid ID format.  ID must be an integer.");
    }
    const itemIndex = data.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new ApiError(404, 'Item not found');
    }
    const updatedItem = { id: id, ...req.body };
    data[itemIndex] = updatedItem;
    res.json(updatedItem);
  } catch (error: any) {
    next(error);
  }
});

// Delete (DELETE)
app.delete('/api/items/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, "Invalid ID format.  ID must be an integer.");
    }
    const itemIndex = data.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new ApiError(404, 'Item not found');
    }
    data.splice(itemIndex, 1);
    res.status(204).send(); // 204 No Content (successful deletion)
  } catch (error: any) {
    next(error);
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Optional: Set the name of the error for better identification
  }
}

// Generic error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// In-memory data store (replace with a database in a real application)
const data: any[] = [];
let nextId = 1;

// Create (POST)
app.post('/api/items', (req: Request, res: Response, next: NextFunction) => {
  try {
    const newItem = { id: nextId++, ...req.body };
    data.push(newItem);
    res.status(201).json(newItem); // 201 Created
  } catch (error: any) {
    next(error); // Pass the error to the error handler
  }
});

// Read (GET all)
app.get('/api/items', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(data);
  } catch (error: any) {
    next(error);
  }
});

// Read (GET one)
app.get('/api/items/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, "Invalid ID format.  ID must be an integer.");
    }
    const item = data.find(item => item.id === id);
    if (!item) {
      throw new ApiError(404, 'Item not found');
    }
    res.json(item);
  } catch (error: any) {
    next(error);
  }
});

// Update (PUT)
app.put('/api/items/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, "Invalid ID format.  ID must be an integer.");
    }
    const itemIndex = data.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new ApiError(404, 'Item not found');
    }
    const updatedItem = { id: id, ...req.body };
    data[itemIndex] = updatedItem;
    res.json(updatedItem);
  } catch (error: any) {
    next(error);
  }
});

// Delete (DELETE)
app.delete('/api/items/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError(400, "Invalid ID format.  ID must be an integer.");
    }
    const itemIndex = data.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new ApiError(404, 'Item not found');
    }
    data.splice(itemIndex, 1);
    res.status(204).send(); // 204 No Content (successful deletion)
  } catch (error: any) {
    next(error);
  }
});

// Use the error handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});