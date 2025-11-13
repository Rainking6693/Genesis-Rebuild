type FactorialResult = bigint;

/**
 * Calculates the factorial of a given non-negative number using recursion.
 *
 * @param {number} n - The non-negative number for which the factorial is to be calculated.
 * @returns {FactorialResult} The factorial of the given number.
 * @throws {Error} If the input number is negative or too large.
 */
export function calculateFactorial(n: number): FactorialResult {
  if (n < 0 || n > Number.MAX_SAFE_INTEGER) {
    throw new Error("Input number must be a non-negative number less than or equal to " + Number.MAX_SAFE_INTEGER);
  }

  // Base case: if n is 1, return 1
  if (n === 1) {
    return BigInt(1);
  }

  // Recursive case: multiply n by the factorial of (n - 1)
  return safeRecursion(n, BigInt(n));
}

function safeRecursion(n: number, result: FactorialResult): FactorialResult {
  if (n === 1) {
    return result;
  }

  return safeRecursion(n - 1, result * BigInt(n));
}

type FactorialResult = bigint;

/**
 * Calculates the factorial of a given non-negative number using recursion.
 *
 * @param {number} n - The non-negative number for which the factorial is to be calculated.
 * @returns {FactorialResult} The factorial of the given number.
 * @throws {Error} If the input number is negative or too large.
 */
export function calculateFactorial(n: number): FactorialResult {
  if (n < 0 || n > Number.MAX_SAFE_INTEGER) {
    throw new Error("Input number must be a non-negative number less than or equal to " + Number.MAX_SAFE_INTEGER);
  }

  // Base case: if n is 1, return 1
  if (n === 1) {
    return BigInt(1);
  }

  // Recursive case: multiply n by the factorial of (n - 1)
  return safeRecursion(n, BigInt(n));
}

function safeRecursion(n: number, result: FactorialResult): FactorialResult {
  if (n === 1) {
    return result;
  }

  return safeRecursion(n - 1, result * BigInt(n));
}