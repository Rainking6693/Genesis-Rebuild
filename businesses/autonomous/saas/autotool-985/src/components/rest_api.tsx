// src/api/saas_endpoint.ts

import express, { Request, Response, NextFunction } from 'express';
import { validate } from 'express-validation';
import { saasEndpointValidation } from './validations/saas_endpoint_validation'; // Assuming a validation schema exists

const router = express.Router();

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error

  if (err instanceof validate.ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json({
    message: 'Internal Server Error',
  });
};

router.post('/saas/resource', validate(saasEndpointValidation), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Extract data from the request body
    const { data } = req.body;

    // 2. Validate the data (using express-validation middleware) - handled by validate()

    // 3. Business Logic (Placeholder - Replace with actual SaaS logic)
    // Example: Process the data, interact with a database, etc.
    console.log("Processing data:", data); // Placeholder

    // Simulate success
    const result = {
      message: 'Resource created successfully',
      data: { received: data, processed: true },
    };

    // 4. Send a success response
    res.status(201).json(result); // 201 Created
  } catch (error: any) {
    // 5. Handle errors
    console.error("Error processing request:", error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.use(errorHandler); // Use the error handling middleware

export default router;

// src/api/saas_endpoint.ts

import express, { Request, Response, NextFunction } from 'express';
import { validate } from 'express-validation';
import { saasEndpointValidation } from './validations/saas_endpoint_validation'; // Assuming a validation schema exists

const router = express.Router();

// Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error

  if (err instanceof validate.ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json({
    message: 'Internal Server Error',
  });
};

router.post('/saas/resource', validate(saasEndpointValidation), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Extract data from the request body
    const { data } = req.body;

    // 2. Validate the data (using express-validation middleware) - handled by validate()

    // 3. Business Logic (Placeholder - Replace with actual SaaS logic)
    // Example: Process the data, interact with a database, etc.
    console.log("Processing data:", data); // Placeholder

    // Simulate success
    const result = {
      message: 'Resource created successfully',
      data: { received: data, processed: true },
    };

    // 4. Send a success response
    res.status(201).json(result); // 201 Created
  } catch (error: any) {
    // 5. Handle errors
    console.error("Error processing request:", error);
    next(error); // Pass the error to the error handling middleware
  }
});

router.use(errorHandler); // Use the error handling middleware

export default router;