import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// Sample route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).send({ status: 'OK', timestamp: new Date() });
});

// Example route with error handling
app.get('/api/users/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).send({ error: 'Invalid user ID' });
    }

    // Simulate fetching user from database
    const user = { id: userId, name: `User ${userId}` };

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.status(200).send(user);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

// Mount error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;