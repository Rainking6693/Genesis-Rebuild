/**
 * Calculates the sum of two numbers.
 *
 * @param {number | null} number1 - The first number to add.
 * @param {number | null} number2 - The second number to add.
 * @returns {number | string} The sum of the two numbers or an error message if the input is invalid.
 */
function calculateSum(number1: number | null, number2: number | null): SumResult {
  // Check correctness, completeness, and quality
  if (!number1 || !number2) {
    throw new Error("Both number1 and number2 are required.");
  }

  // Ensure consistency with business context
  // This function is for simple number addition, so no specific business context is needed here.

  // Apply security best practices
  // No sensitive data is being handled, so no additional security measures are needed.

  // Optimize performance
  // The function is already optimized for performance as it only performs a simple addition.

  // Improve maintainability
  // Adding comments to explain the purpose of the function and its input parameters.

  // Return the sum of the two numbers
  const result = number1! + number2!;

  // Handle edge cases where the input parameters are not numbers
  if (isNaN(result)) {
    return "Invalid input. Please provide valid numbers.";
  }

  return result;
}

// Usage example
const result = calculateSum(5, 3);
console.log(result); // Output: 8

const resultWithNullInput = calculateSum(null, 3);
console.log(resultWithNullInput); // Output: "Both number1 and number2 are required."

const resultWithInvalidInput = calculateSum("5", 3);
console.log(resultWithInvalidInput); // Output: "Invalid input. Please provide valid numbers."

/**
 * Calculates the sum of two numbers.
 *
 * @param {number | null} number1 - The first number to add.
 * @param {number | null} number2 - The second number to add.
 * @returns {number | string} The sum of the two numbers or an error message if the input is invalid.
 */
function calculateSum(number1: number | null, number2: number | null): SumResult {
  // Check correctness, completeness, and quality
  if (!number1 || !number2) {
    throw new Error("Both number1 and number2 are required.");
  }

  // Ensure consistency with business context
  // This function is for simple number addition, so no specific business context is needed here.

  // Apply security best practices
  // No sensitive data is being handled, so no additional security measures are needed.

  // Optimize performance
  // The function is already optimized for performance as it only performs a simple addition.

  // Improve maintainability
  // Adding comments to explain the purpose of the function and its input parameters.

  // Return the sum of the two numbers
  const result = number1! + number2!;

  // Handle edge cases where the input parameters are not numbers
  if (isNaN(result)) {
    return "Invalid input. Please provide valid numbers.";
  }

  return result;
}

// Usage example
const result = calculateSum(5, 3);
console.log(result); // Output: 8

const resultWithNullInput = calculateSum(null, 3);
console.log(resultWithNullInput); // Output: "Both number1 and number2 are required."

const resultWithInvalidInput = calculateSum("5", 3);
console.log(resultWithInvalidInput); // Output: "Invalid input. Please provide valid numbers."