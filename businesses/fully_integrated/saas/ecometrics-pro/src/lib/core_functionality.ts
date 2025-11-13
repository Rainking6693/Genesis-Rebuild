import { max } from 'lodash';

type FactorialResult = {
  value: number;
  success: boolean;
  error?: string;
}

function calculateFactorial(n: number): FactorialResult {
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
    return { success: false, error: 'Invalid input. Please provide a non-negative integer.' };
  }

  let result = 1;
  let maxIterations = 1000;
  let currentIteration = 0;

  while (currentIteration < maxIterations && result < Number.MAX_SAFE_INTEGER) {
    result *= n--;
    currentIteration++;
  }

  if (currentIteration === maxIterations) {
    return { success: false, error: 'The factorial calculation exceeded the maximum allowed iterations.' };
  }

  return { success: true, value: result };
}

// Usage example
const result = calculateFactorial(5);
console.log(result); // { success: true, value: 120 }

import { max } from 'lodash';

type FactorialResult = {
  value: number;
  success: boolean;
  error?: string;
}

function calculateFactorial(n: number): FactorialResult {
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
    return { success: false, error: 'Invalid input. Please provide a non-negative integer.' };
  }

  let result = 1;
  let maxIterations = 1000;
  let currentIteration = 0;

  while (currentIteration < maxIterations && result < Number.MAX_SAFE_INTEGER) {
    result *= n--;
    currentIteration++;
  }

  if (currentIteration === maxIterations) {
    return { success: false, error: 'The factorial calculation exceeded the maximum allowed iterations.' };
  }

  return { success: true, value: result };
}

// Usage example
const result = calculateFactorial(5);
console.log(result); // { success: true, value: 120 }