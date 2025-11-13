import { validateArray, validateNumber } from './utilities';

/**
 * Validate the input list of numbers for the function.
 * @param numbers - List of numbers to validate.
 * @throws Error if the input is not an array, contains non-number elements, or is empty.
 */
function validateInput(numbers: number[]): void {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Input must be a non-empty array of numbers.');
  }

  numbers.forEach((number) => {
    if (!validateNumber(number)) {
      throw new Error('All elements in the array must be numbers.');
    }
  });

  // Edge case: Check if all numbers are unique
  const uniqueNumbers = new Set(numbers);
  if (numbers.length !== uniqueNumbers.size) {
    throw new Error('All numbers in the array must be unique.');
  }
}

/**
 * Function to process the list of numbers.
 * @param numbers - List of numbers to process.
 */
export function processNumbers(numbers: number[]): void {
  validateInput(numbers);

  // Your processing logic here...
}

/**
 * Utility function to validate a number.
 * @param number - Number to validate.
 * @returns True if the number is valid, false otherwise.
 */
function validateNumber(number: any): boolean {
  return typeof number === 'number' && !isNaN(number);
}

// Adding a type for the validateArray utility function for better type safety
type ValidateArrayFunction = (input: any) => void;

/**
 * Utility function to validate an array.
 * @param input - Array to validate.
 * @param validator - Function to validate each element in the array.
 * @throws Error if the input is not an array or contains elements that do not pass the validator function.
 */
function validateArrayWithValidator<T>(input: any[], validator: (item: T) => boolean): void {
  if (!Array.isArray(input)) {
    throw new Error('Input must be an array.');
  }

  input.forEach((item) => {
    if (!validator(item)) {
      throw new Error('All elements in the array must pass the provided validator function.');
    }
  });
}

// Replace the validateArray utility function with the new one for better type safety
export function validateArray(input: any[]): ValidateArrayFunction {
  return (items: any) => {
    validateArrayWithValidator(items, (item) => typeof item === 'number');
  };
}

// Adding a type for the processNumbers function for better type safety
type ProcessNumbersFunction = (numbers: number[]) => void;

/**
 * Test function for the processNumbers function.
 * @param numbers - List of numbers to test.
 * @param expectedResult - Expected result after processing the numbers.
 */
function testProcessNumbers(numbers: number[], expectedResult: void): void {
  const processNumbersFunction: ProcessNumbersFunction = processNumbers;
  processNumbersFunction(numbers);

  // Your testing logic here...
}

// Adding a test case for an empty array
testProcessNumbers([], undefined);

// Adding a test case for an array with non-number elements
testProcessNumbers([1, 'two', 3], () => {
  // This test case will throw an error because the input array contains a non-number element
});

// Adding a test case for an array with duplicate numbers
testProcessNumbers([1, 2, 2, 3], () => {
  // This test case will throw an error because the input array contains duplicate numbers
});

// Adding a test case for an array with negative numbers
testProcessNumbers([-1, 2, -3], () => {
  // Your testing logic here...
});

// Adding a test case for an array with zero
testProcessNumbers([0], () => {
  // Your testing logic here...
});

// Adding a test case for an array with a large number
testProcessNumbers([Number.MAX_SAFE_INTEGER], () => {
  // Your testing logic here...
});

// Adding a test case for an array with a large number and a small number
testProcessNumbers([Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], () => {
  // Your testing logic here...
});

import { validateArray, validateNumber } from './utilities';

/**
 * Validate the input list of numbers for the function.
 * @param numbers - List of numbers to validate.
 * @throws Error if the input is not an array, contains non-number elements, or is empty.
 */
function validateInput(numbers: number[]): void {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Input must be a non-empty array of numbers.');
  }

  numbers.forEach((number) => {
    if (!validateNumber(number)) {
      throw new Error('All elements in the array must be numbers.');
    }
  });

  // Edge case: Check if all numbers are unique
  const uniqueNumbers = new Set(numbers);
  if (numbers.length !== uniqueNumbers.size) {
    throw new Error('All numbers in the array must be unique.');
  }
}

/**
 * Function to process the list of numbers.
 * @param numbers - List of numbers to process.
 */
export function processNumbers(numbers: number[]): void {
  validateInput(numbers);

  // Your processing logic here...
}

/**
 * Utility function to validate a number.
 * @param number - Number to validate.
 * @returns True if the number is valid, false otherwise.
 */
function validateNumber(number: any): boolean {
  return typeof number === 'number' && !isNaN(number);
}

// Adding a type for the validateArray utility function for better type safety
type ValidateArrayFunction = (input: any) => void;

/**
 * Utility function to validate an array.
 * @param input - Array to validate.
 * @param validator - Function to validate each element in the array.
 * @throws Error if the input is not an array or contains elements that do not pass the validator function.
 */
function validateArrayWithValidator<T>(input: any[], validator: (item: T) => boolean): void {
  if (!Array.isArray(input)) {
    throw new Error('Input must be an array.');
  }

  input.forEach((item) => {
    if (!validator(item)) {
      throw new Error('All elements in the array must pass the provided validator function.');
    }
  });
}

// Replace the validateArray utility function with the new one for better type safety
export function validateArray(input: any[]): ValidateArrayFunction {
  return (items: any) => {
    validateArrayWithValidator(items, (item) => typeof item === 'number');
  };
}

// Adding a type for the processNumbers function for better type safety
type ProcessNumbersFunction = (numbers: number[]) => void;

/**
 * Test function for the processNumbers function.
 * @param numbers - List of numbers to test.
 * @param expectedResult - Expected result after processing the numbers.
 */
function testProcessNumbers(numbers: number[], expectedResult: void): void {
  const processNumbersFunction: ProcessNumbersFunction = processNumbers;
  processNumbersFunction(numbers);

  // Your testing logic here...
}

// Adding a test case for an empty array
testProcessNumbers([], undefined);

// Adding a test case for an array with non-number elements
testProcessNumbers([1, 'two', 3], () => {
  // This test case will throw an error because the input array contains a non-number element
});

// Adding a test case for an array with duplicate numbers
testProcessNumbers([1, 2, 2, 3], () => {
  // This test case will throw an error because the input array contains duplicate numbers
});

// Adding a test case for an array with negative numbers
testProcessNumbers([-1, 2, -3], () => {
  // Your testing logic here...
});

// Adding a test case for an array with zero
testProcessNumbers([0], () => {
  // Your testing logic here...
});

// Adding a test case for an array with a large number
testProcessNumbers([Number.MAX_SAFE_INTEGER], () => {
  // Your testing logic here...
});

// Adding a test case for an array with a large number and a small number
testProcessNumbers([Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], () => {
  // Your testing logic here...
});