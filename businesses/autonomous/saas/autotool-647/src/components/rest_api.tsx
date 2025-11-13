// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mock Data (Replace with database integration in a real application)
let products: any[] = [];

// --- API Endpoints ---

// GET all products
app.get('/products', (req: Request, res: Response) => {
  try {
    res.json(products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET a specific product by ID
app.get('/products/:id', (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST a new product
app.post('/products', (req: Request, res: Response) => {
  try {
    const newProduct = { id: uuidv4(), ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error: any) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT (update) an existing product
app.put('/products/:id', (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = { id: productId, ...req.body };
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE a product
app.delete('/products/:id', (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    products = products.filter(p => p.id !== productId);
    res.status(204).send(); // No content
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// --- Error Handling Middleware ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the app for testing purposes
export default app;