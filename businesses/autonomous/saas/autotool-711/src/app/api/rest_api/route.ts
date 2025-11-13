// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Interface for data objects (example: User)
interface User {
    id: string;
    name: string;
    email: string;
}

// In-memory data store (replace with a database in a real application)
const users: User[] = [];

// Custom error class
class ApiError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError"; // Set the name for better identification
    }
}

// --- CRUD Operations ---

// Create (POST)
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            throw new ApiError(400, "Name and email are required.");
        }

        const newUser: User = {
            id: uuidv4(),
            name,
            email,
        };

        users.push(newUser);
        res.status(201).json(newUser); // 201 Created
    } catch (error) {
        next(error); // Pass error to error handling middleware
    }
});

// Read (GET all)
app.get('/users', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

// Read (GET one)
app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = users.find((u) => u.id === id);

        if (!user) {
            throw new ApiError(404, "User not found.");
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

// Update (PUT)
app.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
            throw new ApiError(404, "User not found.");
        }

        if (!name || !email) {
            throw new ApiError(400, "Name and email are required.");
        }

        users[userIndex] = { ...users[userIndex], name, email };

        res.status(200).json(users[userIndex]);
    } catch (error) {
        next(error);
    }
});

// Delete (DELETE)
app.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
            throw new ApiError(404, "User not found.");
        }

        users.splice(userIndex, 1);
        res.status(204).send(); // 204 No Content (successful deletion)
    } catch (error) {
        next(error);
    }
});

// --- Error Handling Middleware ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error stack trace for debugging

    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Interface for data objects (example: User)
interface User {
    id: string;
    name: string;
    email: string;
}

// In-memory data store (replace with a database in a real application)
const users: User[] = [];

// Custom error class
class ApiError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError"; // Set the name for better identification
    }
}

// --- CRUD Operations ---

// Create (POST)
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            throw new ApiError(400, "Name and email are required.");
        }

        const newUser: User = {
            id: uuidv4(),
            name,
            email,
        };

        users.push(newUser);
        res.status(201).json(newUser); // 201 Created
    } catch (error) {
        next(error); // Pass error to error handling middleware
    }
});

// Read (GET all)
app.get('/users', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

// Read (GET one)
app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = users.find((u) => u.id === id);

        if (!user) {
            throw new ApiError(404, "User not found.");
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

// Update (PUT)
app.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
            throw new ApiError(404, "User not found.");
        }

        if (!name || !email) {
            throw new ApiError(400, "Name and email are required.");
        }

        users[userIndex] = { ...users[userIndex], name, email };

        res.status(200).json(users[userIndex]);
    } catch (error) {
        next(error);
    }
});

// Delete (DELETE)
app.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
            throw new ApiError(404, "User not found.");
        }

        users.splice(userIndex, 1);
        res.status(204).send(); // 204 No Content (successful deletion)
    } catch (error) {
        next(error);
    }
});

// --- Error Handling Middleware ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error stack trace for debugging

    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});