// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Proper class name
  }
}

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Mock data (replace with database integration in a real application)
const projects: { [id: string]: { name: string, description: string } } = {};

// GET /projects - Get all projects
app.get('/projects', (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectList = Object.entries(projects).map(([id, project]) => ({ id, ...project }));
    res.json(projectList);
  } catch (error) {
    next(error); // Pass error to error handler
  }
});

// POST /projects - Create a new project
app.post('/projects', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      throw new ApiError(400, 'Project name is required');
    }

    const id = uuidv4();
    projects[id] = { name, description };
    res.status(201).json({ id, name, description });
  } catch (error) {
    next(error);
  }
});

// GET /projects/:id - Get a specific project
app.get('/projects/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const project = projects[id];

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    res.json({ id, ...project });
  } catch (error) {
    next(error);
  }
});

// PUT /projects/:id - Update a specific project
app.put('/projects/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;

        if (!projects[id]) {
            throw new ApiError(404, 'Project not found');
        }

        if (name) {
            projects[id].name = name;
        }
        if (description) {
            projects[id].description = description;
        }

        res.json({ id, ...projects[id] });
    } catch (error) {
        next(error);
    }
});

// DELETE /projects/:id - Delete a specific project
app.delete('/projects/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        if (!projects[id]) {
            throw new ApiError(404, 'Project not found');
        }

        delete projects[id];
        res.status(204).send(); // No content
    } catch (error) {
        next(error);
    }
});

// Use error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Custom error class
class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError"; // Proper class name
  }
}

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Mock data (replace with database integration in a real application)
const projects: { [id: string]: { name: string, description: string } } = {};

// GET /projects - Get all projects
app.get('/projects', (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectList = Object.entries(projects).map(([id, project]) => ({ id, ...project }));
    res.json(projectList);
  } catch (error) {
    next(error); // Pass error to error handler
  }
});

// POST /projects - Create a new project
app.post('/projects', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      throw new ApiError(400, 'Project name is required');
    }

    const id = uuidv4();
    projects[id] = { name, description };
    res.status(201).json({ id, name, description });
  } catch (error) {
    next(error);
  }
});

// GET /projects/:id - Get a specific project
app.get('/projects/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const project = projects[id];

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    res.json({ id, ...project });
  } catch (error) {
    next(error);
  }
});

// PUT /projects/:id - Update a specific project
app.put('/projects/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;

        if (!projects[id]) {
            throw new ApiError(404, 'Project not found');
        }

        if (name) {
            projects[id].name = name;
        }
        if (description) {
            projects[id].description = description;
        }

        res.json({ id, ...projects[id] });
    } catch (error) {
        next(error);
    }
});

// DELETE /projects/:id - Delete a specific project
app.delete('/projects/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        if (!projects[id]) {
            throw new ApiError(404, 'Project not found');
        }

        delete projects[id];
        res.status(204).send(); // No content
    } catch (error) {
        next(error);
    }
});

// Use error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});