// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Generic error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ error: 'Internal Server Error' });
};

// Example: User routes
app.get('/users', async (req: Request, res: Response) => {
  try {
    // Simulate fetching users from a database
    const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
    res.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    next(error); // Pass the error to the error handler
  }
});

app.post('/users', async (req: Request, res: Response) => {
  try {
    const newUser = req.body;
    // Simulate saving the new user to a database
    console.log("Creating new user:", newUser);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error: any) {
    console.error("Error creating user:", error);
    next(error);
  }
});

// Example: Product routes
app.get('/products', async (req: Request, res: Response) => {
    try {
        // Simulate fetching products from a database
        const products = [{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }];
        res.json(products);
    } catch (error: any) {
        console.error("Error fetching products:", error);
        next(error);
    }
});

app.post('/products', async (req: Request, res: Response) => {
    try {
        const newProduct = req.body;
        // Simulate saving the new product to a database
        console.log("Creating new product:", newProduct);
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error: any) {
        console.error("Error creating product:", error);
        next(error);
    }
});

// Use the error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Export the app for testing or other modules
export default app;

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Generic error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ error: 'Internal Server Error' });
};

// Example: User routes
app.get('/users', async (req: Request, res: Response) => {
  try {
    // Simulate fetching users from a database
    const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
    res.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    next(error); // Pass the error to the error handler
  }
});

app.post('/users', async (req: Request, res: Response) => {
  try {
    const newUser = req.body;
    // Simulate saving the new user to a database
    console.log("Creating new user:", newUser);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error: any) {
    console.error("Error creating user:", error);
    next(error);
  }
});

// Example: Product routes
app.get('/products', async (req: Request, res: Response) => {
    try {
        // Simulate fetching products from a database
        const products = [{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }];
        res.json(products);
    } catch (error: any) {
        console.error("Error fetching products:", error);
        next(error);
    }
});

app.post('/products', async (req: Request, res: Response) => {
    try {
        const newProduct = req.body;
        // Simulate saving the new product to a database
        console.log("Creating new product:", newProduct);
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error: any) {
        console.error("Error creating product:", error);
        next(error);
    }
});

// Use the error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Export the app for testing or other modules
export default app;