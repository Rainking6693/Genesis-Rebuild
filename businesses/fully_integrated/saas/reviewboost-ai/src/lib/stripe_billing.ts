import { isNaN, parseFloat } from 'mongodb';
import { ValidationError } from './errors';

// Custom validation function for numbers
export function validateNumber(value: any, fieldName: string): asserts value is number | null {
  if (value === null || typeof value !== 'number') {
    return;
  }

  if (isNaN(value)) {
    throw new ValidationError(`Invalid ${fieldName}: provided value is not a valid number`);
  }
}

// Add support for strings that can be parsed as numbers and handle null values
export function addNumbers(num1: string | number | null, num2: string | number | null): number | null {
  if (num1 === null || num2 === null) {
    return null;
  }

  validateNumber(num1, 'num1');
  validateNumber(num2, 'num2');

  // Parse strings as numbers before adding them
  const num1Parsed = parseFloat((num1 as string) || '0');
  const num2Parsed = parseFloat((num2 as string) || '0');

  // Add the numbers and return the result
  return num1Parsed + num2Parsed;
}

// Custom validation error class
class ValidationError extends Error {
  constructor(message: string, fieldName: string) {
    super(`${message}: field ${fieldName}`);
    this.name = 'ValidationError';
  }
}

import { isNaN, parseFloat } from 'mongodb';
import { ValidationError } from './errors';

// Custom validation function for numbers
export function validateNumber(value: any, fieldName: string): asserts value is number | null {
  if (value === null || typeof value !== 'number') {
    return;
  }

  if (isNaN(value)) {
    throw new ValidationError(`Invalid ${fieldName}: provided value is not a valid number`);
  }
}

// Add support for strings that can be parsed as numbers and handle null values
export function addNumbers(num1: string | number | null, num2: string | number | null): number | null {
  if (num1 === null || num2 === null) {
    return null;
  }

  validateNumber(num1, 'num1');
  validateNumber(num2, 'num2');

  // Parse strings as numbers before adding them
  const num1Parsed = parseFloat((num1 as string) || '0');
  const num2Parsed = parseFloat((num2 as string) || '0');

  // Add the numbers and return the result
  return num1Parsed + num2Parsed;
}

// Custom validation error class
class ValidationError extends Error {
  constructor(message: string, fieldName: string) {
    super(`${message}: field ${fieldName}`);
    this.name = 'ValidationError';
  }
}