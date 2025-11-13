// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'; // Assuming Prisma is used

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

const prisma = new PrismaClient();

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Set the name for better identification
  }
}

// Middleware for global error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET all items
app.get('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error: any) {
    console.error("Error fetching items:", error);
    next(new ApiError(500, "Failed to fetch items"));
  }
});

// GET a single item by ID
app.get('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ApiError(400, "Invalid item ID"));
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id: id },
    });

    if (!item) {
      return next(new ApiError(404, "Item not found"));
    }

    res.json(item);
  } catch (error: any) {
    console.error("Error fetching item:", error);
    next(new ApiError(500, "Failed to fetch item"));
  }
});

// POST a new item
app.post('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newItem = await prisma.item.create({
      data: req.body,
    });
    res.status(201).json(newItem);
  } catch (error: any) {
    console.error("Error creating item:", error);
    next(new ApiError(400, "Failed to create item")); // Bad Request for invalid data
  }
});

// PUT (update) an existing item
app.put('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ApiError(400, "Invalid item ID"));
  }

  try {
    const updatedItem = await prisma.item.update({
      where: { id: id },
      data: req.body,
    });
    res.json(updatedItem);
  } catch (error: any) {
    console.error("Error updating item:", error);
    next(new ApiError(400, "Failed to update item")); // Bad Request if item not found or invalid data
  }
});

// DELETE an item
app.delete('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ApiError(400, "Invalid item ID"));
  }

  try {
    await prisma.item.delete({
      where: { id: id },
    });
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error: any) {
    console.error("Error deleting item:", error);
    next(new ApiError(404, "Item not found")); // Not Found if item doesn't exist
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the app for testing purposes
export default app;

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'; // Assuming Prisma is used

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

const prisma = new PrismaClient();

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Set the name for better identification
  }
}

// Middleware for global error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET all items
app.get('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error: any) {
    console.error("Error fetching items:", error);
    next(new ApiError(500, "Failed to fetch items"));
  }
});

// GET a single item by ID
app.get('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ApiError(400, "Invalid item ID"));
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id: id },
    });

    if (!item) {
      return next(new ApiError(404, "Item not found"));
    }

    res.json(item);
  } catch (error: any) {
    console.error("Error fetching item:", error);
    next(new ApiError(500, "Failed to fetch item"));
  }
});

// POST a new item
app.post('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newItem = await prisma.item.create({
      data: req.body,
    });
    res.status(201).json(newItem);
  } catch (error: any) {
    console.error("Error creating item:", error);
    next(new ApiError(400, "Failed to create item")); // Bad Request for invalid data
  }
});

// PUT (update) an existing item
app.put('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ApiError(400, "Invalid item ID"));
  }

  try {
    const updatedItem = await prisma.item.update({
      where: { id: id },
      data: req.body,
    });
    res.json(updatedItem);
  } catch (error: any) {
    console.error("Error updating item:", error);
    next(new ApiError(400, "Failed to update item")); // Bad Request if item not found or invalid data
  }
});

// DELETE an item
app.delete('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ApiError(400, "Invalid item ID"));
  }

  try {
    await prisma.item.delete({
      where: { id: id },
    });
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error: any) {
    console.error("Error deleting item:", error);
    next(new ApiError(404, "Item not found")); // Not Found if item doesn't exist
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the app for testing purposes
export default app;