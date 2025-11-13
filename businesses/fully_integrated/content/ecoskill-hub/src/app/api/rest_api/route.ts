import express from 'express';
import { Request, Response } from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';

class CalculatorAPI {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.app.use(express.json());
  }

  private validateAddSchema = Joi.object({
    num1: Joi.number().required(),
    num2: Joi.number().required(),
  });

  private routes(): void {
    this.app.get('/add/:num1/:num2', validate({ body: this.validateAddSchema }), this.add);
  }

  private add = (req: Request, res: Response) => {
    const num1 = parseFloat(req.params.num1);
    const num2 = parseFloat(req.params.num2);
    const num1IsValid = !isNaN(num1);
    const num2IsValid = !isNaN(num2);

    if (!num1IsValid || !num2IsValid) {
      return res.status(400).json({ error: 'Invalid input. Please provide valid numbers.' });
    }

    const result = num1 + num2;

    res.json({ result });
  };
}

// Usage example
const calculatorAPI = new CalculatorAPI();
const port = process.env.PORT || 3000;
calculatorAPI.app.listen(port, () => {
  console.log(`Calculator API is running on port ${port}`);
});

import express from 'express';
import { Request, Response } from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';

class CalculatorAPI {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.app.use(express.json());
  }

  private validateAddSchema = Joi.object({
    num1: Joi.number().required(),
    num2: Joi.number().required(),
  });

  private routes(): void {
    this.app.get('/add/:num1/:num2', validate({ body: this.validateAddSchema }), this.add);
  }

  private add = (req: Request, res: Response) => {
    const num1 = parseFloat(req.params.num1);
    const num2 = parseFloat(req.params.num2);
    const num1IsValid = !isNaN(num1);
    const num2IsValid = !isNaN(num2);

    if (!num1IsValid || !num2IsValid) {
      return res.status(400).json({ error: 'Invalid input. Please provide valid numbers.' });
    }

    const result = num1 + num2;

    res.json({ result });
  };
}

// Usage example
const calculatorAPI = new CalculatorAPI();
const port = process.env.PORT || 3000;
calculatorAPI.app.listen(port, () => {
  console.log(`Calculator API is running on port ${port}`);
});