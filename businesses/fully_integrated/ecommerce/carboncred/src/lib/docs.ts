import { NumberFormatOptions } from 'intl';

/**
 * Function to calculate the sum of two numbers, ensuring security, performance, and maintainability.
 * This function is suitable for CarbonCred's ecommerce platform, as it is simple, secure, and efficient.
 *
 * @param {number} num1 First number to be added.
 * @param {number} num2 Second number to be added.
 * @returns {number} The sum of the two numbers, formatted for accessibility purposes.
 */
function addNumbers(num1: number, num2: number): string {
  // Input validation to ensure numbers are provided
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // Check for NaN values
  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Both arguments must be valid numbers.');
  }

  // Check for negative numbers and infinity/-infinity
  if (num1 < 0 || num2 < 0 || Number.isFinite(num1) !== true || Number.isFinite(num2) !== true) {
    throw new Error('Both arguments must be positive and finite numbers.');
  }

  // Return the sum of the two numbers, formatted for accessibility purposes
  const sum = num1 + num2;

  // Add error handling for large numbers
  if (sum > Number.MAX_SAFE_INTEGER) {
    throw new Error('The sum is too large to be represented as a number.');
  }

  // Use a consistent options object for number formatting
  const options: NumberFormatOptions = { maximumFractionDigits: 2 };

  // Return the formatted sum
  return sum.toLocaleString('en-US', options);
}

import { NumberFormatOptions } from 'intl';

/**
 * Function to calculate the sum of two numbers, ensuring security, performance, and maintainability.
 * This function is suitable for CarbonCred's ecommerce platform, as it is simple, secure, and efficient.
 *
 * @param {number} num1 First number to be added.
 * @param {number} num2 Second number to be added.
 * @returns {number} The sum of the two numbers, formatted for accessibility purposes.
 */
function addNumbers(num1: number, num2: number): string {
  // Input validation to ensure numbers are provided
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // Check for NaN values
  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Both arguments must be valid numbers.');
  }

  // Check for negative numbers and infinity/-infinity
  if (num1 < 0 || num2 < 0 || Number.isFinite(num1) !== true || Number.isFinite(num2) !== true) {
    throw new Error('Both arguments must be positive and finite numbers.');
  }

  // Return the sum of the two numbers, formatted for accessibility purposes
  const sum = num1 + num2;

  // Add error handling for large numbers
  if (sum > Number.MAX_SAFE_INTEGER) {
    throw new Error('The sum is too large to be represented as a number.');
  }

  // Use a consistent options object for number formatting
  const options: NumberFormatOptions = { maximumFractionDigits: 2 };

  // Return the formatted sum
  return sum.toLocaleString('en-US', options);
}