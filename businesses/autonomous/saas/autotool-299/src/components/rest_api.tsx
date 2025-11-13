// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import { userRouter } from './routes/userRoutes';
import { authRouter } from './routes/authRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

// src/api/routes/userRoutes.ts
import express, { Request, Response } from 'express';

const userRouter = express.Router();

userRouter.get('/', (req: Request, res: Response) => {
  try {
    res.send('List of users');
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

userRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    res.send(`User with ID: ${userId}`);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).send({ error: "Failed to fetch user" });
  }
});

export { userRouter };

// src/api/routes/authRoutes.ts
import express, { Request, Response } from 'express';

const authRouter = express.Router();

authRouter.post('/login', (req: Request, res: Response) => {
  try {
    // Basic login logic (replace with actual authentication)
    const { username, password } = req.body;
    if (username === 'test' && password === 'password') {
      res.send({ message: 'Login successful' });
    } else {
      res.status(401).send({ error: 'Invalid credentials' });
    }
  } catch (error: any) {
    console.error("Error during login:", error);
    res.status(500).send({ error: "Login failed" });
  }
});

authRouter.post('/register', (req: Request, res: Response) => {
  try {
    // Basic registration logic (replace with actual registration)
    res.send({ message: 'Registration successful' });
  } catch (error: any) {
    console.error("Error during registration:", error);
    res.status(500).send({ error: "Registration failed" });
  }
});

export { authRouter };