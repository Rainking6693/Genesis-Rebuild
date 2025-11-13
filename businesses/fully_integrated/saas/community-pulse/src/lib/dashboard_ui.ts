import { assert, isNaN } from 'assert';
import { accessibile, internal } from 'your-accessibility-library';

@accessible
@internal
function addNumbers(num1: number | null | undefined, num2: number | null | undefined): number {
  // Ensure input validation
  assert(num1 !== null && num1 !== undefined, 'The first input must be a non-null number.');
  assert(num2 !== null && num2 !== undefined, 'The second input must be a non-null number.');

  // Check for NaN values
  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Both inputs must be finite numbers.');
  }

  // Check for Infinity and negative Infinity values
  if (Number.isFinite(num1) && Number.isFinite(num2)) {
    if (Number.isFinite(num1 + num2)) {
      // Perform the addition
      const result = num1 + num2;

      // Check for the maximum safe integer
      if (result > Number.MAX_SAFE_INTEGER) {
        throw new Error('The result is larger than the maximum safe integer.');
      }

      // Check for the minimum safe integer
      if (result < Number.MIN_SAFE_INTEGER) {
        throw new Error('The result is smaller than the minimum safe integer.');
      }

      // Check for the precision of the floating-point numbers
      if (Math.abs(result - (num1 + num2)) > Number.EPSILON) {
        throw new Error('The result has lost precision due to floating-point rounding errors.');
      }

      // Return the result
      return result;
    } else {
      throw new Error('The sum of the inputs is not a finite number.');
    }
  } else {
    throw new Error('Both inputs must be finite numbers.');
  }
}

import { assert, isNaN } from 'assert';
import { accessibile, internal } from 'your-accessibility-library';

@accessible
@internal
function addNumbers(num1: number | null | undefined, num2: number | null | undefined): number {
  // Ensure input validation
  assert(num1 !== null && num1 !== undefined, 'The first input must be a non-null number.');
  assert(num2 !== null && num2 !== undefined, 'The second input must be a non-null number.');

  // Check for NaN values
  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Both inputs must be finite numbers.');
  }

  // Check for Infinity and negative Infinity values
  if (Number.isFinite(num1) && Number.isFinite(num2)) {
    if (Number.isFinite(num1 + num2)) {
      // Perform the addition
      const result = num1 + num2;

      // Check for the maximum safe integer
      if (result > Number.MAX_SAFE_INTEGER) {
        throw new Error('The result is larger than the maximum safe integer.');
      }

      // Check for the minimum safe integer
      if (result < Number.MIN_SAFE_INTEGER) {
        throw new Error('The result is smaller than the minimum safe integer.');
      }

      // Check for the precision of the floating-point numbers
      if (Math.abs(result - (num1 + num2)) > Number.EPSILON) {
        throw new Error('The result has lost precision due to floating-point rounding errors.');
      }

      // Return the result
      return result;
    } else {
      throw new Error('The sum of the inputs is not a finite number.');
    }
  } else {
    throw new Error('Both inputs must be finite numbers.');
  }
}