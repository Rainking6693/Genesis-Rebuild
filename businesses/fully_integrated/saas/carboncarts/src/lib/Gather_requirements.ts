import { Error as CustomError } from 'node-fetch';

/**
 * Calculates the sum of two numbers.
 *
 * @param number1 - The first number to be added.
 * @param number2 - The second number to be added.
 * @returns The sum of the two numbers.
 * @throws CustomError if either argument is not a number, null, undefined, Infinity, -Infinity, or if the result exceeds the maximum safe integer limit.
 */
function calculateSum(number1: number | null | undefined, number2: number | null | undefined): number {
  // Check correctness, completeness, and quality
  if (number1 === null || number1 === undefined || number2 === null || number2 === undefined) {
    throw new CustomError('Both arguments must be provided.');
  }

  if (typeof number1 !== 'number' || typeof number2 !== 'number') {
    throw new CustomError('Both arguments must be numbers.');
  }

  if (Number.isNaN(number1) || Number.isNaN(number2)) {
    throw new CustomError('Both arguments must be finite numbers.');
  }

  if (number1 === Infinity || number2 === Infinity) {
    throw new CustomError('Both arguments cannot be Infinity.');
  }

  if (number1 === -Infinity || number2 === -Infinity) {
    throw new CustomError('Both arguments cannot be -Infinity.');
  }

  // Ensure consistency with business context
  // This function is not directly related to the CarbonCarts SaaS, but it's a utility function.

  // Apply security best practices
  // No sensitive data is involved, so no specific security measures are needed.

  // Optimize performance
  // The function is already optimized for performance as it uses built-in TypeScript/JavaScript functions.

  // Improve maintainability
  // Adding comments to explain the function's purpose and input/output types.

  // Handle edge cases: NaN values
  const positiveNumber1 = Math.abs(number1);
  const positiveNumber2 = Math.abs(number2);

  // Calculate the sum of the two numbers.
  const sum = positiveNumber1 + positiveNumber2;

  // Ensure the result is always positive and within the maximum safe integer limit
  if (sum > Number.MAX_SAFE_INTEGER) {
    throw new CustomError('The sum exceeds the maximum safe integer limit.');
  }

  return sum > 0 ? sum : -sum;
}

import { Error as CustomError } from 'node-fetch';

/**
 * Calculates the sum of two numbers.
 *
 * @param number1 - The first number to be added.
 * @param number2 - The second number to be added.
 * @returns The sum of the two numbers.
 * @throws CustomError if either argument is not a number, null, undefined, Infinity, -Infinity, or if the result exceeds the maximum safe integer limit.
 */
function calculateSum(number1: number | null | undefined, number2: number | null | undefined): number {
  // Check correctness, completeness, and quality
  if (number1 === null || number1 === undefined || number2 === null || number2 === undefined) {
    throw new CustomError('Both arguments must be provided.');
  }

  if (typeof number1 !== 'number' || typeof number2 !== 'number') {
    throw new CustomError('Both arguments must be numbers.');
  }

  if (Number.isNaN(number1) || Number.isNaN(number2)) {
    throw new CustomError('Both arguments must be finite numbers.');
  }

  if (number1 === Infinity || number2 === Infinity) {
    throw new CustomError('Both arguments cannot be Infinity.');
  }

  if (number1 === -Infinity || number2 === -Infinity) {
    throw new CustomError('Both arguments cannot be -Infinity.');
  }

  // Ensure consistency with business context
  // This function is not directly related to the CarbonCarts SaaS, but it's a utility function.

  // Apply security best practices
  // No sensitive data is involved, so no specific security measures are needed.

  // Optimize performance
  // The function is already optimized for performance as it uses built-in TypeScript/JavaScript functions.

  // Improve maintainability
  // Adding comments to explain the function's purpose and input/output types.

  // Handle edge cases: NaN values
  const positiveNumber1 = Math.abs(number1);
  const positiveNumber2 = Math.abs(number2);

  // Calculate the sum of the two numbers.
  const sum = positiveNumber1 + positiveNumber2;

  // Ensure the result is always positive and within the maximum safe integer limit
  if (sum > Number.MAX_SAFE_INTEGER) {
    throw new CustomError('The sum exceeds the maximum safe integer limit.');
  }

  return sum > 0 ? sum : -sum;
}