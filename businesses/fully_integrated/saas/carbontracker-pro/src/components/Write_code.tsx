type FactorialResult = bigint | null;

function factorial(n: number): FactorialResult {
  // Check for valid input
  if (n < 0) {
    return null;
  }

  // Use BigInt for large numbers
  let result: bigint = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    result *= i;
  }

  return result;
}

const result = factorial(10);
if (result !== null) {
  console.log(result); // Output: 3628800
} else {
  console.log("Invalid input");
}

type FactorialResult = bigint | null;

function factorial(n: number): FactorialResult {
  // Check for valid input
  if (n < 0) {
    return null;
  }

  // Use BigInt for large numbers
  let result: bigint = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    result *= i;
  }

  return result;
}

const result = factorial(10);
if (result !== null) {
  console.log(result); // Output: 3628800
} else {
  console.log("Invalid input");
}

This function checks for negative input and uses BigInt for large numbers to avoid potential overflow issues. The function is also optimized by using a loop instead of recursion, which is more efficient for large inputs.

To make the function more accessible, you can add type annotations for the input and output parameters. This helps screen readers and other assistive technologies understand the function's purpose and expected input/output types.

For maintainability, the function is well-documented and easy to read. The use of type annotations and BigInt also makes it clear that the function is designed to handle large numbers, which is important for a SaaS business.

Edge cases are handled by checking for negative input and returning null in that case. The function also handles large numbers gracefully due to the use of BigInt.

You can call this function like this: