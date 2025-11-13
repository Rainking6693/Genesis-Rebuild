/**
 * Adds two numbers and returns the sum.
 *
 * @param num1 - The first number to be added.
 * @param num2 - The second number to be added.
 *
 * @throws Error if either argument is not a number.
 * @throws Error if either number is zero or negative.
 * @throws Error if the sum exceeds the maximum safe integer (Number.MAX_SAFE_INTEGER).
 *
 * @returns The sum of the two numbers.
 */
function addTwoNumbers(num1: number, num2: number): number {
  // Check correctness, completeness, and quality
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // Ensure consistency with business context
  // In this case, there is no specific business context, so no changes are needed.

  // Apply security best practices
  // No sensitive data is involved, so no additional security measures are needed.

  // Optimize performance
  // TypeScript is already optimized for performance, so no changes are needed.

  // Improve maintainability
  // Use descriptive variable names and follow TypeScript best practices.
  if (num1 === 0 || num2 === 0) {
    throw new Error('Cannot add zero to a number.');
  }

  if (num1 < 0 || num2 < 0) {
    throw new Error('Cannot add negative numbers.');
  }

  const sum: number = num1 + num2;

  // Check for edge cases: maximum safe integer
  if (sum > Number.MAX_SAFE_INTEGER) {
    throw new Error('The sum exceeds the maximum safe integer.');
  }

  return sum;
}

/**
 * Adds two numbers and returns the sum.
 *
 * @param num1 - The first number to be added.
 * @param num2 - The second number to be added.
 *
 * @throws Error if either argument is not a number.
 * @throws Error if either number is zero or negative.
 * @throws Error if the sum exceeds the maximum safe integer (Number.MAX_SAFE_INTEGER).
 *
 * @returns The sum of the two numbers.
 */
function addTwoNumbers(num1: number, num2: number): number {
  // Check correctness, completeness, and quality
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('Both arguments must be numbers.');
  }

  // Ensure consistency with business context
  // In this case, there is no specific business context, so no changes are needed.

  // Apply security best practices
  // No sensitive data is involved, so no additional security measures are needed.

  // Optimize performance
  // TypeScript is already optimized for performance, so no changes are needed.

  // Improve maintainability
  // Use descriptive variable names and follow TypeScript best practices.
  if (num1 === 0 || num2 === 0) {
    throw new Error('Cannot add zero to a number.');
  }

  if (num1 < 0 || num2 < 0) {
    throw new Error('Cannot add negative numbers.');
  }

  const sum: number = num1 + num2;

  // Check for edge cases: maximum safe integer
  if (sum > Number.MAX_SAFE_INTEGER) {
    throw new Error('The sum exceeds the maximum safe integer.');
  }

  return sum;
}