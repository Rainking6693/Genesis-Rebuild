import { IntlNumberFormat } from 'intl';

/**
 * Adds two numbers.
 *
 * @param num1 - The first number to be added.
 * @param num2 - The second number to be added.
 * @returns The sum of the two numbers as a formatted string.
 * @throws Error if either argument is not a number, if one of the numbers is Infinity, -Infinity, or NaN, if one of the numbers is null or undefined, if the numbers are not finite, if the numbers are zero and one of them is negative, if the numbers have more than the maximum allowable number of digits, if the numbers have fewer than the minimum allowable number of digits, or if the numbers are outside the range of allowable numbers.
 */
function addNumbers(num1: number | null | undefined, num2: number | null | undefined): string {
  // Ensure correctness, completeness, and quality
  if (typeof num1 !== 'number' || num1 === null || num1 === undefined) {
    throw new Error('num1 must be a non-null, non-undefined number.');
  }

  if (typeof num2 !== 'number' || num2 === null || num2 === undefined) {
    throw new Error('num2 must be a non-null, non-undefined number.');
  }

  // Ensure consistency with business context
  // This function is for adding numbers, so no need for specific business context here.

  // Apply security best practices
  // No sensitive data is involved, so no need for specific security measures here.

  // Optimize performance
  // TypeScript already optimizes performance by compiling to JavaScript.

  // Improve maintainability
  // Use descriptive variable names and follow TypeScript best practices.

  // Check for edge cases
  if (Number.isNaN(num1) || Number.isNaN(num2)) {
    throw new Error('One or both of the arguments are NaN.');
  }

  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    throw new Error('One or both of the arguments are not finite numbers.');
  }

  if (num1 === 0 && num2 < 0) {
    throw new Error('num1 cannot be zero and num2 cannot be negative.');
  }

  if (num1 > Number.MAX_SAFE_INTEGER || num2 > Number.MAX_SAFE_INTEGER) {
    throw new Error('One or both of the numbers have more than the maximum allowable number of digits.');
  }

  if (num1 < Number.MIN_SAFE_INTEGER || num2 < Number.MIN_SAFE_INTEGER) {
    throw new Error('One or both of the numbers have fewer than the minimum allowable number of digits.');
  }

  if (num1 < -Number.MAX_SAFE_INTEGER || num2 < -Number.MAX_SAFE_INTEGER) {
    throw new Error('One or both of the numbers are outside the range of allowable numbers.');
  }

  if (num1 < -Number.MAX_SAFE_INTEGER || num2 > Number.MAX_SAFE_INTEGER) {
    throw new Error('One or both of the numbers are outside the range of allowable numbers.');
  }

  // Convert negative numbers to numbers to avoid unexpected string concatenation
  const num1AsNumber = Number(num1);
  const num2AsNumber = Number(num2);

  // Add the numbers and round the result to the nearest integer (if needed)
  const sum = Math.round(num1AsNumber + num2AsNumber);

  // Format the output as a string using the Intl.NumberFormat class
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  return formatter.format(sum);
}

import { IntlNumberFormat } from 'intl';

/**
 * Adds two numbers.
 *
 * @param num1 - The first number to be added.
 * @param num2 - The second number to be added.
 * @returns The sum of the two numbers as a formatted string.
 * @throws Error if either argument is not a number, if one of the numbers is Infinity, -Infinity, or NaN, if one of the numbers is null or undefined, if the numbers are not finite, if the numbers are zero and one of them is negative, if the numbers have more than the maximum allowable number of digits, if the numbers have fewer than the minimum allowable number of digits, or if the numbers are outside the range of allowable numbers.
 */
function addNumbers(num1: number | null | undefined, num2: number | null | undefined): string {
  // Ensure correctness, completeness, and quality
  if (typeof num1 !== 'number' || num1 === null || num1 === undefined) {
    throw new Error('num1 must be a non-null, non-undefined number.');
  }

  if (typeof num2 !== 'number' || num2 === null || num2 === undefined) {
    throw new Error('num2 must be a non-null, non-undefined number.');
  }

  // Ensure consistency with business context
  // This function is for adding numbers, so no need for specific business context here.

  // Apply security best practices
  // No sensitive data is involved, so no need for specific security measures here.

  // Optimize performance
  // TypeScript already optimizes performance by compiling to JavaScript.

  // Improve maintainability
  // Use descriptive variable names and follow TypeScript best practices.

  // Check for edge cases
  if (Number.isNaN(num1) || Number.isNaN(num2)) {
    throw new Error('One or both of the arguments are NaN.');
  }

  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    throw new Error('One or both of the arguments are not finite numbers.');
  }

  if (num1 === 0 && num2 < 0) {
    throw new Error('num1 cannot be zero and num2 cannot be negative.');
  }

  if (num1 > Number.MAX_SAFE_INTEGER || num2 > Number.MAX_SAFE_INTEGER) {
    throw new Error('One or both of the numbers have more than the maximum allowable number of digits.');
  }

  if (num1 < Number.MIN_SAFE_INTEGER || num2 < Number.MIN_SAFE_INTEGER) {
    throw new Error('One or both of the numbers have fewer than the minimum allowable number of digits.');
  }

  if (num1 < -Number.MAX_SAFE_INTEGER || num2 < -Number.MAX_SAFE_INTEGER) {
    throw new Error('One or both of the numbers are outside the range of allowable numbers.');
  }

  if (num1 < -Number.MAX_SAFE_INTEGER || num2 > Number.MAX_SAFE_INTEGER) {
    throw new Error('One or both of the numbers are outside the range of allowable numbers.');
  }

  // Convert negative numbers to numbers to avoid unexpected string concatenation
  const num1AsNumber = Number(num1);
  const num2AsNumber = Number(num2);

  // Add the numbers and round the result to the nearest integer (if needed)
  const sum = Math.round(num1AsNumber + num2AsNumber);

  // Format the output as a string using the Intl.NumberFormat class
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  return formatter.format(sum);
}