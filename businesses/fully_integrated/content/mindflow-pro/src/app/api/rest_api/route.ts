import { CustomError } from './CustomError';

/**
 * Interface for valid number objects
 */
interface ValidNumber {
  value: number;
  isValid: boolean;
}

/**
 * Function to validate and normalize a number input
 * @param {any} input The input to validate
 * @returns {ValidNumber} An object containing the validated number and a boolean indicating if it's valid
 */
function validateNumber(input: any): ValidNumber {
  const number = Number.isFinite(input) ? input : 0;
  return { value: number, isValid: Number.isFinite(number) };
}

/**
 * Function to add two numbers and return the result
 * @param {ValidNumber} num1 First number
 * @param {ValidNumber} num2 Second number
 * @returns {ValidNumber} An object containing the sum and a boolean indicating if the operation was successful
 */
export function addNumbers(num1: ValidNumber, num2: ValidNumber): ValidNumber {
  // Check for correct input types
  if (!num1.isValid || !num2.isValid) {
    throw new CustomError('Both arguments must be numbers');
  }

  // Perform the operation and return the result
  const sum = num1.value + num2.value;
  return { value: sum, isValid: !isNaN(sum) };
}

/**
 * Function to subtract two numbers and return the result
 * @param {ValidNumber} num1 First number
 * @param {ValidNumber} num2 Second number
 * @returns {ValidNumber} An object containing the difference and a boolean indicating if the operation was successful
 */
export function subtractNumbers(num1: ValidNumber, num2: ValidNumber): ValidNumber {
  // Check for correct input types
  if (!num1.isValid || !num2.isValid) {
    throw new CustomError('Both arguments must be numbers');
  }

  // Perform the operation and return the result
  const difference = num1.value - num2.value;
  return { value: difference, isValid: !isNaN(difference) };
}

/**
 * Function to multiply two numbers and return the result
 * @param {ValidNumber} num1 First number
 * @param {ValidNumber} num2 Second number
 * @returns {ValidNumber} An object containing the product and a boolean indicating if the operation was successful
 */
export function multiplyNumbers(num1: ValidNumber, num2: ValidNumber): ValidNumber {
  // Check for correct input types
  if (!num1.isValid || !num2.isValid) {
    throw new CustomError('Both arguments must be numbers');
  }

  // Perform the operation and return the result
  const product = num1.value * num2.value;
  return { value: product, isValid: !isNaN(product) };
}

/**
 * Function to divide two numbers and return the result
 * @param {ValidNumber} num1 First number
 * @param {ValidNumber} num2 Second number
 * @returns {ValidNumber} An object containing the quotient and a boolean indicating if the operation was successful
 */
export function divideNumbers(num1: ValidNumber, num2: ValidNumber): ValidNumber {
  // Check for correct input types
  if (!num1.isValid || !num2.isValid) {
    throw new CustomError('Both arguments must be numbers');
  }

  // Perform the operation and return the result
  const quotient = num1.value / num2.value;
  return { value: quotient, isValid: !isNaN(quotient) };
}

/**
 * Function to validate and normalize a string input as a number
 * @param {string} input The input to validate
 * @returns {ValidNumber} An object containing the validated number and a boolean indicating if it's valid
 */
export function validateNumberFromString(input: string): ValidNumber {
  const number = Number.isFinite(parseFloat(input)) ? parseFloat(input) : 0;
  return { value: number, isValid: Number.isFinite(number) };
}

import { CustomError } from './CustomError';

/**
 * Interface for valid number objects
 */
interface ValidNumber {
  value: number;
  isValid: boolean;
}

/**
 * Function to validate and normalize a number input
 * @param {any} input The input to validate
 * @returns {ValidNumber} An object containing the validated number and a boolean indicating if it's valid
 */
function validateNumber(input: any): ValidNumber {
  const number = Number.isFinite(input) ? input : 0;
  return { value: number, isValid: Number.isFinite(number) };
}

/**
 * Function to add two numbers and return the result
 * @param {ValidNumber} num1 First number
 * @param {ValidNumber} num2 Second number
 * @returns {ValidNumber} An object containing the sum and a boolean indicating if the operation was successful
 */
export function addNumbers(num1: ValidNumber, num2: ValidNumber): ValidNumber {
  // Check for correct input types
  if (!num1.isValid || !num2.isValid) {
    throw new CustomError('Both arguments must be numbers');
  }

  // Perform the operation and return the result
  const sum = num1.value + num2.value;
  return { value: sum, isValid: !isNaN(sum) };
}

/**
 * Function to subtract two numbers and return the result
 * @param {ValidNumber} num1 First number
 * @param {ValidNumber} num2 Second number
 * @returns {ValidNumber} An object containing the difference and a boolean indicating if the operation was successful
 */
export function subtractNumbers(num1: ValidNumber, num2: ValidNumber): ValidNumber {
  // Check for correct input types
  if (!num1.isValid || !num2.isValid) {
    throw new CustomError('Both arguments must be numbers');
  }

  // Perform the operation and return the result
  const difference = num1.value - num2.value;
  return { value: difference, isValid: !isNaN(difference) };
}

/**
 * Function to multiply two numbers and return the result
 * @param {ValidNumber} num1 First number
 * @param {ValidNumber} num2 Second number
 * @returns {ValidNumber} An object containing the product and a boolean indicating if the operation was successful
 */
export function multiplyNumbers(num1: ValidNumber, num2: ValidNumber): ValidNumber {
  // Check for correct input types
  if (!num1.isValid || !num2.isValid) {
    throw new CustomError('Both arguments must be numbers');
  }

  // Perform the operation and return the result
  const product = num1.value * num2.value;
  return { value: product, isValid: !isNaN(product) };
}

/**
 * Function to divide two numbers and return the result
 * @param {ValidNumber} num1 First number
 * @param {ValidNumber} num2 Second number
 * @returns {ValidNumber} An object containing the quotient and a boolean indicating if the operation was successful
 */
export function divideNumbers(num1: ValidNumber, num2: ValidNumber): ValidNumber {
  // Check for correct input types
  if (!num1.isValid || !num2.isValid) {
    throw new CustomError('Both arguments must be numbers');
  }

  // Perform the operation and return the result
  const quotient = num1.value / num2.value;
  return { value: quotient, isValid: !isNaN(quotient) };
}

/**
 * Function to validate and normalize a string input as a number
 * @param {string} input The input to validate
 * @returns {ValidNumber} An object containing the validated number and a boolean indicating if it's valid
 */
export function validateNumberFromString(input: string): ValidNumber {
  const number = Number.isFinite(parseFloat(input)) ? parseFloat(input) : 0;
  return { value: number, isValid: Number.isFinite(number) };
}