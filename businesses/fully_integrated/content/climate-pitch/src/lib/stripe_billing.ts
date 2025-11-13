type ErrorMessage = `Error: ${string}`;
type NumberOrNull = number | null | undefined;

/**
 * Function to check if a value is a valid number (including null and undefined)
 * @param {NumberOrNull} value - The value to check
 * @returns {value is number} True if the value is a number, false otherwise
 */
export function isValidNumber(value: NumberOrNull): value is number {
  return (
    typeof value === 'number' &&
    !isNaN(value) &&
    value !== Infinity &&
    value !== -Infinity
  );
}

/**
 * Function to format the error message for better accessibility
 * @param {string} message - The error message
 * @returns {Error} The formatted error object
 */
export function formatError(message: string): Error {
  return new Error(`Error: ${message}`);
}

/**
 * Function to calculate the sum of two numbers
 * @param {NumberOrNull} num1 - The first number
 * @param {NumberOrNull} num2 - The second number
 * @returns {number} The sum of the two numbers or throws an error if the input is invalid
 */
export function calculateSum(num1: NumberOrNull, num2: NumberOrNull): number {
  // Validate input
  if (!isValidNumber(num1) || !isValidNumber(num2)) {
    throw formatError('Both arguments must be valid numbers');
  }

  // Perform calculation and return the result
  const num1AsNumber = Number(num1);
  const num2AsNumber = Number(num2);
  return num1AsNumber + num2AsNumber;
}

type ErrorMessage = `Error: ${string}`;
type NumberOrNull = number | null | undefined;

/**
 * Function to check if a value is a valid number (including null and undefined)
 * @param {NumberOrNull} value - The value to check
 * @returns {value is number} True if the value is a number, false otherwise
 */
export function isValidNumber(value: NumberOrNull): value is number {
  return (
    typeof value === 'number' &&
    !isNaN(value) &&
    value !== Infinity &&
    value !== -Infinity
  );
}

/**
 * Function to format the error message for better accessibility
 * @param {string} message - The error message
 * @returns {Error} The formatted error object
 */
export function formatError(message: string): Error {
  return new Error(`Error: ${message}`);
}

/**
 * Function to calculate the sum of two numbers
 * @param {NumberOrNull} num1 - The first number
 * @param {NumberOrNull} num2 - The second number
 * @returns {number} The sum of the two numbers or throws an error if the input is invalid
 */
export function calculateSum(num1: NumberOrNull, num2: NumberOrNull): number {
  // Validate input
  if (!isValidNumber(num1) || !isValidNumber(num2)) {
    throw formatError('Both arguments must be valid numbers');
  }

  // Perform calculation and return the result
  const num1AsNumber = Number(num1);
  const num2AsNumber = Number(num2);
  return num1AsNumber + num2AsNumber;
}