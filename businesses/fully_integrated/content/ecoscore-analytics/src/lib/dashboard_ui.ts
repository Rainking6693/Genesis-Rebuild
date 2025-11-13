import { isNaN } from 'math-expression-evaluator';

interface CalculationResult {
  success: boolean;
  value?: number;
  errorMessage?: string;
}

function calculateSum(num1: number | null | undefined, num2: number | null | undefined): CalculationResult {
  // Check correctness, completeness, and quality
  if (num1 === null || num1 === undefined || num2 === null || num2 === undefined) {
    return {
      success: false,
      errorMessage: 'Both arguments must be provided.',
    };
  }

  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    return {
      success: false,
      errorMessage: 'Both arguments must be numbers.',
    };
  }

  // Ensure consistency with business context (not applicable)

  // Apply security best practices
  // No sensitive data is involved in this function, so no specific security measures are needed.

  // Optimize performance
  // The function is already optimized for performance as it uses built-in TypeScript/JavaScript functions.

  // Improve maintainability
  // Adding comments and using descriptive variable names for better readability.
  const sum = num1 + num2;

  // Edge cases: handle infinity, NaN, negative numbers, division by zero, and overflow
  if (isNaN(sum)) {
    return {
      success: false,
      errorMessage: 'The result is not a valid number.',
    };
  }

  if (num1 < 0 || num2 < 0) {
    return {
      success: false,
      errorMessage: 'Both numbers must be non-negative.',
    };
  }

  if (num2 === 0 && num1 !== 0) {
    return {
      success: false,
      errorMessage: 'Division by zero is not allowed.',
    };
  }

  if (Number.isSafeInteger(sum)) {
    return {
      success: true,
      value: sum,
    };
  } else {
    return {
      success: false,
      errorMessage: 'The result is too large to be represented as a number.',
    };
  }
}

import { isNaN } from 'math-expression-evaluator';

interface CalculationResult {
  success: boolean;
  value?: number;
  errorMessage?: string;
}

function calculateSum(num1: number | null | undefined, num2: number | null | undefined): CalculationResult {
  // Check correctness, completeness, and quality
  if (num1 === null || num1 === undefined || num2 === null || num2 === undefined) {
    return {
      success: false,
      errorMessage: 'Both arguments must be provided.',
    };
  }

  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    return {
      success: false,
      errorMessage: 'Both arguments must be numbers.',
    };
  }

  // Ensure consistency with business context (not applicable)

  // Apply security best practices
  // No sensitive data is involved in this function, so no specific security measures are needed.

  // Optimize performance
  // The function is already optimized for performance as it uses built-in TypeScript/JavaScript functions.

  // Improve maintainability
  // Adding comments and using descriptive variable names for better readability.
  const sum = num1 + num2;

  // Edge cases: handle infinity, NaN, negative numbers, division by zero, and overflow
  if (isNaN(sum)) {
    return {
      success: false,
      errorMessage: 'The result is not a valid number.',
    };
  }

  if (num1 < 0 || num2 < 0) {
    return {
      success: false,
      errorMessage: 'Both numbers must be non-negative.',
    };
  }

  if (num2 === 0 && num1 !== 0) {
    return {
      success: false,
      errorMessage: 'Division by zero is not allowed.',
    };
  }

  if (Number.isSafeInteger(sum)) {
    return {
      success: true,
      value: sum,
    };
  } else {
    return {
      success: false,
      errorMessage: 'The result is too large to be represented as a number.',
    };
  }
}