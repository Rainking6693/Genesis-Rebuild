import { isNaN, isFinite } from 'math';

/**
 * Calculates the sum of two numbers.
 * Handles edge cases such as NaN, Infinity, negative numbers, zero division, large numbers, and rounding errors.
 *
 * @param num1 The first number.
 * @param num2 The second number.
 * @returns The sum of the two numbers.
 */
function calculateSum(num1: number, num2: number): number {
  // 1. Check correctness, completeness, and quality
  // Ensure that the function takes exactly two numbers as arguments
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // 2. Handle edge cases
  // Check for NaN, Infinity, negative numbers, zero division, large numbers, and rounding errors
  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Both arguments must be finite numbers.');
  }

  if (Number.isFinite(num1) && Number.isFinite(num2)) {
    // Check for zero division
    if (num2 === 0) {
      throw new Error('Division by zero is not allowed.');
    }

    // Check for large numbers
    if (num1 > Number.MAX_SAFE_INTEGER || num1 < Number.MIN_SAFE_INTEGER || num2 > Number.MAX_SAFE_INTEGER || num2 < Number.MIN_SAFE_INTEGER) {
      throw new Error('One or both arguments are too large to be safely represented as a number.');
    }

    // Check for rounding errors
    if (Math.abs(num1 - Math.round(num1)) > 0.000001 || Math.abs(num2 - Math.round(num2)) > 0.000001) {
      throw new Error('One or both arguments have a precision that is too low.');
    }

    // Calculate the sum of the two numbers
    const sum = num1 + num2;

    // Return the calculated sum
    return sum;
  } else {
    throw new Error('One or both arguments are not finite numbers.');
  }
}

import { isNaN, isFinite } from 'math';

/**
 * Calculates the sum of two numbers.
 * Handles edge cases such as NaN, Infinity, negative numbers, zero division, large numbers, and rounding errors.
 *
 * @param num1 The first number.
 * @param num2 The second number.
 * @returns The sum of the two numbers.
 */
function calculateSum(num1: number, num2: number): number {
  // 1. Check correctness, completeness, and quality
  // Ensure that the function takes exactly two numbers as arguments
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // 2. Handle edge cases
  // Check for NaN, Infinity, negative numbers, zero division, large numbers, and rounding errors
  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Both arguments must be finite numbers.');
  }

  if (Number.isFinite(num1) && Number.isFinite(num2)) {
    // Check for zero division
    if (num2 === 0) {
      throw new Error('Division by zero is not allowed.');
    }

    // Check for large numbers
    if (num1 > Number.MAX_SAFE_INTEGER || num1 < Number.MIN_SAFE_INTEGER || num2 > Number.MAX_SAFE_INTEGER || num2 < Number.MIN_SAFE_INTEGER) {
      throw new Error('One or both arguments are too large to be safely represented as a number.');
    }

    // Check for rounding errors
    if (Math.abs(num1 - Math.round(num1)) > 0.000001 || Math.abs(num2 - Math.round(num2)) > 0.000001) {
      throw new Error('One or both arguments have a precision that is too low.');
    }

    // Calculate the sum of the two numbers
    const sum = num1 + num2;

    // Return the calculated sum
    return sum;
  } else {
    throw new Error('One or both arguments are not finite numbers.');
  }
}