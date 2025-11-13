// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Generic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Example endpoint (replace with actual SaaS API endpoints)
app.get('/api/resources', (req: Request, res: Response) => {
  try {
    // Simulate fetching resources
    const resources = [{ id: 1, name: 'Resource 1' }, { id: 2, name: 'Resource 2' }];
    res.json(resources);
  } catch (error: any) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

app.post('/api/resources', (req: Request, res: Response) => {
  try {
    // Simulate creating a resource
    const newResource = { ...req.body, id: 3 }; // Assign a dummy ID
    res.status(201).json(newResource); // 201 Created
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

// More endpoints (PUT, DELETE, etc.) would go here

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;

// src/api/rest_api.ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Generic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Example endpoint (replace with actual SaaS API endpoints)
app.get('/api/resources', (req: Request, res: Response) => {
  try {
    // Simulate fetching resources
    const resources = [{ id: 1, name: 'Resource 1' }, { id: 2, name: 'Resource 2' }];
    res.json(resources);
  } catch (error: any) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

app.post('/api/resources', (req: Request, res: Response) => {
  try {
    // Simulate creating a resource
    const newResource = { ...req.body, id: 3 }; // Assign a dummy ID
    res.status(201).json(newResource); // 201 Created
  } catch (error: any) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

// More endpoints (PUT, DELETE, etc.) would go here

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;

Now, I'll use the `Write` tool to save this code to `src/api/rest_api.ts`.

Finally, I'll generate the build report: