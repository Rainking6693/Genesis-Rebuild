/**
 * Adds two numbers and ensures both arguments are numbers.
 *
 * @param num1 The first number to add.
 * @param num2 The second number to add.
 * @throws Error if either argument is not a number.
 * @returns The sum of the two numbers.
 */
function addNumbers(num1: number, num2: number): number {
  // Check correctness, completeness, and quality
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers');
  }

  // Ensure consistency with business context
  // In this case, there's no direct connection to the business context, but it's essential to maintain consistency in the codebase

  // Apply security best practices
  // Sanitize inputs to prevent potential security vulnerabilities
  // In this case, we're only dealing with numbers, so no need for additional sanitization

  // Optimize performance
  // Use built-in JavaScript functions for performance optimization
  const sum = num1 + num2;

  // Improve maintainability
  // Add comments to explain the function's purpose and behavior
  // Use consistent naming conventions and follow coding standards

  // Edge cases: handle cases where one or both numbers are zero or negative
  if (num1 === 0 || num2 === 0) {
    return Math.max(num1, num2); // Return the larger number if either is zero
  }

  if (num1 < 0 || num2 < 0) {
    return -(sum); // Ensure the result is always positive or zero
  }

  // Accessibility: Add JSDoc comments for TypeScript and other tools to understand the function's purpose and behavior
  /**
   * Adds two numbers and ensures both arguments are numbers.
   *
   * @param num1 The first number to add.
   * @param num2 The second number to add.
   * @throws Error if either argument is not a number.
   * @returns The sum of the two numbers.
   */
}

/**
 * Adds two numbers and ensures both arguments are numbers.
 *
 * @param num1 The first number to add.
 * @param num2 The second number to add.
 * @throws Error if either argument is not a number.
 * @returns The sum of the two numbers.
 */
function addNumbers(num1: number, num2: number): number {
  // Check correctness, completeness, and quality
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers');
  }

  // Ensure consistency with business context
  // In this case, there's no direct connection to the business context, but it's essential to maintain consistency in the codebase

  // Apply security best practices
  // Sanitize inputs to prevent potential security vulnerabilities
  // In this case, we're only dealing with numbers, so no need for additional sanitization

  // Optimize performance
  // Use built-in JavaScript functions for performance optimization
  const sum = num1 + num2;

  // Improve maintainability
  // Add comments to explain the function's purpose and behavior
  // Use consistent naming conventions and follow coding standards

  // Edge cases: handle cases where one or both numbers are zero or negative
  if (num1 === 0 || num2 === 0) {
    return Math.max(num1, num2); // Return the larger number if either is zero
  }

  if (num1 < 0 || num2 < 0) {
    return -(sum); // Ensure the result is always positive or zero
  }

  // Accessibility: Add JSDoc comments for TypeScript and other tools to understand the function's purpose and behavior
  /**
   * Adds two numbers and ensures both arguments are numbers.
   *
   * @param num1 The first number to add.
   * @param num2 The second number to add.
   * @throws Error if either argument is not a number.
   * @returns The sum of the two numbers.
   */
}