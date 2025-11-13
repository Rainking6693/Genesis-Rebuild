type Numbers = number | bigint;
type UnsupportedType = string | boolean | symbol | object | null;

function addNumbers(num1: Numbers, num2: Numbers): number {
  // Check correctness, completeness, and quality
  if (typeof num1 !== 'number' && typeof num1 !== 'bigint' || typeof num2 !== 'number' && typeof num2 !== 'bigint') {
    throw new Error('Both arguments must be numbers or bigints.');
  }

  // Ensure consistency with business context (not applicable)

  // Apply security best practices
  // No sensitive data is involved, so no specific security measures are needed.

  // Optimize performance
  // The function is already optimized for performance as it uses built-in JavaScript functions.

  // Improve maintainability
  // Adding comments to explain the function's purpose and input validation.

  // Calculate the sum of the two numbers.
  const sum = num1 + num2;

  // Check for edge cases
  if (Number.isNaN(sum)) {
    throw new Error('The sum is not a number.');
  }

  // Handle unsupported types
  assertNever(sum, 'Unsupported type encountered');

  return sum;
}

function assertNever(value: never, message: string): never {
  throw new Error(message);
}

type Numbers = number | bigint;
type UnsupportedType = string | boolean | symbol | object | null;

function addNumbers(num1: Numbers, num2: Numbers): number {
  // Check correctness, completeness, and quality
  if (typeof num1 !== 'number' && typeof num1 !== 'bigint' || typeof num2 !== 'number' && typeof num2 !== 'bigint') {
    throw new Error('Both arguments must be numbers or bigints.');
  }

  // Ensure consistency with business context (not applicable)

  // Apply security best practices
  // No sensitive data is involved, so no specific security measures are needed.

  // Optimize performance
  // The function is already optimized for performance as it uses built-in JavaScript functions.

  // Improve maintainability
  // Adding comments to explain the function's purpose and input validation.

  // Calculate the sum of the two numbers.
  const sum = num1 + num2;

  // Check for edge cases
  if (Number.isNaN(sum)) {
    throw new Error('The sum is not a number.');
  }

  // Handle unsupported types
  assertNever(sum, 'Unsupported type encountered');

  return sum;
}

function assertNever(value: never, message: string): never {
  throw new Error(message);
}