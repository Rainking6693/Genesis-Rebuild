import { CustomError } from './CustomError';

type ValidNumber = number | string;
type ValidInput = ValidNumber | null;

function validateUserInput(input: ValidNumber): ValidInput {
  let number: ValidNumber | null = null;

  try {
    number = typeof input === 'string' ? parseFloat(input) : input;
  } catch {
    return null;
  }

  if (isNaN(number)) {
    throw new CustomError('Invalid input. Please provide a valid number.', 400);
  }

  return number;
}

function calculateSum(num1: ValidNumber, num2: ValidNumber): number | null {
  const num1Validated = validateUserInput(num1);
  const num2Validated = validateUserInput(num2);

  if (num1Validated === null || num2Validated === null) {
    return null;
  }

  // Return the sum of the two numbers
  return num1Validated + num2Validated;
}

class CustomError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

import { CustomError } from './CustomError';

type ValidNumber = number | string;
type ValidInput = ValidNumber | null;

function validateUserInput(input: ValidNumber): ValidInput {
  let number: ValidNumber | null = null;

  try {
    number = typeof input === 'string' ? parseFloat(input) : input;
  } catch {
    return null;
  }

  if (isNaN(number)) {
    throw new CustomError('Invalid input. Please provide a valid number.', 400);
  }

  return number;
}

function calculateSum(num1: ValidNumber, num2: ValidNumber): number | null {
  const num1Validated = validateUserInput(num1);
  const num2Validated = validateUserInput(num2);

  if (num1Validated === null || num2Validated === null) {
    return null;
  }

  // Return the sum of the two numbers
  return num1Validated + num2Validated;
}

class CustomError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}