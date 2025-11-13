// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom error class
class APIError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = "APIError";
    }
}

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error stack trace

    if (err instanceof APIError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// User management endpoints
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email } = req.body;

        if (!username || !email) {
            throw new APIError("Username and email are required", 400);
        }

        const userId = uuidv4(); // Generate a unique user ID
        const newUser = { id: userId, username, email };

        // In a real application, you would save the user to a database here

        res.status(201).json(newUser);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;

        // In a real application, you would retrieve the user from a database here
        const user = { id: userId, username: 'exampleUser', email: 'user@example.com' };

        if (!user) {
            throw new APIError("User not found", 404);
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Subscription management endpoints
app.post('/subscriptions', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, plan } = req.body;

        if (!userId || !plan) {
            throw new APIError("User ID and plan are required", 400);
        }

        const subscriptionId = uuidv4();
        const newSubscription = { id: subscriptionId, userId, plan, status: 'active' };

        // In a real application, you would save the subscription to a database here

        res.status(201).json(newSubscription);
    } catch (error) {
        next(error);
    }
});

// Data access endpoint (example)
app.get('/data', (req: Request, res: Response, next: NextFunction) => {
    try {
        // Simulate data retrieval
        const data = { message: 'Data retrieved successfully' };
        res.json(data);
    } catch (error) {
        next(error);
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// src/api/index.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom error class
class APIError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = "APIError";
    }
}

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error stack trace

    if (err instanceof APIError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// User management endpoints
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email } = req.body;

        if (!username || !email) {
            throw new APIError("Username and email are required", 400);
        }

        const userId = uuidv4(); // Generate a unique user ID
        const newUser = { id: userId, username, email };

        // In a real application, you would save the user to a database here

        res.status(201).json(newUser);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;

        // In a real application, you would retrieve the user from a database here
        const user = { id: userId, username: 'exampleUser', email: 'user@example.com' };

        if (!user) {
            throw new APIError("User not found", 404);
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Subscription management endpoints
app.post('/subscriptions', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, plan } = req.body;

        if (!userId || !plan) {
            throw new APIError("User ID and plan are required", 400);
        }

        const subscriptionId = uuidv4();
        const newSubscription = { id: subscriptionId, userId, plan, status: 'active' };

        // In a real application, you would save the subscription to a database here

        res.status(201).json(newSubscription);
    } catch (error) {
        next(error);
    }
});

// Data access endpoint (example)
app.get('/data', (req: Request, res: Response, next: NextFunction) => {
    try {
        // Simulate data retrieval
        const data = { message: 'Data retrieved successfully' };
        res.json(data);
    } catch (error) {
        next(error);
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

Now, I will use the tools to write the file and generate the report.

**Final Answer:**