// src/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- API Endpoints ---

// User Management
app.post('/users', async (req: Request, res: Response) => {
  try {
    // TODO: Implement user creation logic
    const newUser = req.body; // Assuming request body contains user data
    console.log("Creating new user:", newUser);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error: any) {
    console.error("Error creating user:", error);
    next(error); // Pass error to error handling middleware
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    // TODO: Implement user retrieval logic
    const userId = req.params.id;
    console.log("Retrieving user with ID:", userId);
    res.status(200).json({ message: `User with ID ${userId} retrieved successfully` });
  } catch (error: any) {
    console.error("Error retrieving user:", error);
    next(error);
  }
});

// Data Access
app.get('/data', async (req: Request, res: Response) => {
  try {
    // TODO: Implement data retrieval logic
    console.log("Retrieving data");
    res.status(200).json({ message: 'Data retrieved successfully' });
  } catch (error: any) {
    console.error("Error retrieving data:", error);
    next(error);
  }
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// src/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --- API Endpoints ---

// User Management
app.post('/users', async (req: Request, res: Response) => {
  try {
    // TODO: Implement user creation logic
    const newUser = req.body; // Assuming request body contains user data
    console.log("Creating new user:", newUser);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error: any) {
    console.error("Error creating user:", error);
    next(error); // Pass error to error handling middleware
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    // TODO: Implement user retrieval logic
    const userId = req.params.id;
    console.log("Retrieving user with ID:", userId);
    res.status(200).json({ message: `User with ID ${userId} retrieved successfully` });
  } catch (error: any) {
    console.error("Error retrieving user:", error);
    next(error);
  }
});

// Data Access
app.get('/data', async (req: Request, res: Response) => {
  try {
    // TODO: Implement data retrieval logic
    console.log("Retrieving data");
    res.status(200).json({ message: 'Data retrieved successfully' });
  } catch (error: any) {
    console.error("Error retrieving data:", error);
    next(error);
  }
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});