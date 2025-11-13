// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import { userRouter } from './routes/userRoutes';
import { billingRouter } from './routes/billingRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/users', userRouter);
app.use('/billing', billingRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/api/routes/userRoutes.ts
import express, { Request, Response } from 'express';

export const userRouter = express.Router();

userRouter.get('/', (req: Request, res: Response) => {
  res.send('List of users');
});

userRouter.post('/', (req: Request, res: Response) => {
  res.send('Create a new user');
});

// src/api/routes/billingRoutes.ts
import express, { Request, Response } from 'express';

export const billingRouter = express.Router();

billingRouter.get('/subscriptions', (req: Request, res: Response) => {
  res.send('List of subscriptions');
});

billingRouter.post('/subscriptions', (req: Request, res: Response) => {
  res.send('Create a new subscription');
});