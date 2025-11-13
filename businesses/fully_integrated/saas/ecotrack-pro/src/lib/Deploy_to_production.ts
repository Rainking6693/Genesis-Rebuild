import { isNumber } from 'util';

type ValidateInputOptions = {
  name: string;
  type: string;
  min?: number;
  max?: number;
};

function validateInput(value: any, options: ValidateInputOptions): asserts value is NonNullable<typeof value> {
  if (!isNumber(value)) {
    throw new Error(`Invalid ${options.name}: Expected ${options.type}, received ${typeof value}`);
  }

  if (options.min !== undefined && value < options.min) {
    throw new Error(`Invalid ${options.name}: Value ${value} is less than the minimum allowed ${options.min}`);
  }

  if (options.max !== undefined && value > options.max) {
    throw new Error(`Invalid ${options.name}: Value ${value} is greater than the maximum allowed ${options.max}`);
  }
}

export function calculateRectangleArea(length: number, width: number): number {
  // Validate input to ensure it meets the business requirements
  validateInput(length, { name: 'length', type: 'Number', min: 0 });
  validateInput(width, { name: 'width', type: 'Number', min: 0 });

  // Calculate the area of the rectangle
  const area = length * width;

  // Return the calculated area
  return area;
}

// Add a custom validation function for positive numbers
function validatePositiveNumber(value: number): asserts value > 0 {
  if (value <= 0) {
    throw new Error('Invalid value: Expected a positive number');
  }
}

// Use the custom validation function for the minimum values of length and width
export function calculateRectangleAreaWithCustomValidation(length: number, width: number): number {
  validatePositiveNumber(length);
  validatePositiveNumber(width);

  // Calculate the area of the rectangle
  const area = length * width;

  // Return the calculated area
  return area;
}

import { isNumber } from 'util';

type ValidateInputOptions = {
  name: string;
  type: string;
  min?: number;
  max?: number;
};

function validateInput(value: any, options: ValidateInputOptions): asserts value is NonNullable<typeof value> {
  if (!isNumber(value)) {
    throw new Error(`Invalid ${options.name}: Expected ${options.type}, received ${typeof value}`);
  }

  if (options.min !== undefined && value < options.min) {
    throw new Error(`Invalid ${options.name}: Value ${value} is less than the minimum allowed ${options.min}`);
  }

  if (options.max !== undefined && value > options.max) {
    throw new Error(`Invalid ${options.name}: Value ${value} is greater than the maximum allowed ${options.max}`);
  }
}

export function calculateRectangleArea(length: number, width: number): number {
  // Validate input to ensure it meets the business requirements
  validateInput(length, { name: 'length', type: 'Number', min: 0 });
  validateInput(width, { name: 'width', type: 'Number', min: 0 });

  // Calculate the area of the rectangle
  const area = length * width;

  // Return the calculated area
  return area;
}

// Add a custom validation function for positive numbers
function validatePositiveNumber(value: number): asserts value > 0 {
  if (value <= 0) {
    throw new Error('Invalid value: Expected a positive number');
  }
}

// Use the custom validation function for the minimum values of length and width
export function calculateRectangleAreaWithCustomValidation(length: number, width: number): number {
  validatePositiveNumber(length);
  validatePositiveNumber(width);

  // Calculate the area of the rectangle
  const area = length * width;

  // Return the calculated area
  return area;
}