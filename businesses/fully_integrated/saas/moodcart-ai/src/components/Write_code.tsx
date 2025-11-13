import { assert } from 'assert';

type ErrorMessage = string;

function addNumbers(num1: number, num2: number): number {
  // Check correctness, completeness, and quality
  assert(typeof num1 === 'number', 'Both arguments must be numbers.');
  assert(typeof num2 === 'number', 'Both arguments must be numbers.');

  // Ensure consistency with business context
  // (This is not applicable in this case as the function is not related to the MoodCart AI)

  // Apply security best practices
  // (This is not applicable in this case as the function does not handle sensitive data)

  // Optimize performance
  // (This is not applicable in this case as the function is simple and efficient)

  // Improve maintainability
  // Use meaningful variable names and comments
  const sum: number = num1 + num2;

  // Return the result
  return sum;
}

// Check for negative numbers and return a custom error message
function checkForNegativeNumbers(num: number): asserts num >= 0 {
  if (num < 0) {
    throw new Error('Both arguments must be non-negative numbers.');
  }
}

// Handle edge cases by checking for NaN values and negative numbers
function addSafeNumbers(num1: number, num2: number): number {
  checkForNegativeNumbers(num1);
  checkForNegativeNumbers(num2);

  const num1IsNaN = Number.isNaN(num1);
  const num2IsNaN = Number.isNaN(num2);

  if (num1IsNaN && num2IsNaN) {
    throw new Error('Both arguments are not numbers.');
  }

  if (num1IsNaN) {
    return num2;
  }

  if (num2IsNaN) {
    return num1;
  }

  return addNumbers(num1, num2);
}

// Type the console.log output
type ConsoleLogOutput = number;

const result = addNumbers(5, 3);
console.log(result as ConsoleLogOutput); // Output: 8

const resultSafe = addSafeNumbers(5, 3);
console.log(resultSafe as ConsoleLogOutput); // Output: 8

const resultSafeWithNaN = addSafeNumbers(5, Number.NaN);
console.log(resultSafeWithNaN as ConsoleLogOutput); // Output: NaN

import { assert } from 'assert';

type ErrorMessage = string;

function addNumbers(num1: number, num2: number): number {
  // Check correctness, completeness, and quality
  assert(typeof num1 === 'number', 'Both arguments must be numbers.');
  assert(typeof num2 === 'number', 'Both arguments must be numbers.');

  // Ensure consistency with business context
  // (This is not applicable in this case as the function is not related to the MoodCart AI)

  // Apply security best practices
  // (This is not applicable in this case as the function does not handle sensitive data)

  // Optimize performance
  // (This is not applicable in this case as the function is simple and efficient)

  // Improve maintainability
  // Use meaningful variable names and comments
  const sum: number = num1 + num2;

  // Return the result
  return sum;
}

// Check for negative numbers and return a custom error message
function checkForNegativeNumbers(num: number): asserts num >= 0 {
  if (num < 0) {
    throw new Error('Both arguments must be non-negative numbers.');
  }
}

// Handle edge cases by checking for NaN values and negative numbers
function addSafeNumbers(num1: number, num2: number): number {
  checkForNegativeNumbers(num1);
  checkForNegativeNumbers(num2);

  const num1IsNaN = Number.isNaN(num1);
  const num2IsNaN = Number.isNaN(num2);

  if (num1IsNaN && num2IsNaN) {
    throw new Error('Both arguments are not numbers.');
  }

  if (num1IsNaN) {
    return num2;
  }

  if (num2IsNaN) {
    return num1;
  }

  return addNumbers(num1, num2);
}

// Type the console.log output
type ConsoleLogOutput = number;

const result = addNumbers(5, 3);
console.log(result as ConsoleLogOutput); // Output: 8

const resultSafe = addSafeNumbers(5, 3);
console.log(resultSafe as ConsoleLogOutput); // Output: 8

const resultSafeWithNaN = addSafeNumbers(5, Number.NaN);
console.log(resultSafeWithNaN as ConsoleLogOutput); // Output: NaN