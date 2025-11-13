// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Routes
app.get('/users', (req: Request, res: Response) => {
  try {
    // Simulate fetching users from a database
    const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
    res.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    next(error); // Pass error to error handling middleware
  }
});

app.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'test' && password === 'password') {
    res.json({ token: 'fake_token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/data', (req: Request, res: Response) => {
  try {
    // Simulate fetching data
    const data = { message: 'This is some data' };
    res.json(data);
  } catch (error: any) {
    console.error("Error fetching data:", error);
    next(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;