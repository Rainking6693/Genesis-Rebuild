import { BigInt, BigIntIsh } from 'big-int';

/**
 * Function to calculate the sum of two numbers with optional precision.
 * This function is safe, efficient, and easy to maintain.
 *
 * @param num1 - First number
 * @param num2 - Second number
 * @param precision - The number of decimal places to round the result (optional)
 * @returns The sum of the two numbers
 */
export function calculateSum(num1: number | BigInt, num2: number | BigInt, precision?: number): number | BigInt {
  // Type guard to ensure the provided arguments are numbers or BigInt
  if (BigIntIsh(num1) && BigIntIsh(num2)) {
    const bigNum1 = BigInt(num1);
    const bigNum2 = BigInt(num2);

    // Check for NaN after the sum calculation
    const sum = bigNum1 + bigNum2;
    if (Number.isNaN(sum)) {
      throw new Error('The sum is not a valid number.');
    }

    // Check for Infinity or -Infinity
    if (sum > BigInt(Number.MAX_SAFE_INTEGER) || sum < BigInt(Number.MIN_SAFE_INTEGER)) {
      return sum;
    }

    // Round the result if precision is provided
    if (precision) {
      return Number(sum.toString().slice(0, precision + 1));
    }

    return sum;
  }

  // Input validation to ensure numbers are provided
  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    throw new Error('Both arguments must be numbers or BigInt.');
  }

  // Check for NaN, Infinity, -Infinity, undefined, null, and out-of-range values
  if (Number.isNaN(num1) || Number.isNaN(num2) || num1 === Infinity || num1 === -Infinity || num2 === Infinity || num2 === -Infinity || num1 === null || num1 === undefined || num2 === null || num2 === undefined) {
    throw new Error('Invalid arguments provided.');
  }

  // Calculate the sum and return it
  return num1 + num2;
}

// Add a type for the precision parameter to ensure it's a non-negative number
type Precision = number & { __type: 'precision' };

/**
 * Function to validate the precision parameter.
 * This function ensures the precision is a non-negative number.
 *
 * @param precision - The precision to validate
 * @returns The validated precision
 */
function validatePrecision(precision: number): Precision {
  if (precision < 0) {
    throw new Error('Precision must be a non-negative number.');
  }
  return precision as Precision;
}

/**
 * Function to calculate the sum of two numbers with optional precision.
 * This function is safe, efficient, and easy to maintain.
 *
 * @param num1 - First number
 * @param num2 - Second number
 * @param precision - The number of decimal places to round the result (optional)
 * @returns The sum of the two numbers
 */
export function calculateSum(num1: number | BigInt, num2: number | BigInt, precision?: number): number | BigInt {
  // Validate the precision parameter
  const validatedPrecision = precision ? validatePrecision(precision) : undefined;

  // Type guard to ensure the provided arguments are numbers or BigInt
  if (BigIntIsh(num1) && BigIntIsh(num2)) {
    const bigNum1 = BigInt(num1);
    const bigNum2 = BigInt(num2);

    // Check for NaN after the sum calculation
    const sum = bigNum1 + bigNum2;
    if (Number.isNaN(sum)) {
      throw new Error('The sum is not a valid number.');
    }

    // Check for Infinity or -Infinity
    if (sum > BigInt(Number.MAX_SAFE_INTEGER) || sum < BigInt(Number.MIN_SAFE_INTEGER)) {
      return sum;
    }

    // Round the result if precision is provided
    if (validatedPrecision) {
      return Number(sum.toString().slice(0, validatedPrecision + 1));
    }

    return sum;
  }

  // Input validation to ensure numbers are provided
  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    throw new Error('Both arguments must be numbers or BigInt.');
  }

  // Check for NaN, Infinity, -Infinity, undefined, null, and out-of-range values
  if (Number.isNaN(num1) || Number.isNaN(num2) || num1 === Infinity || num1 === -Infinity || num2 === Infinity || num2 === -Infinity || num1 === null || num1 === undefined || num2 === null || num2 === undefined) {
    throw new Error('Invalid arguments provided.');
  }

  // Calculate the sum and return it
  return num1 + num2;
}

