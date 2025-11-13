// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Example endpoint: User authentication
app.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'test' && password === 'password') {
    res.status(200).json({ message: 'Login successful', token: 'fake_token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Example endpoint: Get data
app.get('/data', (req: Request, res: Response) => {
  try {
    const data = { message: 'This is some data from the API' };
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Example endpoint: Modify data
app.put('/data', (req: Request, res: Response) => {
  try {
    const newData = req.body;
    // In a real application, you would update the data in a database here
    res.status(200).json({ message: 'Data updated successfully', data: newData });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

// Use error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Example endpoint: User authentication
app.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'test' && password === 'password') {
    res.status(200).json({ message: 'Login successful', token: 'fake_token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Example endpoint: Get data
app.get('/data', (req: Request, res: Response) => {
  try {
    const data = { message: 'This is some data from the API' };
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Example endpoint: Modify data
app.put('/data', (req: Request, res: Response) => {
  try {
    const newData = req.body;
    // In a real application, you would update the data in a database here
    res.status(200).json({ message: 'Data updated successfully', data: newData });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

// Use error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;