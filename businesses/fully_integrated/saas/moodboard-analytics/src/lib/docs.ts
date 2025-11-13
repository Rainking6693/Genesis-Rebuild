/**
 * Adds two numbers safely.
 *
 * @param num1 - The first number to add.
 * @param num2 - The second number to add.
 * @returns The sum of the two numbers.
 * @throws Error if either input is not a number, is NaN, is Infinity, is null, is undefined, or if the inputs are out of a reasonable range or are negative numbers.
 */
async function safeAddNumbers(num1: number | BigInt | null | undefined, num2: number | BigInt | null | undefined): Promise<number | BigInt> {
  // Ensure input validation and type safety
  if (num1 === null || num1 === undefined) {
    throw new Error('The first input must not be null or undefined.');
  }

  if (num2 === null || num2 === undefined) {
    throw new Error('The second input must not be null or undefined.');
  }

  if (typeof num1 !== 'number' && typeof num1 !== 'bigint') {
    throw new Error('The first input must be a number or a BigInt.');
  }

  if (typeof num2 !== 'number' && typeof num2 !== 'bigint') {
    throw new Error('The second input must be a number or a BigInt.');
  }

  if (Number.isNaN(num1)) {
    throw new Error('The first input is NaN.');
  }

  if (Number.isNaN(num2)) {
    throw new Error('The second input is NaN.');
  }

  if (Number.isFinite(num1) === false) {
    throw new Error('The first input is not a finite number.');
  }

  if (Number.isFinite(num2) === false) {
    throw new Error('The second input is not a finite number.');
  }

  // Ensure the inputs are within a reasonable range
  const minInput = Math.min(Number.MAX_SAFE_INTEGER, Math.min(Number(num1), Number(num2)));
  const maxInput = Math.max(Number.MIN_SAFE_INTEGER, Math.max(Number(num1), Number(num2)));
  if (minInput < -Number.MAX_SAFE_INTEGER || maxInput > Number.MAX_SAFE_INTEGER) {
    throw new Error('One or both inputs are too large or too small.');
  }

  // Ensure the inputs are not negative numbers
  if (Number(num1) < 0 || Number(num2) < 0) {
    throw new Error('Both inputs must not be negative numbers.');
  }

  // Implement the function
  return typeof num1 === 'number' ? (num1 as number + num2 as number) : (BigInt(num1) + BigInt(num2));
}

// Usage example
(async () => {
  try {
    const sum = await safeAddNumbers(5n, 3);
    console.log(sum); // Output: 8n
  } catch (error) {
    console.error(error.message);
  }
})();

/**
 * Adds two numbers safely.
 *
 * @param num1 - The first number to add.
 * @param num2 - The second number to add.
 * @returns The sum of the two numbers.
 * @throws Error if either input is not a number, is NaN, is Infinity, is null, is undefined, or if the inputs are out of a reasonable range or are negative numbers.
 */
async function safeAddNumbers(num1: number | BigInt | null | undefined, num2: number | BigInt | null | undefined): Promise<number | BigInt> {
  // Ensure input validation and type safety
  if (num1 === null || num1 === undefined) {
    throw new Error('The first input must not be null or undefined.');
  }

  if (num2 === null || num2 === undefined) {
    throw new Error('The second input must not be null or undefined.');
  }

  if (typeof num1 !== 'number' && typeof num1 !== 'bigint') {
    throw new Error('The first input must be a number or a BigInt.');
  }

  if (typeof num2 !== 'number' && typeof num2 !== 'bigint') {
    throw new Error('The second input must be a number or a BigInt.');
  }

  if (Number.isNaN(num1)) {
    throw new Error('The first input is NaN.');
  }

  if (Number.isNaN(num2)) {
    throw new Error('The second input is NaN.');
  }

  if (Number.isFinite(num1) === false) {
    throw new Error('The first input is not a finite number.');
  }

  if (Number.isFinite(num2) === false) {
    throw new Error('The second input is not a finite number.');
  }

  // Ensure the inputs are within a reasonable range
  const minInput = Math.min(Number.MAX_SAFE_INTEGER, Math.min(Number(num1), Number(num2)));
  const maxInput = Math.max(Number.MIN_SAFE_INTEGER, Math.max(Number(num1), Number(num2)));
  if (minInput < -Number.MAX_SAFE_INTEGER || maxInput > Number.MAX_SAFE_INTEGER) {
    throw new Error('One or both inputs are too large or too small.');
  }

  // Ensure the inputs are not negative numbers
  if (Number(num1) < 0 || Number(num2) < 0) {
    throw new Error('Both inputs must not be negative numbers.');
  }

  // Implement the function
  return typeof num1 === 'number' ? (num1 as number + num2 as number) : (BigInt(num1) + BigInt(num2));
}

// Usage example
(async () => {
  try {
    const sum = await safeAddNumbers(5n, 3);
    console.log(sum); // Output: 8n
  } catch (error) {
    console.error(error.message);
  }
})();