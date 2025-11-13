// src/api/rest_api.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// In-memory data store (replace with database integration in production)
const data: { [key: string]: any } = {};

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// GET endpoint
app.get('/api/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (data[id]) {
      res.json(data[id]);
    } else {
      res.status(404).send({ error: 'Not found' });
    }
  } catch (error: any) {
    console.error("Error in GET endpoint:", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// POST endpoint
app.post('/api', (req: Request, res: Response) => {
  try {
    const id = Math.random().toString(36).substring(2, 15); // Generate a random ID
    data[id] = req.body;
    res.status(201).json({ id: id, message: 'Created successfully' });
  } catch (error: any) {
    console.error("Error in POST endpoint:", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// PUT endpoint
app.put('/api/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (data[id]) {
      data[id] = req.body;
      res.json({ message: 'Updated successfully' });
    } else {
      res.status(404).send({ error: 'Not found' });
    }
  } catch (error: any) {
    console.error("Error in PUT endpoint:", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// DELETE endpoint
app.delete('/api/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (data[id]) {
      delete data[id];
      res.json({ message: 'Deleted successfully' });
    } else {
      res.status(404).send({ error: 'Not found' });
    }
  } catch (error: any) {
    console.error("Error in DELETE endpoint:", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

// src/api/rest_api.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// In-memory data store (replace with database integration in production)
const data: { [key: string]: any } = {};

// Middleware for error handling
const errorHandler = (err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
};

// GET endpoint
app.get('/api/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (data[id]) {
      res.json(data[id]);
    } else {
      res.status(404).send({ error: 'Not found' });
    }
  } catch (error: any) {
    console.error("Error in GET endpoint:", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// POST endpoint
app.post('/api', (req: Request, res: Response) => {
  try {
    const id = Math.random().toString(36).substring(2, 15); // Generate a random ID
    data[id] = req.body;
    res.status(201).json({ id: id, message: 'Created successfully' });
  } catch (error: any) {
    console.error("Error in POST endpoint:", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// PUT endpoint
app.put('/api/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (data[id]) {
      data[id] = req.body;
      res.json({ message: 'Updated successfully' });
    } else {
      res.status(404).send({ error: 'Not found' });
    }
  } catch (error: any) {
    console.error("Error in PUT endpoint:", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// DELETE endpoint
app.delete('/api/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (data[id]) {
      delete data[id];
      res.json({ message: 'Deleted successfully' });
    } else {
      res.status(404).send({ error: 'Not found' });
    }
  } catch (error: any) {
    console.error("Error in DELETE endpoint:", error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;