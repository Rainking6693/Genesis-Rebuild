import { CustomError } from './CustomError';

// Define interfaces for input and error messages
interface Input {
  value: number;
}

interface ErrorMessage {
  code: number;
  message: string;
}

/**
 * Custom Error class for better error handling.
 */
class CustomError extends Error {
  constructor(message: string, errorCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
  }

  public errorCode: number;
}

/**
 * Test the error tracking function.
 * This function checks if the input is a valid positive integer and handles various edge cases.
 *
 * @param input - The input number to test.
 */
function testErrorTracking(input: Input): void {
  // Check if the input is a number and not NaN or Infinity.
  if (typeof input.value !== 'number' || isNaN(input.value) || input.value === Infinity || input.value === -Infinity) {
    throw new CustomError('Input must be a valid positive number.', 1);
  }

  // Check if the input is a positive integer.
  if (input.value <= 0) {
    throw new CustomError('Input must be a positive integer.', 2);
  }

  // Handle the case where the input is 1.
  if (input.value === 1) {
    console.log('Special case: Input is 1.');
  } else {
    console.log(`Testing error tracking with input: ${input.value}`);
  }
}

/**
 * Test the error tracking function with accessibility in mind.
 * This function accepts input from the command line and logs the result.
 */
function main(): void {
  if (process.argv.length < 3) {
    console.error('Please provide a number as an argument.');
    process.exit(1);
  }

  const input = parseInt(process.argv[2], 10);

  try {
    testErrorTracking({ value: input });
    console.log('Test passed successfully.');
  } catch (error) {
    console.error(`Error: ${error.message} (Code: ${error.errorCode})`);
    process.exit(error.errorCode);
  }
}

main();

import { CustomError } from './CustomError';

// Define interfaces for input and error messages
interface Input {
  value: number;
}

interface ErrorMessage {
  code: number;
  message: string;
}

/**
 * Custom Error class for better error handling.
 */
class CustomError extends Error {
  constructor(message: string, errorCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
  }

  public errorCode: number;
}

/**
 * Test the error tracking function.
 * This function checks if the input is a valid positive integer and handles various edge cases.
 *
 * @param input - The input number to test.
 */
function testErrorTracking(input: Input): void {
  // Check if the input is a number and not NaN or Infinity.
  if (typeof input.value !== 'number' || isNaN(input.value) || input.value === Infinity || input.value === -Infinity) {
    throw new CustomError('Input must be a valid positive number.', 1);
  }

  // Check if the input is a positive integer.
  if (input.value <= 0) {
    throw new CustomError('Input must be a positive integer.', 2);
  }

  // Handle the case where the input is 1.
  if (input.value === 1) {
    console.log('Special case: Input is 1.');
  } else {
    console.log(`Testing error tracking with input: ${input.value}`);
  }
}

/**
 * Test the error tracking function with accessibility in mind.
 * This function accepts input from the command line and logs the result.
 */
function main(): void {
  if (process.argv.length < 3) {
    console.error('Please provide a number as an argument.');
    process.exit(1);
  }

  const input = parseInt(process.argv[2], 10);

  try {
    testErrorTracking({ value: input });
    console.log('Test passed successfully.');
  } catch (error) {
    console.error(`Error: ${error.message} (Code: ${error.errorCode})`);
    process.exit(error.errorCode);
  }
}

main();