import { BigInt, BigIntIsh } from 'big-int';

/**
 * Function to calculate the sum of two numbers with optional precision.
 * This function is safe, efficient, and easy to maintain.
 *
 * @param num1 - First number
 * @param num2 - Second number
 * @param precision - The number of decimal places to round the result (optional)
 * @returns The sum of the two numbers
 */
export function calculateSum(num1: number | BigInt, num2: number | BigInt, precision?: number): number | BigInt {
  // Type guard to ensure the provided arguments are numbers or BigInt
  if (BigIntIsh(num1) && BigIntIsh(num2)) {
    const bigNum1 = BigInt(num1);
    const bigNum2 = BigInt(num2);

    // Check for NaN after the sum calculation
    const sum = bigNum1 + bigNum2;
    if (Number.isNaN(sum)) {
      throw new Error('The sum is not a valid number.');
    }

    // Check for Infinity or -Infinity
    if (sum > BigInt(Number.MAX_SAFE_INTEGER) || sum < BigInt(Number.MIN_SAFE_INTEGER)) {
      return sum;
    }

    // Round the result if precision is provided
    if (precision) {
      return Number(sum.toString().slice(0, precision + 1));
    }

    return sum;
  }

  // Input validation to ensure numbers are provided
  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    throw new Error('Both arguments must be numbers or BigInt.');
  }

  // Check for NaN, Infinity, -Infinity, undefined, null, and out-of-range values
  if (Number.isNaN(num1) || Number.isNaN(num2) || num1 === Infinity || num1 === -Infinity || num2 === Infinity || num2 === -Infinity || num1 === null || num1 === undefined || num2 === null || num2 === undefined) {
    throw new Error('Invalid arguments provided.');
  }

  // Calculate the sum and return it
  return num1 + num2;
}

// Add a type for the precision parameter to ensure it's a non-negative number
type Precision = number & { __type: 'precision' };

/**
 * Function to validate the precision parameter.
 * This function ensures the precision is a non-negative number.
 *
 * @param precision - The precision to validate
 * @returns The validated precision
 */
function validatePrecision(precision: number): Precision {
  if (precision < 0) {
    throw new Error('Precision must be a non-negative number.');
  }
  return precision as Precision;
}

/**
 * Function to calculate the sum of two numbers with optional precision.
 * This function is safe, efficient, and easy to maintain.
 *
 * @param num1 - First number
 * @param num2 - Second number
 * @param precision - The number of decimal places to round the result (optional)
 * @returns The sum of the two numbers
 */
export function calculateSum(num1: number | BigInt, num2: number | BigInt, precision?: number): number | BigInt {
  // Validate the precision parameter
  const validatedPrecision = precision ? validatePrecision(precision) : undefined;

  // Type guard to ensure the provided arguments are numbers or BigInt
  if (BigIntIsh(num1) && BigIntIsh(num2)) {
    const bigNum1 = BigInt(num1);
    const bigNum2 = BigInt(num2);

    // Check for NaN after the sum calculation
    const sum = bigNum1 + bigNum2;
    if (Number.isNaN(sum)) {
      throw new Error('The sum is not a valid number.');
    }

    // Check for Infinity or -Infinity
    if (sum > BigInt(Number.MAX_SAFE_INTEGER) || sum < BigInt(Number.MIN_SAFE_INTEGER)) {
      return sum;
    }

    // Round the result if precision is provided
    if (validatedPrecision) {
      return Number(sum.toString().slice(0, validatedPrecision + 1));
    }

    return sum;
  }

  // Input validation to ensure numbers are provided
  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    throw new Error('Both arguments must be numbers or BigInt.');
  }

  // Check for NaN, Infinity, -Infinity, undefined, null, and out-of-range values
  if (Number.isNaN(num1) || Number.isNaN(num2) || num1 === Infinity || num1 === -Infinity || num2 === Infinity || num2 === -Infinity || num1 === null || num1 === undefined || num2 === null || num2 === undefined) {
    throw new Error('Invalid arguments provided.');
  }

  // Calculate the sum and return it
  return num1 + num2;
}