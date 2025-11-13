import { validate, Validator } from 'jsonschema';
import { CustomError } from './custom-error';

// Define the input schema for the addNumbers function
const addNumbersSchema = {
  type: 'object',
  properties: {
    a: { type: 'number', minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
    b: { type: 'number', minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
  },
  required: ['a', 'b'],
};

// Define the addNumbers function
export function addNumbers(input: any): number {
  // Validate the input against the schema
  const validationResult = validate(input, addNumbersSchema);
  if (!validationResult.valid) {
    throw new CustomError('Invalid input format', 400);
  }

  // Add the numbers and return the result
  const result = input.a + input.b;
  if (result > Number.MAX_SAFE_INTEGER || result < Number.MIN_SAFE_INTEGER) {
    throw new CustomError('The result is out of the safe integer range', 500);
  }
  return result;
}

// Define the CustomError class for better error handling
class CustomError extends Error {
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

// Add error handling for undefined properties
addNumbersSchema.additionalProperties = false;

// Add support for null values
addNumbersSchema.properties.a.nullable = true;
addNumbersSchema.properties.b.nullable = true;

// Add support for missing properties
addNumbersSchema.if additionalProperties = false then {
  then: { type: 'array', items: { type: 'string', enum: ['missingA', 'missingB'] } },
};

// Add support for empty objects
addNumbersSchema.additionalItems = false;

// Add support for empty arrays
addNumbersSchema.type = 'object';
addNumbersSchema.additionalProperties = { type: 'array', items: { type: 'string', enum: ['emptyArray'] } };

// Add support for null input
addNumbers.pre(async (req, res, next) => {
  if (!req.body) {
    throw new CustomError('Null input is not allowed', 400);
  }
  next();
});

import { validate, Validator } from 'jsonschema';
import { CustomError } from './custom-error';

// Define the input schema for the addNumbers function
const addNumbersSchema = {
  type: 'object',
  properties: {
    a: { type: 'number', minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
    b: { type: 'number', minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
  },
  required: ['a', 'b'],
};

// Define the addNumbers function
export function addNumbers(input: any): number {
  // Validate the input against the schema
  const validationResult = validate(input, addNumbersSchema);
  if (!validationResult.valid) {
    throw new CustomError('Invalid input format', 400);
  }

  // Add the numbers and return the result
  const result = input.a + input.b;
  if (result > Number.MAX_SAFE_INTEGER || result < Number.MIN_SAFE_INTEGER) {
    throw new CustomError('The result is out of the safe integer range', 500);
  }
  return result;
}

// Define the CustomError class for better error handling
class CustomError extends Error {
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

// Add error handling for undefined properties
addNumbersSchema.additionalProperties = false;

// Add support for null values
addNumbersSchema.properties.a.nullable = true;
addNumbersSchema.properties.b.nullable = true;

// Add support for missing properties
addNumbersSchema.if additionalProperties = false then {
  then: { type: 'array', items: { type: 'string', enum: ['missingA', 'missingB'] } },
};

// Add support for empty objects
addNumbersSchema.additionalItems = false;

// Add support for empty arrays
addNumbersSchema.type = 'object';
addNumbersSchema.additionalProperties = { type: 'array', items: { type: 'string', enum: ['emptyArray'] } };

// Add support for null input
addNumbers.pre(async (req, res, next) => {
  if (!req.body) {
    throw new CustomError('Null input is not allowed', 400);
  }
  next();
});