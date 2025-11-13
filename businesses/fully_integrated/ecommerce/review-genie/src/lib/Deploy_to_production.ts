import { max } from 'lodash';

type FactorialOptions = {
  maxIterations?: number;
  maxValue?: number;
};

/**
 * Calculates the factorial of a given number with optional resiliency options.
 * @param {number} n - The number for which the factorial is to be calculated.
 * @param {FactorialOptions} options - Optional resiliency options.
 * @returns {number} The factorial of the given number.
 */
function factorial(n: number, options: FactorialOptions = {}): number {
  if (n < 0) {
    throw new Error("Factorial is not defined for negative numbers.");
  }

  if (n === 0 || n === 1) {
    return 1;
  }

  const { maxIterations = 10000, maxValue = Number.MAX_SAFE_INTEGER } = options;
  let result = 1;
  let i = 2;

  while (i <= n && result < maxValue) {
    result *= i;
    i++;

    if (i >= maxIterations) {
      throw new Error(`Factorial calculation exceeded the maximum iterations (${maxIterations}).`);
    }
  }

  return result;
}

// Added type definitions for BigInt and BigInt64Array
declare global {
  namespace NodeJS {
    interface Global {
      BigInt: {
        prototype: {
          toString(): string;
        };
      };
      BigInt64Array: new (...args: any[]) => BigInt64Array;
    }
  }
}

// Added support for BigInt and BigInt64Array
function factorial(n: bigint, options: FactorialOptions = {}): bigint {
  if (BigInt(n) < BigInt(0)) {
    throw new Error("Factorial is not defined for negative numbers.");
  }

  if (BigInt(n) === BigInt(0) || BigInt(n) === BigInt(1)) {
    return BigInt(1);
  }

  const { maxIterations = 10000, maxValue = BigInt(Number.MAX_SAFE_INTEGER) } = options;
  let result = BigInt(1);
  let i = BigInt(2);

  while (i <= n && result < maxValue) {
    result *= i;
    i++;

    if (i >= maxIterations) {
      throw new Error(`Factorial calculation exceeded the maximum iterations (${maxIterations}).`);
    }
  }

  return result;
}

// Added support for BigInt and BigInt64Array in tests
function testFactorial() {
  const factorial = (n: number | bigint) => {
    if (typeof n === 'number') {
      return factorialNumber(n);
    } else {
      return factorialBigInt(n);
    }
  };

  // Test with numbers
  for (let i = 0; i <= 12; i++) {
    console.log(`Factorial of ${i}: ${factorial(i)}`);
  }

  // Test with BigInt
  const bigIntFive = BigInt(5);
  console.log(`Factorial of BigInt(5): ${factorial(bigIntFive)}`);
}

import { max } from 'lodash';

type FactorialOptions = {
  maxIterations?: number;
  maxValue?: number;
};

/**
 * Calculates the factorial of a given number with optional resiliency options.
 * @param {number} n - The number for which the factorial is to be calculated.
 * @param {FactorialOptions} options - Optional resiliency options.
 * @returns {number} The factorial of the given number.
 */
function factorial(n: number, options: FactorialOptions = {}): number {
  if (n < 0) {
    throw new Error("Factorial is not defined for negative numbers.");
  }

  if (n === 0 || n === 1) {
    return 1;
  }

  const { maxIterations = 10000, maxValue = Number.MAX_SAFE_INTEGER } = options;
  let result = 1;
  let i = 2;

  while (i <= n && result < maxValue) {
    result *= i;
    i++;

    if (i >= maxIterations) {
      throw new Error(`Factorial calculation exceeded the maximum iterations (${maxIterations}).`);
    }
  }

  return result;
}

// Added type definitions for BigInt and BigInt64Array
declare global {
  namespace NodeJS {
    interface Global {
      BigInt: {
        prototype: {
          toString(): string;
        };
      };
      BigInt64Array: new (...args: any[]) => BigInt64Array;
    }
  }
}

// Added support for BigInt and BigInt64Array
function factorial(n: bigint, options: FactorialOptions = {}): bigint {
  if (BigInt(n) < BigInt(0)) {
    throw new Error("Factorial is not defined for negative numbers.");
  }

  if (BigInt(n) === BigInt(0) || BigInt(n) === BigInt(1)) {
    return BigInt(1);
  }

  const { maxIterations = 10000, maxValue = BigInt(Number.MAX_SAFE_INTEGER) } = options;
  let result = BigInt(1);
  let i = BigInt(2);

  while (i <= n && result < maxValue) {
    result *= i;
    i++;

    if (i >= maxIterations) {
      throw new Error(`Factorial calculation exceeded the maximum iterations (${maxIterations}).`);
    }
  }

  return result;
}

// Added support for BigInt and BigInt64Array in tests
function testFactorial() {
  const factorial = (n: number | bigint) => {
    if (typeof n === 'number') {
      return factorialNumber(n);
    } else {
      return factorialBigInt(n);
    }
  };

  // Test with numbers
  for (let i = 0; i <= 12; i++) {
    console.log(`Factorial of ${i}: ${factorial(i)}`);
  }

  // Test with BigInt
  const bigIntFive = BigInt(5);
  console.log(`Factorial of BigInt(5): ${factorial(bigIntFive)}`);
}