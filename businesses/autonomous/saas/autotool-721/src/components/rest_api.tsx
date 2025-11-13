// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; //Properly set the name for instanceof checks
  }
}

// Centralized error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * @api {get} /healthcheck Health Check Endpoint
 * @apiDescription  Endpoint to check the health of the API.
 * @apiSuccess {String} status "OK" if the API is running.
 * @apiError (500) InternalServerError  An error occurred on the server.
 */
app.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

/**
 * @api {post} /users Create a new user
 * @apiDescription Creates a new user in the system.
 * @apiParam {String} username User's username.
 * @apiParam {String} email User's email address.
 * @apiSuccess {Number} id The ID of the newly created user.
 * @apiError (400) BadRequest Invalid input parameters.
 * @apiError (500) InternalServerError An error occurred on the server.
 */
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      throw new ApiError(400, 'Username and email are required.');
    }

    // Simulate user creation (replace with actual database logic)
    const userId = Math.floor(Math.random() * 1000);

    res.status(201).json({ id: userId });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Add more API endpoints here (e.g., GET /users/:id, PUT /users/:id, DELETE /users/:id)

// Use the error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; //Properly set the name for instanceof checks
  }
}

// Centralized error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * @api {get} /healthcheck Health Check Endpoint
 * @apiDescription  Endpoint to check the health of the API.
 * @apiSuccess {String} status "OK" if the API is running.
 * @apiError (500) InternalServerError  An error occurred on the server.
 */
app.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

/**
 * @api {post} /users Create a new user
 * @apiDescription Creates a new user in the system.
 * @apiParam {String} username User's username.
 * @apiParam {String} email User's email address.
 * @apiSuccess {Number} id The ID of the newly created user.
 * @apiError (400) BadRequest Invalid input parameters.
 * @apiError (500) InternalServerError An error occurred on the server.
 */
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      throw new ApiError(400, 'Username and email are required.');
    }

    // Simulate user creation (replace with actual database logic)
    const userId = Math.floor(Math.random() * 1000);

    res.status(201).json({ id: userId });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Add more API endpoints here (e.g., GET /users/:id, PUT /users/:id, DELETE /users/:id)

// Use the error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;