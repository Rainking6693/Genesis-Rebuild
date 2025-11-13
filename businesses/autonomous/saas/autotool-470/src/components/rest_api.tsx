// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes';
import dataRoutes from './routes/dataRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// Routes
app.use('/users', userRoutes);
app.use('/data', dataRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/api/routes/userRoutes.ts
import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  try {
    res.send('List of users');
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    // Example: Create a new user
    const newUser = req.body;
    // Placeholder for database interaction
    console.log('Creating user:', newUser);
    res.status(201).send({ message: 'User created successfully', user: newUser });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

export default router;

// src/api/routes/dataRoutes.ts
import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  try {
    res.send('Data endpoint');
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

export default router;