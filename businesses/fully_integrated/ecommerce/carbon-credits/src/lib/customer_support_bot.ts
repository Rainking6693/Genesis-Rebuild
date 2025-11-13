type SafeInteger = number & { __SafeInteger: true };
type CustomError = { message: string };

async function add(num1: number | string, num2: number | string): Promise<SafeInteger | CustomError> {
  // Basic input validation to ensure numbers are provided
  if (typeof num1 !== 'number' && typeof num2 !== 'number') {
    if (typeof num1 === 'string' && typeof num2 === 'string') {
      const parsedNum1 = parseFloat(num1);
      const parsedNum2 = parseFloat(num2);

      if (isNaN(parsedNum1) || isNaN(parsedNum2)) {
        return { message: 'Both arguments must be finite numbers or strings that can be parsed as numbers.' };
      }

      num1 = parsedNum1;
      num2 = parsedNum2;
    } else {
      return { message: 'Both arguments must be numbers or strings that can be parsed as numbers.' };
    }
  }

  // Check for NaN and Infinity values
  if (isNaN(num1) || isNaN(num2)) {
    return { message: 'Both arguments must be finite numbers.' };
  }

  // Perform the addition operation
  const sum = num1 + num2;

  // Check for overflow and return a safe integer
  if (sum > Number.MAX_SAFE_INTEGER || sum < Number.MIN_SAFE_INTEGER) {
    return safeAdd(num1, num2);
  }

  // Cast the result to a safe integer for type safety
  return sum as SafeInteger;
}

function safeAdd(num1: number, num2: number): SafeInteger | CustomError {
  const sum = num1 + num2;

  if (sum > Number.MAX_SAFE_INTEGER || sum < Number.MIN_SAFE_INTEGER) {
    return { message: 'The result exceeds the maximum safe integer.' };
  }

  return sum as SafeInteger;
}

type SafeInteger = number & { __SafeInteger: true };
type CustomError = { message: string };

async function add(num1: number | string, num2: number | string): Promise<SafeInteger | CustomError> {
  // Basic input validation to ensure numbers are provided
  if (typeof num1 !== 'number' && typeof num2 !== 'number') {
    if (typeof num1 === 'string' && typeof num2 === 'string') {
      const parsedNum1 = parseFloat(num1);
      const parsedNum2 = parseFloat(num2);

      if (isNaN(parsedNum1) || isNaN(parsedNum2)) {
        return { message: 'Both arguments must be finite numbers or strings that can be parsed as numbers.' };
      }

      num1 = parsedNum1;
      num2 = parsedNum2;
    } else {
      return { message: 'Both arguments must be numbers or strings that can be parsed as numbers.' };
    }
  }

  // Check for NaN and Infinity values
  if (isNaN(num1) || isNaN(num2)) {
    return { message: 'Both arguments must be finite numbers.' };
  }

  // Perform the addition operation
  const sum = num1 + num2;

  // Check for overflow and return a safe integer
  if (sum > Number.MAX_SAFE_INTEGER || sum < Number.MIN_SAFE_INTEGER) {
    return safeAdd(num1, num2);
  }

  // Cast the result to a safe integer for type safety
  return sum as SafeInteger;
}

function safeAdd(num1: number, num2: number): SafeInteger | CustomError {
  const sum = num1 + num2;

  if (sum > Number.MAX_SAFE_INTEGER || sum < Number.MIN_SAFE_INTEGER) {
    return { message: 'The result exceeds the maximum safe integer.' };
  }

  return sum as SafeInteger;
}