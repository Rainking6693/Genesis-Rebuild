import express from 'express';
import { Request, Response } from 'express';
import { validate, ValidationError } from 'express-validation';
import Joi from 'joi';

const app = express();

// Define the validation schema for the request body
const sumSchema = Joi.object({
  number1: Joi.number().required(),
  number2: Joi.number().required(),
});

// Middleware to validate the request body
app.use(validate({ body: sumSchema }));

app.post('/api/sum', (req: Request, res: Response) => {
  try {
    const { number1, number2 } = req.body;

    // Check if both numbers are non-negative
    if (number1 < 0 || number2 < 0) {
      throw new Error('Both numbers must be non-negative');
    }

    // Calculate the sum and send the response
    const sum = number1 + number2;
    res.json({ sum });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import { Request, Response } from 'express';
import { validate, ValidationError } from 'express-validation';
import Joi from 'joi';

const app = express();

// Define the validation schema for the request body
const sumSchema = Joi.object({
  number1: Joi.number().required(),
  number2: Joi.number().required(),
});

// Middleware to validate the request body
app.use(validate({ body: sumSchema }));

app.post('/api/sum', (req: Request, res: Response) => {
  try {
    const { number1, number2 } = req.body;

    // Check if both numbers are non-negative
    if (number1 < 0 || number2 < 0) {
      throw new Error('Both numbers must be non-negative');
    }

    // Calculate the sum and send the response
    const sum = number1 + number2;
    res.json({ sum });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});