// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { ResourceModel } from '../models/resource';

const router = express.Router();

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Create a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newResource = new ResourceModel(req.body);
    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    next(error);
  }
});

// Get all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await ResourceModel.find();
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// Get a specific resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resource = await ResourceModel.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Update a resource by ID
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedResource = await ResourceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// Delete a resource by ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedResource = await ResourceModel.findByIdAndDelete(req.params.id);
    if (!deletedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Apply error handling middleware

export default router;

// src/models/resource.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface Resource extends Document {
  name: string;
  description: string;
}

const resourceSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export const ResourceModel = mongoose.model<Resource>('Resource', resourceSchema);

// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import resourceRoutes from './api/resource';

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb://localhost:27017/saas_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/resources', resourceRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// src/api/resource.ts
import express, { Request, Response, NextFunction } from 'express';
import { ResourceModel } from '../models/resource';

const router = express.Router();

// Middleware for error handling
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Create a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newResource = new ResourceModel(req.body);
    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    next(error);
  }
});

// Get all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await ResourceModel.find();
    res.json(resources);
  } catch (error) {
    next(error);
  }
});

// Get a specific resource by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resource = await ResourceModel.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Update a resource by ID
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedResource = await ResourceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
});

// Delete a resource by ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedResource = await ResourceModel.findByIdAndDelete(req.params.id);
    if (!deletedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler); // Apply error handling middleware

export default router;

// src/models/resource.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface Resource extends Document {
  name: string;
  description: string;
}

const resourceSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export const ResourceModel = mongoose.model<Resource>('Resource', resourceSchema);

// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import resourceRoutes from './api/resource';

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb://localhost:27017/saas_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/resources', resourceRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});