// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom Error Class
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// User Management Endpoints
app.post('/users', (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      throw new APIError("Username and email are required", 400);
    }

    const userId = uuidv4();
    // Simulate user creation (replace with actual database interaction)
    console.log(`Creating user with ID: ${userId}, username: ${username}, email: ${email}`);

    res.status(201).json({ id: userId, username, email });
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
    } else {
        res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.get('/users/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    // Simulate fetching user (replace with actual database interaction)
    if (userId === '123') {
      res.json({ id: userId, username: 'testuser', email: 'test@example.com' });
    } else {
      throw new APIError("User not found", 404);
    }
  } catch (error: any) {
    console.error("Error getting user:", error);
    if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
    } else {
        res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Resource Management Endpoints (Example: Products)
app.post('/products', (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      throw new APIError("Name, description, and price are required", 400);
    }

    const productId = uuidv4();
    // Simulate product creation (replace with actual database interaction)
    console.log(`Creating product with ID: ${productId}, name: ${name}, description: ${description}, price: ${price}`);

    res.status(201).json({ id: productId, name, description, price });
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
    } else {
        res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Basic Reporting Endpoint
app.get('/report/summary', (req: Request, res: Response) => {
  try {
    // Simulate report generation (replace with actual data aggregation)
    const reportData = {
      totalUsers: 100,
      activeUsers: 80,
      totalProducts: 50
    };
    res.json(reportData);
  } catch (error: any) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error handling middleware (catch-all)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;