import { Number as TypeNumber } from 'util';

/**
 * Function to calculate the sum of two numbers.
 * This function is designed to be used within the CreatorCRM SaaS platform, specifically in the audit_logs component.
 */
export function sumNumbers(num1: TypeNumber, num2: TypeNumber): TypeNumber {
  // Check for correct input types and validate the numbers are not NaN or Infinity
  if (typeof num1 !== 'number' || typeof num2 !== 'number' || isNaN(num1) || isNaN(num2)) {
    throw new Error('Invalid input. Please provide two valid numbers.');
  }

  // Ensure the numbers are finite, within a reasonable range, and not too large to prevent potential security issues
  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    throw new Error('Invalid input. Please provide two finite numbers.');
  }

  // Validate the numbers are within a reasonable range
  if (!isWithinReasonableRange(num1) || !isWithinReasonableRange(num2)) {
    throw new Error('Invalid input. Please provide two finite numbers within a reasonable range.');
  }

  // Calculate the sum and return it
  const sum = num1 + num2;
  return sum;
}

// Adding a helper function to validate the range of the numbers
function isWithinReasonableRange(number: TypeNumber): boolean {
  // You can adjust the minimum and maximum values as per your requirements
  const minValue = -1 * Number.MAX_SAFE_INTEGER;
  const maxValue = Number.MAX_SAFE_INTEGER;

  // Check if the number is within the reasonable range
  return number >= minValue && number <= maxValue;
}

import { Number as TypeNumber } from 'util';

/**
 * Function to calculate the sum of two numbers.
 * This function is designed to be used within the CreatorCRM SaaS platform, specifically in the audit_logs component.
 */
export function sumNumbers(num1: TypeNumber, num2: TypeNumber): TypeNumber {
  // Check for correct input types and validate the numbers are not NaN or Infinity
  if (typeof num1 !== 'number' || typeof num2 !== 'number' || isNaN(num1) || isNaN(num2)) {
    throw new Error('Invalid input. Please provide two valid numbers.');
  }

  // Ensure the numbers are finite, within a reasonable range, and not too large to prevent potential security issues
  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    throw new Error('Invalid input. Please provide two finite numbers.');
  }

  // Validate the numbers are within a reasonable range
  if (!isWithinReasonableRange(num1) || !isWithinReasonableRange(num2)) {
    throw new Error('Invalid input. Please provide two finite numbers within a reasonable range.');
  }

  // Calculate the sum and return it
  const sum = num1 + num2;
  return sum;
}

// Adding a helper function to validate the range of the numbers
function isWithinReasonableRange(number: TypeNumber): boolean {
  // You can adjust the minimum and maximum values as per your requirements
  const minValue = -1 * Number.MAX_SAFE_INTEGER;
  const maxValue = Number.MAX_SAFE_INTEGER;

  // Check if the number is within the reasonable range
  return number >= minValue && number <= maxValue;
}