// src/api/project.ts
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Custom Error Class
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace

  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// In-memory data (replace with database later)
let projects: { id: string; name: string; description: string }[] = [];
let tasks: { id: string; projectId: string; description: string; completed: boolean }[] = [];

// --- Project Endpoints ---

// GET all projects
router.get('/projects', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(projects);
  } catch (error: any) {
    next(error); // Pass error to error handling middleware
  }
});

// GET a specific project by ID
router.get('/projects/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      throw new APIError('Project not found', 404);
    }

    res.json(project);
  } catch (error: any) {
    next(error);
  }
});

// POST a new project
router.post('/projects', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      throw new APIError('Name and description are required', 400);
    }

    const newProject = {
      id: Math.random().toString(36).substring(2, 15), // Generate a random ID
      name,
      description,
    };

    projects.push(newProject);
    res.status(201).json(newProject);
  } catch (error: any) {
    next(error);
  }
});

// PUT (update) an existing project
router.put('/projects/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const { name, description } = req.body;

    const projectIndex = projects.findIndex((p) => p.id === projectId);

    if (projectIndex === -1) {
      throw new APIError('Project not found', 404);
    }

    if (!name || !description) {
      throw new APIError('Name and description are required', 400);
    }

    projects[projectIndex] = { ...projects[projectIndex], name, description };
    res.json(projects[projectIndex]);
  } catch (error: any) {
    next(error);
  }
});

// DELETE a project
router.delete('/projects/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    projects = projects.filter((p) => p.id !== projectId);
    res.status(204).send(); // No content
  } catch (error: any) {
    next(error);
  }
});

// --- Task Endpoints (Example) ---

// POST a new task for a project
router.post('/projects/:projectId/tasks', (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId;
    const { description } = req.body;

    if (!description) {
      throw new APIError('Description is required', 400);
    }

    const projectExists = projects.some(p => p.id === projectId);
    if (!projectExists) {
        throw new APIError('Project not found', 404);
    }

    const newTask = {
      id: Math.random().toString(36).substring(2, 15),
      projectId,
      description,
      completed: false,
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error: any) {
    next(error);
  }
});

router.use(errorHandler); // Use error handling middleware

export default router;