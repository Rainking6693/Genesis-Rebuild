import { ValidationError } from 'class-validator';
import { isNumeric } from 'class-validator/dist/validation/isNumeric';

interface SustainabilityScoreInput {
  number1: number;
  number2: number;
}

class SustainabilityScoreValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SustainabilityScoreValidationError';
  }
}

function isValidInput(input: SustainabilityScoreInput): input is SustainabilityScoreInput {
  return isNumeric(input.number1) && isNumeric(input.number2);
}

function validateInput(input: SustainabilityScoreInput): SustainabilityScoreInput {
  if (!isValidInput(input)) {
    throw new SustainabilityScoreValidationError('Both arguments must be numbers.');
  }

  return input;
}

function calculateSustainabilityScore(input: SustainabilityScoreInput): number {
  const validatedInput = validateInput(input);
  const sum = validatedInput.number1 + validatedInput.number2;
  const normalizedScore = Math.round((sum / 2) * 50);

  console.log(`Calculated Sustainability Score: ${normalizedScore}`);

  return normalizedScore;
}

// Usage example
try {
  const result = calculateSustainabilityScore({ number1: '10', number2: 20 });
  console.log(`Result: ${result}`);
} catch (error) {
  if (error instanceof SustainabilityScoreValidationError) {
    console.error(`Validation Error: ${error.message}`);
  } else {
    console.error(`Unexpected Error: ${error.message}`);
  }
}

// Edge cases handling
// Check if the input is empty
function isEmptyInput(input: SustainabilityScoreInput): boolean {
  return input.number1 === 0 && input.number2 === 0;
}

// Check if the input is null or undefined
function isNullOrUndefined(input: SustainabilityScoreInput): boolean {
  return input === null || input === undefined;
}

// Adding type guards for edge cases
function isValidInputWithEdgeCases(input: SustainabilityScoreInput): input is SustainabilityScoreInput {
  return !isEmptyInput(input) && !isNullOrUndefined(input) && isNumeric(input.number1) && isNumeric(input.number2);
}

// Usage example with edge cases handling
try {
  const result = calculateSustainabilityScore({ number1: null, number2: undefined });
  console.log(`Result: ${result}`);
} catch (error) {
  if (error instanceof SustainabilityScoreValidationError) {
    console.error(`Validation Error: ${error.message}`);
  } else {
    console.error(`Unexpected Error: ${error.message}`);
  }
}

import { ValidationError } from 'class-validator';
import { isNumeric } from 'class-validator/dist/validation/isNumeric';

interface SustainabilityScoreInput {
  number1: number;
  number2: number;
}

class SustainabilityScoreValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SustainabilityScoreValidationError';
  }
}

function isValidInput(input: SustainabilityScoreInput): input is SustainabilityScoreInput {
  return isNumeric(input.number1) && isNumeric(input.number2);
}

function validateInput(input: SustainabilityScoreInput): SustainabilityScoreInput {
  if (!isValidInput(input)) {
    throw new SustainabilityScoreValidationError('Both arguments must be numbers.');
  }

  return input;
}

function calculateSustainabilityScore(input: SustainabilityScoreInput): number {
  const validatedInput = validateInput(input);
  const sum = validatedInput.number1 + validatedInput.number2;
  const normalizedScore = Math.round((sum / 2) * 50);

  console.log(`Calculated Sustainability Score: ${normalizedScore}`);

  return normalizedScore;
}

// Usage example
try {
  const result = calculateSustainabilityScore({ number1: '10', number2: 20 });
  console.log(`Result: ${result}`);
} catch (error) {
  if (error instanceof SustainabilityScoreValidationError) {
    console.error(`Validation Error: ${error.message}`);
  } else {
    console.error(`Unexpected Error: ${error.message}`);
  }
}

// Edge cases handling
// Check if the input is empty
function isEmptyInput(input: SustainabilityScoreInput): boolean {
  return input.number1 === 0 && input.number2 === 0;
}

// Check if the input is null or undefined
function isNullOrUndefined(input: SustainabilityScoreInput): boolean {
  return input === null || input === undefined;
}

// Adding type guards for edge cases
function isValidInputWithEdgeCases(input: SustainabilityScoreInput): input is SustainabilityScoreInput {
  return !isEmptyInput(input) && !isNullOrUndefined(input) && isNumeric(input.number1) && isNumeric(input.number2);
}

// Usage example with edge cases handling
try {
  const result = calculateSustainabilityScore({ number1: null, number2: undefined });
  console.log(`Result: ${result}`);
} catch (error) {
  if (error instanceof SustainabilityScoreValidationError) {
    console.error(`Validation Error: ${error.message}`);
  } else {
    console.error(`Unexpected Error: ${error.message}`);
  }
}