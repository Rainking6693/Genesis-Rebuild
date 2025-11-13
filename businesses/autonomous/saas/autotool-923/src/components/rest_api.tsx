// src/api/project.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

const projects: Project[] = [];

// GET all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json(projects);
  } catch (error: any) {
    console.error("Error getting projects:", error);
    res.status(500).json({ error: "Failed to retrieve projects" });
  }
});

// GET a specific project by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error: any) {
    console.error("Error getting project:", error);
    res.status(500).json({ error: "Failed to retrieve project" });
  }
});

// POST a new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date(),
    };

    projects.push(newProject);
    res.status(201).json(newProject);

  } catch (error: any) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT (update) an existing project
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ error: "Name and description are required" });
        }

        const projectIndex = projects.findIndex(p => p.id === projectId);

        if (projectIndex === -1) {
            return res.status(404).json({ error: "Project not found" });
        }

        projects[projectIndex] = {
            ...projects[projectIndex],
            name,
            description
        };

        res.status(200).json(projects[projectIndex]);

    } catch (error: any) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Failed to update project" });
    }
});

// DELETE a project
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        const projectIndex = projects.findIndex(p => p.id === projectId);

        if (projectIndex === -1) {
            return res.status(404).json({ error: "Project not found" });
        }

        projects.splice(projectIndex, 1);
        res.status(204).send(); // No content
    } catch (error: any) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Failed to delete project" });
    }
});

export default router;

// index.ts (Main application file)
import express from 'express';
import projectRoutes from './api/project';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/projects', projectRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});