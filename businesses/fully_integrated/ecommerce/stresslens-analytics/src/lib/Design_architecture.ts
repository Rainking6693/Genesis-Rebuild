import { BigInt } from 'big-int';

/**
 * Calculates the factorial of a number.
 * @param n - The number for which the factorial is to be calculated.
 * @returns The factorial of the given number as a BigInt.
 * @throws Error if the input is not a number, is NaN, or is negative.
 */
export async function factorial(n: number): Promise<BigInt> {
  // Check if the input is a number or NaN
  if (typeof n !== 'number' || isNaN(n)) {
    throw new Error('Input must be a valid number');
  }

  // Handle edge cases
  if (n < 0) {
    throw new Error('Input must be a non-negative number');
  }

  if (n === 0) {
    return BigInt(1);
  }

  if (n === 1) {
    return BigInt(1);
  }

  // Initialize the result as 1
  let result: BigInt = BigInt(1);

  // Multiply the result with each number from 2 to the input number
  for (let i = BigInt(2); i <= BigInt(n); i++) {
    result *= i;
  }

  // Return the result
  return result;
}

import { BigInt } from 'big-int';

/**
 * Calculates the factorial of a number.
 * @param n - The number for which the factorial is to be calculated.
 * @returns The factorial of the given number as a BigInt.
 * @throws Error if the input is not a number, is NaN, or is negative.
 */
export async function factorial(n: number): Promise<BigInt> {
  // Check if the input is a number or NaN
  if (typeof n !== 'number' || isNaN(n)) {
    throw new Error('Input must be a valid number');
  }

  // Handle edge cases
  if (n < 0) {
    throw new Error('Input must be a non-negative number');
  }

  if (n === 0) {
    return BigInt(1);
  }

  if (n === 1) {
    return BigInt(1);
  }

  // Initialize the result as 1
  let result: BigInt = BigInt(1);

  // Multiply the result with each number from 2 to the input number
  for (let i = BigInt(2); i <= BigInt(n); i++) {
    result *= i;
  }

  // Return the result
  return result;
}