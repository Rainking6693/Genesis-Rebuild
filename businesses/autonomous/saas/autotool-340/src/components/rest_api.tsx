// src/api/project.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
//import { Database } from '../db'; // Assuming a database connection

const router = express.Router();

// Define custom error classes
class APIError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = "APIError";
  }
}

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: any) => {
  console.error(err); // Log the error for debugging
  if (err instanceof APIError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * @route GET /projects
 * @desc Get all projects
 * @access Public (for now, add authentication later)
 */
router.get('/', async (req: Request, res: Response, next: any) => {
  try {
    //const projects = await Database.getProjects(); // Fetch from database
    const projects = [
      { id: uuidv4(), name: 'Project 1', description: 'Description 1' },
      { id: uuidv4(), name: 'Project 2', description: 'Description 2' },
    ]; // Mock data for now
    res.json(projects);
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route POST /projects
 * @desc Create a new project
 * @access Public (for now, add authentication later)
 */
router.post('/', async (req: Request, res: Response, next: any) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      throw new APIError('Name and description are required', 400);
    }

    const newProject = {
      id: uuidv4(),
      name,
      description,
    };

    //await Database.createProject(newProject); // Save to database
    console.log('Project created:', newProject); // Mock save

    res.status(201).json(newProject);
  } catch (error: any) {
    next(error);
  }
});

/**
 * @route GET /projects/:id
 * @desc Get a project by ID
 * @access Public (for now, add authentication later)
 */
router.get('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const { id } = req.params;
    //const project = await Database.getProjectById(id); // Fetch from database
    const project = { id: id, name: 'Project ' + id, description: 'Description ' + id }; // Mock data

    if (!project) {
      throw new APIError('Project not found', 404);
    }

    res.json(project);
  } catch (error: any) {
    next(error);
  }
});

router.use(errorHandler); // Use the error handling middleware

export default router;