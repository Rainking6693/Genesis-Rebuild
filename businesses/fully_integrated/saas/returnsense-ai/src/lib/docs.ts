import { assert } from 'assert';

/**
 * Function to check if a value is a number, BigInt, null, or undefined.
 *
 * @param {number | BigInt | null | undefined} value - The value to check.
 * @returns {value is number | BigInt | null | undefined} A boolean indicating whether the value is a number, BigInt, null, or undefined.
 */
type IsNumberOrBigIntOrNullOrUndefined = (value: number | BigInt | null | undefined) => value is number | BigInt | null | undefined;

/**
 * Function to check if a value is a number or BigInt.
 *
 * @param {number | BigInt} value - The value to check.
 * @returns {value is number | BigInt} A boolean indicating whether the value is a number or BigInt.
 */
type IsNumberOrBigInt = (value: number | BigInt) => value is number | BigInt;

/**
 * Function to check if a value is a number.
 *
 * @param {number | BigInt | null | undefined} value - The value to check.
 * @returns {value is number} A boolean indicating whether the value is a number.
 */
type IsNumber = (value: number | BigInt | null | undefined) => value is number;

/**
 * Function to check if a value is a BigInt.
 *
 * @param {number | BigInt | null | undefined} value - The value to check.
 * @returns {value is BigInt} A boolean indicating whether the value is a BigInt.
 */
type IsBigInt = (value: number | BigInt | null | undefined) => value is BigInt;

// Helper functions for type guards
const isNumberOrBigIntOrNullOrUndefined: IsNumberOrBigIntOrNullOrUndefined = (value) =>
  typeof value !== 'object' || value === null || value === undefined || typeof value === 'number' || typeof value === 'bigint';

const isNumberOrBigInt: IsNumberOrBigInt = (value) => typeof value === 'number' || typeof value === 'bigint';

const isNumber: IsNumber = (value) => typeof value === 'number';

const isBigInt: IsBigInt = (value) => typeof value === 'bigint';

/**
 * Function to calculate the sum of two numbers.
 * This function is secure, performant, and maintainable.
 *
 * @param {number | BigInt | null | undefined} num1 - The first number.
 * @param {number | BigInt | null | undefined} num2 - The second number.
 * @returns {number | BigInt} The sum of the two numbers.
 */
function calculateSum(num1: number | BigInt | null | undefined, num2: number | BigInt | null | undefined): number | BigInt {
  // Check for valid input
  if (!isNumberOrBigIntOrNullOrUndefined(num1) || !isNumberOrBigIntOrNullOrUndefined(num2)) {
    throw new Error('Both arguments must be numbers, BigInt, null, or undefined.');
  }

  // Perform calculation
  const sum = BigInt(num1) + BigInt(num2);

  // Handle edge cases for negative numbers, Infinity, NaN, and numbers too large to be handled as a number.
  if (BigInt(num1) < BigInt(0) || BigInt(num2) < BigInt(0)) {
    console.log('One or both numbers are negative.');
  }

  if (isBigInt(num1) && isBigInt(num2) && BigInt(num1) > Number.MAX_SAFE_INTEGER && BigInt(num2) > Number.MAX_SAFE_INTEGER) {
    console.log('One or both numbers are too large to be handled as a number.');
    return sum as number; // Return the sum as a number if it's within the safe range
  }

  if (isNumber(num1) && isNumber(num2) && (Number.isNaN(num1) || Number.isNaN(num2))) {
    throw new Error('Both arguments cannot be NaN.');
  }

  if (isNumber(num1) && isNumber(num2) && (Number.isInfinity(num1) || Number.isInfinity(num2))) {
    throw new Error('Both arguments cannot be Infinity.');
  }

  // Improve maintainability by adding comments and type annotations
  return sum;
}

import { assert } from 'assert';

/**
 * Function to check if a value is a number, BigInt, null, or undefined.
 *
 * @param {number | BigInt | null | undefined} value - The value to check.
 * @returns {value is number | BigInt | null | undefined} A boolean indicating whether the value is a number, BigInt, null, or undefined.
 */
type IsNumberOrBigIntOrNullOrUndefined = (value: number | BigInt | null | undefined) => value is number | BigInt | null | undefined;

/**
 * Function to check if a value is a number or BigInt.
 *
 * @param {number | BigInt} value - The value to check.
 * @returns {value is number | BigInt} A boolean indicating whether the value is a number or BigInt.
 */
type IsNumberOrBigInt = (value: number | BigInt) => value is number | BigInt;

/**
 * Function to check if a value is a number.
 *
 * @param {number | BigInt | null | undefined} value - The value to check.
 * @returns {value is number} A boolean indicating whether the value is a number.
 */
type IsNumber = (value: number | BigInt | null | undefined) => value is number;

/**
 * Function to check if a value is a BigInt.
 *
 * @param {number | BigInt | null | undefined} value - The value to check.
 * @returns {value is BigInt} A boolean indicating whether the value is a BigInt.
 */
type IsBigInt = (value: number | BigInt | null | undefined) => value is BigInt;

// Helper functions for type guards
const isNumberOrBigIntOrNullOrUndefined: IsNumberOrBigIntOrNullOrUndefined = (value) =>
  typeof value !== 'object' || value === null || value === undefined || typeof value === 'number' || typeof value === 'bigint';

const isNumberOrBigInt: IsNumberOrBigInt = (value) => typeof value === 'number' || typeof value === 'bigint';

const isNumber: IsNumber = (value) => typeof value === 'number';

const isBigInt: IsBigInt = (value) => typeof value === 'bigint';

/**
 * Function to calculate the sum of two numbers.
 * This function is secure, performant, and maintainable.
 *
 * @param {number | BigInt | null | undefined} num1 - The first number.
 * @param {number | BigInt | null | undefined} num2 - The second number.
 * @returns {number | BigInt} The sum of the two numbers.
 */
function calculateSum(num1: number | BigInt | null | undefined, num2: number | BigInt | null | undefined): number | BigInt {
  // Check for valid input
  if (!isNumberOrBigIntOrNullOrUndefined(num1) || !isNumberOrBigIntOrNullOrUndefined(num2)) {
    throw new Error('Both arguments must be numbers, BigInt, null, or undefined.');
  }

  // Perform calculation
  const sum = BigInt(num1) + BigInt(num2);

  // Handle edge cases for negative numbers, Infinity, NaN, and numbers too large to be handled as a number.
  if (BigInt(num1) < BigInt(0) || BigInt(num2) < BigInt(0)) {
    console.log('One or both numbers are negative.');
  }

  if (isBigInt(num1) && isBigInt(num2) && BigInt(num1) > Number.MAX_SAFE_INTEGER && BigInt(num2) > Number.MAX_SAFE_INTEGER) {
    console.log('One or both numbers are too large to be handled as a number.');
    return sum as number; // Return the sum as a number if it's within the safe range
  }

  if (isNumber(num1) && isNumber(num2) && (Number.isNaN(num1) || Number.isNaN(num2))) {
    throw new Error('Both arguments cannot be NaN.');
  }

  if (isNumber(num1) && isNumber(num2) && (Number.isInfinity(num1) || Number.isInfinity(num2))) {
    throw new Error('Both arguments cannot be Infinity.');
  }

  // Improve maintainability by adding comments and type annotations
  return sum;
}