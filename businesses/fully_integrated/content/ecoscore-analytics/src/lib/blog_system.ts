import { max, isNumber, isFinite, isInteger } from 'lodash';

// Function to validate the input and throw an error if it's not a positive integer
function validateInput(number: number): asserts number is PositiveInteger {
  if (!isNumber(number) || !isFinite(number) || number < 0 || !isInteger(number)) {
    throw new Error("Input must be a positive integer.");
  }
}

// Type for positive integers
type PositiveInteger = number & { __PositiveInteger: never };

// Function to generate EcoScore Factorial, taking a PositiveInteger as an argument and returning the factorial of that number.
// We use the lodash library to handle large numbers, as the native JavaScript BigInt is not supported in all browsers.
export function ecoScoreFactorial(number: PositiveInteger): number {
  validateInput(number);

  // Use lodash's max function to handle large numbers
  const maxIterations = max([number, 20]); // Limit the number of iterations to 20 to prevent potential stack overflow

  // Implement recursive calculation of factorial
  let result = 1;
  for (let i = 2; i <= maxIterations; i++) {
    if (number < i) break;
    result *= i;
  }

  // If the number is larger than the maxIterations, use lodash's factorial function
  if (number > maxIterations) {
    result = _.factorial(number);
  }

  // Return the calculated factorial
  return result;
}

import { max, isNumber, isFinite, isInteger } from 'lodash';

// Function to validate the input and throw an error if it's not a positive integer
function validateInput(number: number): asserts number is PositiveInteger {
  if (!isNumber(number) || !isFinite(number) || number < 0 || !isInteger(number)) {
    throw new Error("Input must be a positive integer.");
  }
}

// Type for positive integers
type PositiveInteger = number & { __PositiveInteger: never };

// Function to generate EcoScore Factorial, taking a PositiveInteger as an argument and returning the factorial of that number.
// We use the lodash library to handle large numbers, as the native JavaScript BigInt is not supported in all browsers.
export function ecoScoreFactorial(number: PositiveInteger): number {
  validateInput(number);

  // Use lodash's max function to handle large numbers
  const maxIterations = max([number, 20]); // Limit the number of iterations to 20 to prevent potential stack overflow

  // Implement recursive calculation of factorial
  let result = 1;
  for (let i = 2; i <= maxIterations; i++) {
    if (number < i) break;
    result *= i;
  }

  // If the number is larger than the maxIterations, use lodash's factorial function
  if (number > maxIterations) {
    result = _.factorial(number);
  }

  // Return the calculated factorial
  return result;
}