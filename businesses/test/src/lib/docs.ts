import BigNumber from 'big-number';

/**
 * Calculates the factorial of a given number using BigNumber library for large numbers.
 *
 * @param {number} n - The number for which the factorial is to be calculated.
 * @returns {BigNumber} The factorial of the given number.
 * @throws {Error} If the input is not a non-negative number.
 */
export function factorial(n: number): BigNumber {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers.');
  }

  if (n === 0 || n === 1) {
    return BigNumber(1);
  }

  let result = BigNumber(1);

  for (let i = 2; i <= n; i++) {
    result = result.multipliedBy(i);
  }

  return result;
}

// Adding a type for the BigNumber instance to improve type safety
type BigNumberInstance = BigNumber<number>;

/**
 * Calculates the factorial of a given number using BigNumber library for large numbers.
 *
 * @param {number} n - The number for which the factorial is to be calculated.
 * @returns {BigNumberInstance} The factorial of the given number.
 * @throws {Error} If the input is not a non-negative number.
 */
export function factorial(n: number): BigNumberInstance {
  // Using named function to improve readability
  function validateInput(n: number): asserts n >= 0 {
    if (n < 0) {
      throw new Error('Factorial is not defined for negative numbers.');
    }
  }

  validateInput(n);

  if (n === 0 || n === 1) {
    return BigNumber(1);
  }

  let result = BigNumber(1);

  for (let i = 2; i <= n; i++) {
    result = result.multipliedBy(i);
  }

  return result;
}

import BigNumber from 'big-number';

/**
 * Calculates the factorial of a given number using BigNumber library for large numbers.
 *
 * @param {number} n - The number for which the factorial is to be calculated.
 * @returns {BigNumber} The factorial of the given number.
 * @throws {Error} If the input is not a non-negative number.
 */
export function factorial(n: number): BigNumber {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers.');
  }

  if (n === 0 || n === 1) {
    return BigNumber(1);
  }

  let result = BigNumber(1);

  for (let i = 2; i <= n; i++) {
    result = result.multipliedBy(i);
  }

  return result;
}

// Adding a type for the BigNumber instance to improve type safety
type BigNumberInstance = BigNumber<number>;

/**
 * Calculates the factorial of a given number using BigNumber library for large numbers.
 *
 * @param {number} n - The number for which the factorial is to be calculated.
 * @returns {BigNumberInstance} The factorial of the given number.
 * @throws {Error} If the input is not a non-negative number.
 */
export function factorial(n: number): BigNumberInstance {
  // Using named function to improve readability
  function validateInput(n: number): asserts n >= 0 {
    if (n < 0) {
      throw new Error('Factorial is not defined for negative numbers.');
    }
  }

  validateInput(n);

  if (n === 0 || n === 1) {
    return BigNumber(1);
  }

  let result = BigNumber(1);

  for (let i = 2; i <= n; i++) {
    result = result.multipliedBy(i);
  }

  return result;
}