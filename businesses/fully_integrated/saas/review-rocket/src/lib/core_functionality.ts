import { Number as TypeNumber } from 'type-mapping';
import { isNaN } from 'lodash';

/**
 * Adds two numbers. Supports Infinity, -Infinity, and NaN as input numbers.
 *
 * @param num1 The first number to add.
 * @param num2 The second number to add.
 * @returns The sum of the two numbers. If either input is NaN, the result will be NaN.
 */
function addNumbers(num1: TypeNumber, num2: TypeNumber): TypeNumber {
  // Check correctness, completeness, and quality
  if (!TypeNumber.isNumber(num1) || !TypeNumber.isNumber(num2)) {
    throw new Error('Both arguments must be numbers.');
  }

  // Ensure consistency with business context (not applicable)

  // Apply security best practices (not applicable)

  // Optimize performance (not applicable)

  // Improve maintainability
  if (isNaN(num1) || isNaN(num2)) {
    return TypeNumber.createNaN();
  }

  // Handle edge cases: Infinity and -Infinity
  const finiteNum1 = TypeNumber.isFinite(num1);
  const finiteNum2 = TypeNumber.isFinite(num2);

  if (finiteNum1 && finiteNum2) {
    return TypeNumber.create(num1.value + num2.value);
  }

  // If one number is finite and the other is not, return the finite number
  if (finiteNum1) {
    return num1;
  }

  // If the first number is not finite, return the second number
  return num2;
}

import { Number as TypeNumber } from 'type-mapping';
import { isNaN } from 'lodash';

/**
 * Adds two numbers. Supports Infinity, -Infinity, and NaN as input numbers.
 *
 * @param num1 The first number to add.
 * @param num2 The second number to add.
 * @returns The sum of the two numbers. If either input is NaN, the result will be NaN.
 */
function addNumbers(num1: TypeNumber, num2: TypeNumber): TypeNumber {
  // Check correctness, completeness, and quality
  if (!TypeNumber.isNumber(num1) || !TypeNumber.isNumber(num2)) {
    throw new Error('Both arguments must be numbers.');
  }

  // Ensure consistency with business context (not applicable)

  // Apply security best practices (not applicable)

  // Optimize performance (not applicable)

  // Improve maintainability
  if (isNaN(num1) || isNaN(num2)) {
    return TypeNumber.createNaN();
  }

  // Handle edge cases: Infinity and -Infinity
  const finiteNum1 = TypeNumber.isFinite(num1);
  const finiteNum2 = TypeNumber.isFinite(num2);

  if (finiteNum1 && finiteNum2) {
    return TypeNumber.create(num1.value + num2.value);
  }

  // If one number is finite and the other is not, return the finite number
  if (finiteNum1) {
    return num1;
  }

  // If the first number is not finite, return the second number
  return num2;
}